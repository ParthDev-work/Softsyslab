import type { Metadata } from "next";
import { CorporatePageTemplate } from "@/components/blocks/CorporatePageTemplate";
import { buildMetadata } from "@/lib/seo/metadata";
import { corporatePage } from "@/content/pages";

const page = corporatePage("security");

export const metadata: Metadata = buildMetadata(page.seo, page.path);

/**
 * PRD section 24's Security page, with the section 54 wireframe's anchored
 * contents list and no decorative shields.
 *
 * Section 24 requires an internal evidence owner, a last verified date and a
 * stated scope for every claim. None exists, so the page publishes only two
 * kinds of statement: how project requirements get agreed, which is a process
 * description, and the controls built into this website, which anyone can
 * verify by inspecting it — flagged, as section 24 directs, as build
 * requirements rather than as evidence about client projects.
 */
export default function SecurityPage() {
  return (
    <CorporatePageTemplate
      page={page}
      eyebrow="Trust"
      trail={[
        { label: "Home", href: "/" },
        { label: "Security", href: "/security/" },
      ]}
      ctaHeading="Bring your security requirements to scoping."
      ctaBody="Regulated sectors and enterprise procurement usually carry requirements that change the architecture, so they belong in the first conversation rather than the last."
    />
  );
}
