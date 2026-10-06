import {
  hasConsented,
  parseConsentCookie,
  type OptionalCategory,
} from "@/lib/analytics/consent";
import { CONSENT_COOKIE } from "@/lib/analytics/consent";

/**
 * The consent gate — PRD sections 38 and 45.
 *
 * Section 38 defines the event vocabulary a future analytics vendor would
 * receive. No vendor is wired into this build, so `track` fans out to nothing.
 * That is deliberate rather than an omission: it makes AC15 ("no optional
 * request fires and no marketing identifier is stored before a choice is
 * saved") true by construction, and it leaves the gate in place so that adding
 * a vendor is a change in one function rather than a change scattered across
 * the pages that emit events.
 *
 * Section 38 also constrains the payloads: allowlisted properties only, no lead
 * PII, no free text, and no marketing identifier persisted when consent is
 * refused. The type below encodes that — an event carries identifiers and
 * categories, never a name, an address or the contents of a form field.
 */

export type AnalyticsEvent =
  | { name: "page_view"; pageId: string; pageType: string; path: string }
  | { name: "service_view"; contentId: string; category: string }
  | {
      name: "cta_click";
      ctaId: string;
      placement: string;
      destinationType: "internal" | "external";
      pageId: string;
    }
  | { name: "contact_started"; formVersion: string }
  /* Section 38: emitted only after a durable accepted response, and carrying a
     random event id for deduplication — never any part of the lead itself. */
  | { name: "contact_submitted"; eventId: string; formVersion: string }
  | {
      name: "phone_click" | "email_click";
      channel: string;
      placement: string;
    };

/**
 * Which consent category an event needs. Every event in the current
 * vocabulary is analytics; the function exists so that adding a category
 * later is a change here rather than at each call site.
 */
function categoryFor(event: AnalyticsEvent): OptionalCategory {
  void event;
  return "analytics";
}

function readReceipt() {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((part) => part.startsWith(`${CONSENT_COOKIE}=`));
  return parseConsentCookie(match?.slice(CONSENT_COOKIE.length + 1));
}

/**
 * Emit an event if, and only if, the visitor has accepted its category.
 *
 * No vendor is connected, so a permitted event currently goes nowhere. The
 * check still runs, because the point of the gate is that it is the only path
 * to a vendor once one exists.
 */
export function track(event: AnalyticsEvent): void {
  const receipt = readReceipt();
  if (!hasConsented(receipt, categoryFor(event))) return;

  // Intentionally no destination. See the module comment.
  void event;
}
