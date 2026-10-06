import "server-only";
import { randomUUID } from "node:crypto";
import { appendFile, mkdir } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/server/db";
import type { ContactInput } from "@/lib/validation/contact";

/**
 * The persistence seam — PRD sections 41 and 42.
 *
 * The PRD's durable intake is a single PostgreSQL transaction writing the
 * submission, the lead and the outbox events together, after which background
 * workers fan out to confirmation email, internal notification and CRM sync.
 * The worker is out of scope for this build (see `PostgresLeadStore`'s own
 * comment), but the transaction it depends on is implemented here.
 *
 * What the interface preserves is the part that matters for correctness: the
 * route handler may only report success after `save` resolves, and a failure
 * must surface as a retryable error rather than a success screen. Three
 * implementations exist below — `JsonlLeadStore` (local file, not durable),
 * `UnavailableLeadStore` (fails every write) and `PostgresLeadStore` (the PRD's
 * behaviour) — selected by `selectStore()` with no call site changes either way.
 *
 * The local JSONL store is explicitly not durable: a serverless filesystem is
 * ephemeral, so on a deployed preview a saved record survives only as long as
 * the instance. That is why `durable` is reported back to the caller, and why
 * the deployed site says so on the contact page rather than implying an
 * enquiry has been filed somewhere a human will read it.
 */

export type StoredLead = {
  /** Opaque public reference. Encodes no email or company name (section 43). */
  reference: string;
  /** Internal id. Would be the submission UUID and CRM idempotency key. */
  submissionId: string;
  receivedAt: string;
};

export interface LeadStore {
  /** Human-readable name for diagnostics and the capability banner. */
  readonly name: string;
  /** False when a write cannot be relied on to outlive the request. */
  readonly durable: boolean;
  /**
   * Persist one enquiry. Must reject if the record is not stored; the caller
   * turns a rejection into a 503, never into a success response.
   */
  save(input: ContactInput, meta: SaveMeta): Promise<StoredLead>;
}

export type SaveMeta = {
  requestId: string;
  idempotencyKey: string;
  /** Coarse origin for abuse review. Never the full forwarded header chain. */
  clientHint: string;
};

/** Section 43: "Opaque references must not encode email or company name." */
function newReference(): string {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const block = () =>
    Array.from(
      { length: 4 },
      () => alphabet[Math.floor(Math.random() * alphabet.length)],
    ).join("");
  return `ENQ-${block()}-${block()}`;
}

/**
 * Appends one JSON object per line to a gitignored local file.
 *
 * Section 44 forbids writing enquiry contents to logs, so nothing from the
 * payload reaches stdout — only the reference, the request id and the field
 * count, which are safe to correlate against.
 */
class JsonlLeadStore implements LeadStore {
  readonly name = "local-jsonl";
  readonly durable = false;

  private readonly file: string;

  constructor(file: string) {
    this.file = file;
  }

  async save(input: ContactInput, meta: SaveMeta): Promise<StoredLead> {
    const record: StoredLead = {
      reference: newReference(),
      submissionId: randomUUID(),
      receivedAt: new Date().toISOString(),
    };

    const line = JSON.stringify({
      ...record,
      requestId: meta.requestId,
      idempotencyKey: meta.idempotencyKey,
      clientHint: meta.clientHint,
      submission: input,
    });

    await mkdir(path.dirname(this.file), { recursive: true });
    await appendFile(this.file, `${line}\n`, "utf8");

    // A safe summary only — no field values.
    console.info(
      `[intake] saved ${record.reference} request=${meta.requestId} services=${input.services.length}`,
    );

    return record;
  }
}

/**
 * Used where no filesystem write is possible or appropriate. It fails every
 * save, which is the honest behaviour: the route then returns 503 and the form
 * tells the visitor their enquiry was not stored, rather than showing a
 * reference for a record that does not exist.
 */
class UnavailableLeadStore implements LeadStore {
  readonly name = "unavailable";
  readonly durable = false;

  async save(): Promise<StoredLead> {
    throw new Error("No lead store is configured for this environment.");
  }
}

/**
 * The durable store — PRD sections 41 and 42.
 *
 * One Prisma transaction does the lead/submission/outbox write the PRD
 * describes: find-or-attach a lead, insert the submission linked to it,
 * insert the outbox rows the fan-out workers will later pick up, commit. If
 * anything in the transaction throws, Prisma rolls the whole thing back and
 * the rejection propagates to the route, which turns it into a 503 — nothing
 * here swallows an error into a false success.
 *
 * Lead attachment is a product choice, not a uniqueness constraint: section
 * 42 is explicit that dedup is by idempotency key, never by a unique lead
 * email, so `leads.normalized_email` carries no unique index. What this
 * store does instead is look for an existing lead with the same normalized
 * email that is not yet closed, and attach the new submission to it rather
 * than opening a new lead per enquiry from the same person. A closed lead
 * (or no match) gets a fresh one. This is a judgment call, not something the
 * PRD pins down explicitly — it is called out here so it is easy to revisit.
 */
