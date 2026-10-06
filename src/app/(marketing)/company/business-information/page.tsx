import type { Metadata } from "next";
import { CorporatePageTemplate } from "@/components/blocks/CorporatePageTemplate";
import { Section, SectionHeading } from "@/components/ui/Layout";
import { buildMetadata } from "@/lib/seo/metadata";
import { corporatePage } from "@/content/pages";
import { siteSettings } from "@/lib/settings/siteSettings";

const page = corporatePage("business-information");

export const metadata: Metadata = buildMetadata(page.seo, page.path);

/**
 * PRD section 19's Business Information page — the single place company
 * identity is displayed, read from the one settings record the footer, the
 * contact page and the Organization structured data also read.
 *
 * Every field shows its own status. An unverified field says "Not published"
 * rather than showing a bracketed placeholder, because section 26 requires
 * blocking placeholder publication rather than hiding it.
 */
export default function BusinessInformationPage() {
  const fields: Array<{ label: string; value: string | null; note?: string }> = [
    { label: "Trading name", value: siteSettings.brandName },
    { label: "Legal name", value: siteSettings.legalName },
    { label: "Jurisdiction", value: siteSettings.jurisdiction },
    {
      label: "Registration number",
      value: siteSettings.registrationNumber,
      note: "Where the jurisdiction issues one.",
    },
    {
      label: "Registered address",
      value: siteSettings.registeredAddress,
      note: "The address recorded with the registry. Not necessarily a staffed office.",
    },
    {
      label: "Operating address",
      value: siteSettings.operatingAddress,
      note: "Where work is actually carried out.",
    },
    { label: "Website", value: siteSettings.canonicalOrigin },
    { label: "Business email", value: siteSettings.businessEmail },
    { label: "Support email", value: siteSettings.supportEmail },
    { label: "Telephone", value: siteSettings.phone },
    {
      label: "Last verified",
      value: siteSettings.lastVerifiedAt,
      note: "The date an accountable owner last confirmed these details.",
    },
  ];

  const published = fields.filter((field) => field.value !== null).length;

  return (
    <CorporatePageTemplate
      page={page}
      eyebrow="Identity"
      trail={[
        { label: "Home", href: "/" },
        { label: "Company", href: "/company/" },
        {
          label: "Business Information",
          href: "/company/business-information/",
        },
      ]}
      beforeSections={
        <Section tone="surface" labelledBy="record-h">
          <div className="mb-6 flex flex-wrap items-baseline justify-between gap-4">
            <SectionHeading id="record-h">Company record</SectionHeading>
            <p className="font-mono text-xs text-dim">
              {published} of {fields.length} fields published
            </p>
          </div>

          <dl className="grid gap-0 border-t border-line p-0">
            {fields.map((field) => (
              <div
                key={field.label}
                className="grid gap-x-8 gap-y-1 border-b border-hairline py-4 md:grid-cols-[minmax(0,14rem)_minmax(0,1fr)]"
              >
                <dt className="text-body font-medium text-anchor">
                  {field.label}
                  {field.note ? (
                    <span className="mt-1 block text-xs font-normal text-muted">
                      {field.note}
                    </span>
                  ) : null}
                </dt>
                <dd className="text-body">
                  {field.value ? (
                    <span className="text-text">{field.value}</span>
                  ) : (
                    <span className="inline-flex items-center gap-2 text-muted">
                      <span
                        aria-hidden="true"
                        className="inline-block size-2 rounded-full border border-warning bg-warning-bg"
                      />
                      Not published — pending verification
                    </span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </Section>
      }
      ctaHeading="Need the contracting entity confirmed?"
      ctaBody="Ask before an engagement and it is stated in the proposal, where it applies to a specific agreement."
    />
  );
}
