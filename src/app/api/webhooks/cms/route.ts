import { randomUUID } from "node:crypto";
import { revalidateTag } from "next/cache";
import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
import { fail, succeed } from "@/lib/server/envelope";
import { prisma } from "@/lib/server/db";

/**
 * POST /api/webhooks/cms — PRD section 34/43.
 *
 * "Signed event id, timestamp, record id and action. Signature verification
 * plus replay protection; queues cache invalidation for the affected page[s]."
 *
 * Configure this in the Sanity project (manage.sanity.io -> API -> Webhooks)
 * pointed at this route, with CMS_WEBHOOK_SECRET as its secret, triggering on
 * create/update/delete across all document types, and this exact projection
 * as the payload:
 *
 *   {
 *     "eventId": _rev,
 *     "timestamp": _updatedAt,
 *     "documentId": _id,
 *     "type": _type,
 *     "slug": slug.current,
 *     "operation": delta::operation()
 *   }
 *
 * `_rev` changes on every mutation, so `(documentId, eventId)` is a stable
 * dedup key per edit — exactly the shape src/lib/content/sanitySource.ts
 * already tags its queries with (`cms:<type>` and `cms:<type>:<slug>`), so
 * the tags invalidated here are exactly the tags a read could have been
 * cached under.
 */

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const PROVIDER = "sanity";

interface CmsWebhookPayload {
  eventId: string;
  timestamp?: string;
  documentId: string;
  type: string;
  slug?: string | null;
  operation?: string;
}

function isWebhookPayload(value: unknown): value is CmsWebhookPayload {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return typeof record.eventId === "string" && typeof record.documentId === "string" && typeof record.type === "string";
}

export async function POST(request: Request): Promise<Response> {
  const requestId = randomUUID();

  const secret = process.env.CMS_WEBHOOK_SECRET;
  if (!secret) {
    // Not a client error: the deployment simply has not configured the CMS yet.
    return fail("NOT_CONFIGURED", "CMS_WEBHOOK_SECRET is not set.", requestId, 503);
  }

  const raw = await request.text();
  const signature = request.headers.get(SIGNATURE_HEADER_NAME);
  if (!signature || !(await isValidSignature(raw, signature, secret))) {
    return fail("UNAUTHORIZED", "Invalid webhook signature.", requestId, 401);
  }

  let payload: unknown;
  try {
    payload = JSON.parse(raw);
  } catch {
    return fail("MALFORMED_REQUEST", "The request body could not be read as JSON.", requestId, 400);
  }

  if (!isWebhookPayload(payload)) {
    return fail(
      "MALFORMED_REQUEST",
      "Expected eventId, documentId and type in the webhook payload.",
      requestId,
      400,
    );
  }

  // Replay protection: the unique (provider, externalEventId) constraint on
  // IntegrationEvent rejects a redelivered event instead of reprocessing it.
  try {
    await prisma.integrationEvent.create({
      data: {
        provider: PROVIDER,
        externalEventId: `${payload.documentId}:${payload.eventId}`,
        eventType: payload.operation ?? "unknown",
        payload: payload as object,
        processingStatus: "received",
      },
    });
  } catch (error) {
    const isDuplicate =
      typeof error === "object" && error !== null && "code" in error && error.code === "P2002";
    if (isDuplicate) {
      // Already processed this exact event — acknowledge without reprocessing.
      return succeed({ revalidated: false, reason: "replay" }, requestId, 200);
    }
    return fail("STORAGE_UNAVAILABLE", "Could not record this webhook event.", requestId, 503);
  }

  const tags = new Set<string>(["cms", `cms:${payload.type}`]);
  if (payload.slug) tags.add(`cms:${payload.type}:${payload.slug}`);
  // "max" — these fetches are cached indefinitely until a webhook says
  // otherwise, so invalidation has no shorter profile to target.
  for (const tag of tags) revalidateTag(tag, "max");

  await prisma.integrationEvent.updateMany({
    where: { provider: PROVIDER, externalEventId: `${payload.documentId}:${payload.eventId}` },
    data: { processedAt: new Date(), processingStatus: "processed" },
  });

  return succeed({ revalidated: true, tags: [...tags] }, requestId, 200);
}

/** Every other method on this path is rejected explicitly. */
export async function GET(): Promise<Response> {
  return fail("MALFORMED_REQUEST", "This endpoint accepts POST only.", randomUUID(), 405, {
    headers: { Allow: "POST" },
  });
}
