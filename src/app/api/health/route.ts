import { randomUUID } from "node:crypto";
import { succeed } from "@/lib/server/envelope";
import { leadStore } from "@/lib/server/leadStore";

/**
 * GET /api/health — target for uptime/synthetic monitoring (PRD section 50).
 *
 * Deliberately cheap: no database round-trip, so a monitoring probe hitting
 * this every minute from multiple regions costs nothing. It reports whether
 * the configured lead store is durable, which is the one fact worth a glance
 * without opening the dashboard — everything else (error rates, outbox age,
 * certificate expiry) belongs to the monitoring vendor, not this endpoint.
 *
 * Never cached (section 43): a stale "ok" is worse than a slow one.
 */
export function GET(): Response {
  const requestId = randomUUID();
  return succeed(
    {
      status: "ok",
      time: new Date().toISOString(),
      leadStore: { name: leadStore.name, durable: leadStore.durable },
    },
    requestId,
    200,
  );
}
