import type { Metadata } from "next";
import { CorporatePageTemplate } from "@/components/blocks/CorporatePageTemplate";
import { buildMetadata } from "@/lib/seo/metadata";
import { corporatePage } from "@/content/pages";

const page = corporatePage("how-we-work");

export const metadata: Metadata = buildMetadata(page.seo, page.path);

/** PRD section 19's How We Work page. */
export default function HowWeWorkPage() {
  return (
    <CorporatePageTemplate
      page={page}
      eyebrow="Process"
      trail={[
        { label: "Home", href: "/" },
        { label: "How We Work", href: "/how-we-work/" },
      ]}
      ctaHeading="Start with a conversation about scope."
      ctaBody="The first useful output of an engagement is a shared understanding of what is being built and who decides what."
    />
  );
}
