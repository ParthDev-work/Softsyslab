/**
 * Single source of company identity — PRD section 19 ("Store this information once
 * in CMS settings and reuse it everywhere") and AC05.
 *
 * Footer, contact page, business-information page and Organization JSON-LD all read
 * from here. Nothing else in the codebase may hardcode a company fact.
 *
 * `verified` stays false until the business owner supplies and signs off the real
 * values listed in LAUNCH-BLOCKERS.md. While it is false the site renders the
 * unverified-facts banner and the Organization JSON-LD is withheld.
 */

export type SiteSettings = {
  /** Trading name. The only company fact confirmed for this build. */
  brandName: string;
  /** Registered legal entity name. Null until supplied by the business owner. */
  legalName: string | null;
  /** Country or state of incorporation. */
  jurisdiction: string | null;
  /** Company registration number, where the jurisdiction issues one. */
  registrationNumber: string | null;
  /** Registered address — shown labelled as registered, never as a staffed office. */
  registeredAddress: string | null;
  /** Operating address — labelled separately from the registered address. */
  operatingAddress: string | null;
  /** Canonical production hostname, origin only, no trailing slash. */
  canonicalOrigin: string;
  /** Monitored business enquiry mailbox. */
  businessEmail: string | null;
  /** Monitored support mailbox. */
  supportEmail: string | null;
  /** Monitored security mailbox. Gates the "Contact the Security Team" CTA wording. */
  securityEmail: string | null;
  /** Answered business telephone in E.164 form. */
  phone: string | null;
  /** Supported hours and timezone for the support page. */
  supportHours: string | null;
  /** Only non-empty entries render. Dead placeholder URLs are omitted (section 39). */
  socialUrls: Array<{ label: string; url: string }>;
  /** False until every field above is confirmed by an accountable owner. */
  verified: boolean;
  /** ISO date of the last identity verification, or null while unverified. */
  lastVerifiedAt: string | null;
};

export const siteSettings: SiteSettings = {
  brandName: "SoftSysLab",
  legalName: null,
  jurisdiction: null,
  registrationNumber: null,
  registeredAddress: null,
  operatingAddress: null,
  canonicalOrigin:
    process.env.NEXT_PUBLIC_SITE_ORIGIN?.replace(/\/+$/, "") ??
    "http://localhost:3000",
  businessEmail: "admin@softsyslab.com",
  supportEmail: "admin@softsyslab.com",
  securityEmail: "admin@softsyslab.com",
  phone: null,
  supportHours: null,
  socialUrls: [],
  verified: false,
  lastVerifiedAt: null,
};

/** Absolute URL on the canonical origin. Used for self-canonicals and JSON-LD. */
export function absoluteUrl(path: string): string {
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${siteSettings.canonicalOrigin}${suffix}`;
}

/**
 * Contact channels that actually exist. An unverified or absent channel is omitted
 * rather than rendered as a dead link (section 12: "real text links").
 */
export function availableContactChannels(): Array<{
  label: string;
  value: string;
  href: string;
}> {
  const channels: Array<{ label: string; value: string; href: string }> = [];
  if (siteSettings.businessEmail) {
    channels.push({
      label: "Business email",
      value: siteSettings.businessEmail,
      href: `mailto:${siteSettings.businessEmail}`,
    });
  }
  if (siteSettings.supportEmail) {
    channels.push({
      label: "Support email",
      value: siteSettings.supportEmail,
      href: `mailto:${siteSettings.supportEmail}`,
    });
  }
  if (siteSettings.phone) {
    channels.push({
      label: "Telephone",
      value: siteSettings.phone,
      href: `tel:${siteSettings.phone.replace(/[^+\d]/g, "")}`,
    });
  }
  return channels;
}
