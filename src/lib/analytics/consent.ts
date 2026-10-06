/**
 * Consent model — PRD section 45.
 *
 * Necessary-only applies until a choice is saved. No optional category is
 * pre-checked. The receipt is versioned and stored in a first-party cookie that
 * is itself strictly necessary, and it can be withdrawn from the footer on any
 * page.
 *
 * The receipt deliberately contains no contact identity: section 42's
 * consent_receipts table stores an anonymous receipt id, and the client-side
 * equivalent here stores nothing that could identify the visitor.
 */

export const CONSENT_COOKIE = "ssl_consent";
export const CONSENT_POLICY_VERSION = "2026-10-06.1";
/** Six months. Re-asking after that is a deliberate choice, not an accident. */
export const CONSENT_MAX_AGE_SECONDS = 60 * 60 * 24 * 182;

export const OPTIONAL_CATEGORIES = ["analytics"] as const;
export type OptionalCategory = (typeof OPTIONAL_CATEGORIES)[number];

export type ConsentReceipt = {
  policyVersion: string;
  /** Categories the visitor actively accepted. Never pre-populated. */
  accepted: OptionalCategory[];
  capturedAt: string;
};

export function parseConsentCookie(raw: string | undefined): ConsentReceipt | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(decodeURIComponent(raw));
    if (typeof parsed !== "object" || parsed === null) return null;

    const candidate = parsed as Partial<ConsentReceipt>;
    if (candidate.policyVersion !== CONSENT_POLICY_VERSION) return null;
    if (!Array.isArray(candidate.accepted)) return null;
    if (typeof candidate.capturedAt !== "string") return null;

    const accepted = candidate.accepted.filter((value): value is OptionalCategory =>
      (OPTIONAL_CATEGORIES as readonly string[]).includes(value as string),
    );
    return {
      policyVersion: candidate.policyVersion,
      accepted,
      capturedAt: candidate.capturedAt,
    };
  } catch {
    return null;
  }
}

export function serializeConsentCookie(receipt: ConsentReceipt): string {
  return encodeURIComponent(JSON.stringify(receipt));
}

export function hasConsented(
  receipt: ConsentReceipt | null,
  category: OptionalCategory,
): boolean {
  return receipt?.accepted.includes(category) ?? false;
}
