import { randomUUID } from "node:crypto";
import { fail, succeed } from "@/lib/server/envelope";
import { hashPayload, lookup, remember } from "@/lib/server/idempotency";
import { leadStore } from "@/lib/server/leadStore";
import { clientKey, rateLimit } from "@/lib/server/rateLimit";
import { contactSchema, toFieldErrors } from "@/lib/validation/contact";
import { siteSettings } from "@/lib/settings/siteSettings";

/**
 * POST /api/contact — PRD sections 41, 42 and 43, REQ-LEAD-01, AC06-AC10.
 *
 * Section 41's write sequence, implemented in order:
 *
 *   1. parse a bounded body
 *   2. verify origin and content type
 *   3. rate-limit
 *   4. validate normalised values against the shared schema
 *   5. (verify clean upload tokens — not applicable, no uploads exist)
 *   6. persist durably
 *   7. respond
 *
 * The ordering is deliberate. Validation runs after the rate limit so that a
 * flood of malformed requests is cheap to reject, and persistence runs last so
 * that nothing is written for a request that was going to be refused anyway.
 *
 * Section 41: "Database unavailable means return a retryable error, not a
 * success screen or an email-only lead." A store failure therefore produces
 * 503 and the client keeps the visitor's answers.
 */

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** Section 43: bounded payloads. 64 KB is far above a 5,000-character summary. */
const MAX_BODY_BYTES = 64 * 1024;

const IDEMPOTENCY_SCOPE = "contact";

function allowedOrigins(): string[] {
  const configured = process.env.ALLOWED_ORIGINS?.split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  if (configured && configured.length > 0) return configured;
  return [siteSettings.canonicalOrigin];
}

/**
 * Same-origin check. The browser sends Origin on cross-origin POSTs, so a
 * mismatch is a clear signal. A missing Origin is allowed through to
 * validation rather than rejected outright: non-browser clients legitimately
 * omit it, and this is one layer of defence rather than the authorisation.
 */
function originAllowed(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  return allowedOrigins().includes(origin);
}

export async function POST(request: Request): Promise<Response> {
  const requestId = randomUUID();

  if (!originAllowed(request)) {
    return fail(
      "FORBIDDEN_ORIGIN",
      "This request did not come from an allowed origin.",
      requestId,
      403,
    );
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return fail(
      "UNSUPPORTED_MEDIA_TYPE",
      "Send this request as application/json.",
      requestId,
      415,
    );
  }

  // Section 43: bounded body. Check the declared length, then the actual bytes,
  // because Content-Length can be absent or wrong.
  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (declaredLength > MAX_BODY_BYTES) {
    return fail(
      "PAYLOAD_TOO_LARGE",
      "This request is larger than the limit for this endpoint.",
      requestId,
      413,
    );
  }

  const raw = await request.text();
  if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) {
    return fail(
      "PAYLOAD_TOO_LARGE",
      "This request is larger than the limit for this endpoint.",
      requestId,
      413,
    );
  }

  let payload: unknown;
  try {
    payload = JSON.parse(raw);
  } catch {
    return fail(
      "MALFORMED_REQUEST",
      "The request body could not be read as JSON.",
      requestId,
      400,
    );
  }

  const limit = rateLimit(`contact:${clientKey(request.headers)}`);
  if (!limit.allowed) {
    return fail(
      "RATE_LIMITED",
      "There have been several attempts. Please wait a few minutes and try again, or contact us by email.",
      requestId,
      429,
      { headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  /* Section 43 requires an idempotency key on this endpoint. It is taken from
     the header so a retry of an uncertain request is recognised even when the
     body is byte-identical. */
  const idempotencyKey = request.headers.get("idempotency-key")?.trim();
  if (!idempotencyKey || idempotencyKey.length > 128) {
    return fail(
      "MALFORMED_REQUEST",
      "This request is missing a valid Idempotency-Key header.",
      requestId,
      400,
    );
  }

  const requestHash = hashPayload(payload);
  const idempotency = lookup(IDEMPOTENCY_SCOPE, idempotencyKey, requestHash);

  if (idempotency.state === "conflict") {
    // Section 43: same key, different payload.
    return fail(
      "IDEMPOTENCY_CONFLICT",
      "This idempotency key has already been used with different answers. Use a new key for a new enquiry.",
      requestId,
      409,
    );
  }

  if (idempotency.state === "replay") {
    // Section 43: 200 for an identical replay, returning the original result.
    return succeed(idempotency.record.result, requestId, 200);
  }

  // Section 43: unknown fields are stripped rather than accepted silently.
  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    return fail(
      "VALIDATION_ERROR",
      "Please check the highlighted fields.",
      requestId,
      422,
      { fields: toFieldErrors(parsed.error) as Record<string, string> },
    );
  }

  /* Section 20 and section 43: the submitted website and product addresses are
     stored as strings. Nothing here fetches them, now or later — that is the
     SSRF defence, and it is a property of the code rather than a setting. */

  try {
    const stored = await leadStore.save(parsed.data, {
      requestId,
      idempotencyKey,
      clientHint: clientKey(request.headers),
    });

    const result = { reference: stored.reference, status: "received" as const };
    remember(IDEMPOTENCY_SCOPE, idempotencyKey, {
      requestHash,
      result,
      responseCode: 201,
    });

    // Section 43: 201 for a new durable record.
    return succeed(result, requestId, 201);
  } catch {
    /* Section 41: a storage failure is retryable, never a success screen.
       The cause is not echoed back — section 43 forbids exposing internals. */
    return fail(
      "STORAGE_UNAVAILABLE",
      "We could not save your enquiry. Nothing was sent and your answers are still here — please try again.",
      requestId,
      503,
      { headers: { "Retry-After": "30" } },
    );
  }
}

/** Section 43: every other method on this path is rejected explicitly. */
export async function GET(): Promise<Response> {
  return fail(
    "MALFORMED_REQUEST",
    "This endpoint accepts POST only.",
    randomUUID(),
    405,
    { headers: { Allow: "POST" } },
  );
}
