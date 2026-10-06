import type { Metadata } from "next";
import { CorporatePageTemplate } from "@/components/blocks/CorporatePageTemplate";
import { Notice } from "@/components/ui/Notice";
import { Section } from "@/components/ui/Layout";
import { buildMetadata } from "@/lib/seo/metadata";
import { corporatePage } from "@/content/pages";
import {
  publishableTechnologies,
  unverifiedTechnologyCount,
} from "@/content/technologies";

const page = corporatePage("technologies");

export const metadata: Metadata = buildMetadata(page.seo, page.path);

/**
 * PRD section 17's hub. Section 11 marks the category pages P1, and section 17
 * gives the hub substantive standalone content — selection criteria,
 * application layers, operations, integration boundaries — so it stands on its
 * own without them.
 *
 * The capability list is withheld entirely: section 17 requires a status, an
 * internal owner, an evidence reference and a review date per technology, and
 * no record has them.
 */
export default function TechnologiesPage() {
  return (
    <CorporatePageTemplate
      page={page}
      eyebrow="Technology"
      trail={[
        { label: "Home", href: "/" },
        { label: "Technologies", href: "/technologies/" },
      ]}
      afterSections={
        publishableTechnologies.length === 0 ? (
          <Section tone="surface" labelledBy="register-h">
            <h2 id="register-h" className="sr-only">
              Capability register status
            </h2>
            <Notice
              tone="warning"
              role="note"
              title="No technology capability list is published"
              className="max-w-quote"
            >
              <p>
                {unverifiedTechnologyCount} candidate entries are held in the
                internal register and none has completed review. A record
                publishes only once it carries a named internal capability
                owner, an evidence reference and a last-reviewed date.
              </p>
              <p>
                If a specific technology matters to your evaluation, ask about
                it directly. An answer given against a named project is worth
                more than a logo on a page.
              </p>
            </Notice>
          </Section>
        ) : null
      }
      ctaHeading="Bring the constraints, not just the requirements."
      ctaBody="The systems you already run, the team who will operate the result and the cost you can carry shape the architecture more than the feature list does."
    />
  );
}
