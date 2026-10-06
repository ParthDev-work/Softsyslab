import { absoluteUrl, siteSettings } from "@/lib/settings/siteSettings";
import type { Crumb } from "@/components/ui/Breadcrumb";

/**
 * Structured data — PRD section 47.
 *
 * Deliberately narrow. Section 47 allows Organization "on the real entity with
 * verified URLs/contact details" and BreadcrumbList "on canonical hierarchy",
 * and rules out review stars and unsupported AggregateRating. Section 27 and
 * section 47 both exclude FAQPage, which Google retired as a rich-result
 * objective. Person and JobPosting require real approved people and genuine
 * active roles, neither of which exist here.
 *
 * So this build emits BreadcrumbList only. Organization is withheld while
 * siteSettings.verified is false: publishing structured data naming a legal
 * entity that has not been confirmed would put an unverifiable machine-readable
 * claim into search indexes, which is the hardest kind of error to retract.
 */

function JsonLdScript({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Values come from typed local content, never from user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function BreadcrumbJsonLd({ trail }: { trail: Crumb[] }) {
  if (trail.length < 2) return null;

  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: trail.map((crumb, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: crumb.label,
          item: absoluteUrl(crumb.href),
        })),
      }}
    />
  );
}

/** Emits nothing until the identity record is verified. See the module note. */
export function OrganizationJsonLd() {
  if (!siteSettings.verified || !siteSettings.legalName) return null;

  const sameAs = siteSettings.socialUrls.map((social) => social.url);

  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: siteSettings.legalName,
        alternateName: siteSettings.brandName,
        url: absoluteUrl("/"),
        ...(siteSettings.businessEmail
          ? { email: siteSettings.businessEmail }
          : {}),
        ...(siteSettings.phone ? { telephone: siteSettings.phone } : {}),
        ...(sameAs.length > 0 ? { sameAs } : {}),
      }}
    />
  );
}
