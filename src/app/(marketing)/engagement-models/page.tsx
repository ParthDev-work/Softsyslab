import type { Metadata } from "next";
import { CorporatePageTemplate } from "@/components/blocks/CorporatePageTemplate";
import { Section, SectionHeading } from "@/components/ui/Layout";
import { buildMetadata } from "@/lib/seo/metadata";
import { corporatePage, engagementModels } from "@/content/pages";

const page = corporatePage("engagement-models");

export const metadata: Metadata = buildMetadata(page.seo, page.path);

/**
 * PRD section 19's engagement comparison.
 *
 * The table is a real table on wide screens and a definition list on narrow
 * ones, which is section 31's "forms and tables remain readable" handled by
 * layout rather than by a horizontal scroll trap. Section 30 requires a
 * labelled scroll region where one is genuinely needed; here it is not, because
 * the content reflows.
 *
 * No rates, ranges or payment terms appear. Section 19 permits those only after
 * contract and counsel review.
 */
export default function EngagementModelsPage() {
  return (
    <CorporatePageTemplate
      page={page}
      eyebrow="Commercial"
      trail={[
        { label: "Home", href: "/" },
        { label: "Engagement Models", href: "/engagement-models/" },
      ]}
      contentsExtra={[{ id: "comparison", heading: "Compare the models" }]}
      afterSections={
        <Section tone="surface" labelledBy="comparison">
          <SectionHeading id="comparison" className="mb-8">
            Compare the models
          </SectionHeading>

          {/* Wide: a real table with scope row headers. */}
          <div className="hidden lg:block">
            <table className="w-full border-collapse text-left">
              <caption className="sr-only">
                Engagement models compared by best fit, advantages, limits and
                the documents each requires.
              </caption>
              <thead>
                <tr className="border-b border-line">
                  {["Model", "Best fit and billing", "Advantages", "Limits", "Documents"].map(
                    (heading) => (
                      <th
                        key={heading}
                        scope="col"
                        className="type-meta p-3 pb-3.5 align-bottom text-dim"
                      >
                        {heading}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {engagementModels.map((model) => (
                  <tr key={model.model} className="border-b border-hairline align-top">
                    <th
                      scope="row"
                      className="p-3 text-body font-semibold text-anchor"
                    >
                      {model.model}
                    </th>
                    <td className="p-3 text-small text-muted">{model.bestFit}</td>
                    <td className="p-3 text-small text-muted">
                      {model.advantages}
                    </td>
                    <td className="p-3 text-small text-muted">{model.limits}</td>
                    <td className="p-3 text-small text-muted">
                      {model.documents}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Narrow: the same data as cards, no sideways scrolling. */}
          <ul className="grid gap-4 p-0 lg:hidden">
            {engagementModels.map((model) => (
              <li
                key={model.model}
                className="rounded-card border border-hairline bg-canvas p-5"
              >
                <h3 className="text-h4 font-semibold">{model.model}</h3>
                <dl className="mt-3 grid gap-2 text-small">
                  <div>
                    <dt className="type-meta text-dim">Best fit</dt>
                    <dd className="mt-1 text-muted">{model.bestFit}</dd>
                  </div>
                  <div>
                    <dt className="type-meta text-dim">Advantages</dt>
                    <dd className="mt-1 text-muted">{model.advantages}</dd>
                  </div>
                  <div>
                    <dt className="type-meta text-dim">Limits</dt>
                    <dd className="mt-1 text-muted">{model.limits}</dd>
                  </div>
                  <div>
                    <dt className="type-meta text-dim">Documents</dt>
                    <dd className="mt-1 text-muted">{model.documents}</dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>

          <p className="mt-8 max-w-prose text-small text-muted">
            An estimate is not a fixed-price commitment. No rates, ranges or
            payment terms are published on this site; they belong in a proposal
            written against a specific engagement.
          </p>
        </Section>
      }
      ctaHeading="Which model fits depends on what is known."
      ctaBody="Tell us how settled the scope is and who will prioritise the work day to day, and the right arrangement usually becomes obvious."
    />
  );
}
