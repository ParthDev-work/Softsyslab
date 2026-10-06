import "server-only";
import { createHash } from "node:crypto";

/**
 * Idempotency — PRD sections 42 and 43, and AC08.
 *
 * Section 43: "Same key and same request returns original success; same key
 * and different payload returns 409. Expired key allows a new request."
 * Section 42 adds that deduplication uses the idempotency key, never a unique
 * lead email — a later genuine enquiry from the same person is a new
 * submission, not a duplicate.
 *
 * The record keeps a hash of the request rather than the request itself, so
 * replay detection never retains a second copy of an enquiry's contents.
 *
 * Like the rate limiter, this map is per-instance. Section 42's durable
 * equivalent is the idempotency_keys table with a 24-hour default expiry; the
 * shape of the record here matches it so that moving to the database is a
 * change of storage rather than of logic.
 */

export type IdempotencyRecord = {
  requestHash: string;
  /** The response body replayed verbatim on a matching retry. */
  result: { reference: string; status: "received" };
  responseCode: number;
  expiresAt: number;
};

export type IdempotencyLookup =
  | { state: "fresh" }
  | { state: "replay"; record: IdempotencyRecord }
  | { state: "conflict" };

const TTL_MS = 24 * 60 * 60 * 1000;
const MAX_TRACKED_KEYS = 10_000;

const store = new Map<string, IdempotencyRecord>();

export function hashPayload(payload: unknown): string {
  return createHash("sha256").update(JSON.stringify(payload)).digest("hex");
}

export function lookup(
  scope: string,
  key: string,
  requestHash: string,
  now = Date.now(),
): IdempotencyLookup {
  const scoped = `${scope}:${key}`;
  const existing = store.get(scoped);

  if (!existing || existing.expiresAt <= now) {
    // An expired key allows a new request (section 43).
    if (existing) store.delete(scoped);
    return { state: "fresh" };
  }

  if (existing.requestHash !== requestHash) return { state: "conflict" };
  return { state: "replay", record: existing };
}

export function remember(
  scope: string,
  key: string,
  record: Omit<IdempotencyRecord, "expiresAt">,
  now = Date.now(),
): void {
  if (store.size > MAX_TRACKED_KEYS) {
    for (const [existingKey, value] of store) {
      if (value.expiresAt <= now) store.delete(existingKey);
      if (store.size <= MAX_TRACKED_KEYS) break;
    }
  }
  store.set(`${scope}:${key}`, { ...record, expiresAt: now + TTL_MS });
}
