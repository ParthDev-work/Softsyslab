import type { Metadata } from "next";
import { CorporatePageTemplate } from "@/components/blocks/CorporatePageTemplate";
import { buildMetadata } from "@/lib/seo/metadata";
import { corporatePage } from "@/content/pages";

const page = corporatePage("company");

export const metadata: Metadata = buildMetadata(page.seo, page.path);

/**
 * PRD section 19's Company page.
 *
 * Section 19 supplies a proposed mission, vision and values and then states
 * that "owner approval is required before adopting these as company
 * statements". No approval exists, so they are not published. Team, history,
 * timeline and locations are absent for the same reason, and the page says so
 * rather than leaving the reader to wonder.
 */
export default function CompanyPage() {
  return (
    <CorporatePageTemplate
      page={page}
      eyebrow="Company"
      trail={[
        { label: "Home", href: "/" },
        { label: "Company", href: "/company/" },
      ]}
      ctaHeading="Tell us what you're building."
      ctaBody="You can evaluate the process and the scope now. The company facts follow once their owner has confirmed them."
    />
  );
}
