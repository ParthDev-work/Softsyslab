import "server-only";

/**
 * Sliding-window rate limiting — PRD section 43.
 *
 * The published starting setting is 5 attempts per 15 minutes per address,
 * which section 43 is careful to call a proposed setting tuned for shared
 * networks, not a security guarantee.
 *
 * This implementation is in-memory and therefore per-instance. On a serverless
 * platform that means the effective limit is looser than the nominal one,
 * because each cold instance starts with an empty window. It raises the cost of
 * casual abuse and nothing more; the PRD's real control is a shared store plus
 * the recipient and global abuse controls, which belong with the durable
 * backend. Saying so here is more useful than implying protection that a
 * distributed deployment does not have.
 */

export type RateLimitResult =
  | { allowed: true; remaining: number }
  | { allowed: false; retryAfterSeconds: number };

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;
/** Stop the map growing without bound if a process lives a long time. */
const MAX_TRACKED_KEYS = 10_000;

const hits = new Map<string, number[]>();

export function rateLimit(
  key: string,
  now = Date.now(),
  maxAttempts = MAX_ATTEMPTS,
  windowMs = WINDOW_MS,
): RateLimitResult {
  const cutoff = now - windowMs;
  const recent = (hits.get(key) ?? []).filter((at) => at > cutoff);

  if (recent.length >= maxAttempts) {
    const oldest = recent[0] ?? now;
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((oldest + windowMs - now) / 1000),
    );
    hits.set(key, recent);
    return { allowed: false, retryAfterSeconds };
  }

  recent.push(now);
  hits.set(key, recent);

  if (hits.size > MAX_TRACKED_KEYS) {
    for (const [existingKey, timestamps] of hits) {
      if (timestamps.every((at) => at <= cutoff)) hits.delete(existingKey);
      if (hits.size <= MAX_TRACKED_KEYS) break;
    }
  }

  return { allowed: true, remaining: maxAttempts - recent.length };
}

/**
 * A coarse client key. Takes only the first hop of x-forwarded-for, because
 * the rest of the chain is attacker-controlled, and falls back to a shared
 * bucket rather than letting a missing header bypass the limit entirely.
 */
export function clientKey(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  const first = forwarded?.split(",")[0]?.trim();
  return first || headers.get("x-real-ip") || "unknown";
}
