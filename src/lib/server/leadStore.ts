import "server-only";
import { randomUUID } from "node:crypto";
import { appendFile, mkdir } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import type { ContactInput } from "@/lib/validation/contact";

/**
 * The persistence seam — PRD sections 41 and 42.
 *
 * The PRD's durable intake is a single PostgreSQL transaction writing the
 * submission, the lead and the outbox events together, after which background
 * workers fan out to confirmation email, internal notification and CRM sync.
 * That is out of scope for this build, so the contract lives here as an
 * interface and the only implementation appends to a local file.
 *
 * What the interface preserves is the part that matters for correctness: the
 * route handler may only report success after `save` resolves, and a failure
 * must surface as a retryable error rather than a success screen. Swapping in
 * Postgres plus an outbox means implementing `LeadStore` and changing the one
 * line that selects it — no call site changes.
 *
 * The local store is explicitly not durable: a serverless filesystem is
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

function selectStore(): LeadStore {
  if (process.env.LEAD_STORE === "none") return new UnavailableLeadStore();
  return new JsonlLeadStore(process.env.LEAD_STORE_FILE ?? defaultStoreFile());
}

export const leadStore: LeadStore = selectStore();