class PostgresLeadStore implements LeadStore {
  readonly name = "postgres";
  readonly durable = true;

  async save(input: ContactInput, meta: SaveMeta): Promise<StoredLead> {
    const reference = newReference();
    const normalizedEmail = input.email.trim().toLowerCase();
    const now = new Date();

    const submission = await prisma.$transaction(async (tx) => {
      const openLead = await tx.lead.findFirst({
        where: { normalizedEmail, closedAt: null },
        orderBy: { createdAt: "desc" },
      });

      const lead =
        openLead ??
        (await tx.lead.create({
          data: {
            status: "new",
            company: input.company,
            normalizedEmail,
            sourceSummary: input.source?.landingPath,
          },
        }));

      const created = await tx.contactSubmission.create({
        data: {
          leadId: lead.id,
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          phone: input.phone || null,
          company: input.company,
          website: input.website || null,
          noWebsite: input.noWebsite,
          country: input.country,
          serviceIds: input.services as unknown as Prisma.InputJsonValue,
          budgetCode: input.budgetCode,
          timelineCode: input.timelineCode,
          summary: input.summary,
          productUrl: input.productUrl || null,
          preferredContact: input.preferredContact,
          noticeVersion: input.noticeVersion,
          formVersion: input.formVersion,
          acknowledgmentAt: now,
          sourceUtmSource: input.source?.utmSource,
          sourceUtmMedium: input.source?.utmMedium,
          sourceUtmCampaign: input.source?.utmCampaign,
          sourceLandingPath: input.source?.landingPath,
        },
      });

      if (openLead) {
        // Touch updatedAt: a new submission is activity on the existing
        // lead, even though none of its own columns changed.
        await tx.lead.update({
          where: { id: lead.id },
          data: { company: input.company },
        });
      }

      // Section 36/41: fan-out is a separate worker process. This only
      // leaves the work queued — no consumer exists in this build.
      await tx.outboxEvent.createMany({
        data: [
          { aggregateType: "lead", aggregateId: lead.id, kind: "send_confirmation_email" },
          { aggregateType: "lead", aggregateId: lead.id, kind: "notify_internal" },
          { aggregateType: "lead", aggregateId: lead.id, kind: "crm_sync" },
        ],
      });

      return created;
    });

    // A safe summary only — no field values (section 44).
    console.info(
      `[intake] saved ${reference} request=${meta.requestId} services=${input.services.length} store=postgres`,
    );

    return {
      reference,
      submissionId: submission.id,
      receivedAt: submission.createdAt.toISOString(),
    };
  }
}

/**
 * Where the local store writes.
 *
 * A serverless deployment has a read-only project directory and one writable
 * temporary directory, so writing under the working directory there fails
 * every save and the endpoint answers 503 to every visitor. Using the
 * temporary directory instead lets the whole path — validation, idempotency,
 * durable-write-then-respond — be exercised on the deployed site.
 *
 * It is still not durable: the file lives as long as the instance does. The
 * store reports `durable: false` either way, and the contact page and success
 * screen both say so rather than implying an enquiry has been filed.
 */
function defaultStoreFile(): string {
  const serverless = Boolean(process.env.VERCEL || process.env.AWS_REGION);
  return serverless
    ? path.join(os.tmpdir(), "softsyslab-leads.jsonl")
    : path.join(process.cwd(), ".data", "leads.jsonl");
}

/**
 * `LEAD_STORE=none` / `LEAD_STORE=file` are explicit overrides and always
 * win, exactly as before. With no override, `DATABASE_URL` being set
 * selects the durable Postgres store; otherwise the JSONL fallback behaves
 * exactly as it did before this store existed.
 */
function selectStore(): LeadStore {
  const override = process.env.LEAD_STORE;
  if (override === "none") return new UnavailableLeadStore();
  if (override === "file") {
    return new JsonlLeadStore(process.env.LEAD_STORE_FILE ?? defaultStoreFile());
  }
  if (process.env.DATABASE_URL) return new PostgresLeadStore();
  return new JsonlLeadStore(process.env.LEAD_STORE_FILE ?? defaultStoreFile());
}

export const leadStore: LeadStore = selectStore();
