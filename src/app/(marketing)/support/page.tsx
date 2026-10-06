import type { Metadata } from "next";
import { CorporatePageTemplate } from "@/components/blocks/CorporatePageTemplate";
import { Notice } from "@/components/ui/Notice";
import { Section } from "@/components/ui/Layout";
import { buildMetadata } from "@/lib/seo/metadata";
import { corporatePage } from "@/content/pages";
import { siteSettings } from "@/lib/settings/siteSettings";

const page = corporatePage("support");

export const metadata: Metadata = buildMetadata(page.seo, page.path);

/**
 * PRD section 19's Support page.
 *
 * Section 19 is explicit that response and resolution commitments must not be
 * displayed without staffing and contractual support, and names the fields
 * that would be needed — supported hours and timezone, support email,
 * escalation contact, defect period. None is confirmed, so the page states
 * that rather than showing a bracketed slot.
 */
export default function SupportPage() {
  const hasSupportChannel = Boolean(
    siteSettings.supportHours && siteSettings.supportEmail,
  );

  return (
    <CorporatePageTemplate
      page={page}
      eyebrow="After release"
      trail={[
        { label: "Home", href: "/" },
        { label: "Support", href: "/support/" },
      ]}
      afterSections={
        hasSupportChannel ? null : (
          <Section tone="surface" labelledBy="coverage-h">
            <h2 id="coverage-h" className="sr-only">
              Published coverage
            </h2>
            <Notice
              tone="warning"
              role="note"
              title="No support coverage is published"
              className="max-w-quote"
            >
              <p>
                Supported hours, the timezone, a monitored support address, the
                escalation contact and any defect period are all set per
                engagement and recorded in its agreement. None is published here,
                because none has been confirmed against actual staffing.
              </p>
              <p>
                Existing customers should use the channel named in their own
                agreement. New enquiries can use the contact form.
              </p>
            </Notice>
          </Section>
        )
      }
      ctaHeading="Support starts with knowing what you have."
      ctaBody="Tell us what the application does, what it depends on and who currently looks after it."
    />
  );
}
