import type { Metadata } from "next";
import { PolicyPageTemplate } from "@/components/blocks/PolicyPageTemplate";
import { buildMetadata } from "@/lib/seo/metadata";
import { policyPage } from "@/content/legal";

const page = policyPage("terms");

export const metadata: Metadata = buildMetadata(page.seo, page.path);

/** PRD section 25. Structure and required inputs only — see PolicyPageTemplate. */
export default function Page() {
  return (
    <PolicyPageTemplate
      page={page}
      trail={[
        { label: "Home", href: "/" },
        { label: "Website Terms", href: "/terms/" },
      ]}
    />
  );
}
