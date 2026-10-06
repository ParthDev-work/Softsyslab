import Link from "next/link";
import { Breadcrumb, type Crumb } from "@/components/ui/Breadcrumb";
import { Notice } from "@/components/ui/Notice";
import {
  Container,
  Eyebrow,
  Lead,
  Section,
  SectionHeading,
} from "@/components/ui/Layout";
import { CtaBanner } from "@/components/blocks/CtaBanner";
import { BreadcrumbJsonLd } from "@/lib/seo/JsonLd";
import type { PolicyPage } from "@/lib/content/schemas";

/**
 * Policy page shell — PRD section 25.
 *
 * Section 25 supplies "a content specification, not a ready-to-publish legal
 * opinion" and instructs appointing counsel before publication. This template
 * therefore renders the required section headings and the inputs each one
 * needs, under a standing notice that the policy is not in force.
 *
 * It deliberately does not render policy prose. A plausible privacy policy no
 * lawyer has read, describing processing that may not match what the site
 * does, is read literally by regulators and by the people relying on it; an
 * honest statement that it is not ready is the safer and more useful page.
 *
 * Section 45 requires policy text to be readable without accepting optional
 * cookies, which this build satisfies by loading no optional scripts at all.
 */
export function PolicyPageTemplate({
  page,
  trail,
}: {
  page: PolicyPage;
  trail: Crumb[];
}) {
  return (
    <>
      <BreadcrumbJsonLd trail={trail} />

      <Container>
        <Breadcrumb trail={trail} />
      </Container>

      <section aria-labelledby="policy-h" className="pb-[clamp(2rem,5vw,3rem)]">
        <Container>
          <Eyebrow>Legal</Eyebrow>
          <h1 id="policy-h" className="type-h1 mt-5 max-w-[18ch]">
            {page.h1}
          </h1>
          <Lead className="mt-6">{page.lead}</Lead>
        </Container>
      </section>

      <section className="pb-[clamp(2rem,5vw,3rem)]">
        <Container>
          <Notice
            tone="warning"
            role="note"
            title="This policy is not yet in force"
            className="max-w-quote"
          >
            <p>
              Legal content has to match the real entity, the markets served,
              the actual processors and the signed contracts. The company
              identity behind this site is not yet verified and qualified
              counsel has not reviewed this text, so no policy wording is
              published.
            </p>
            <p>
              What follows is the structure the finished policy will take and
              the inputs each section needs. Importing policy text from another
              company would produce a document that reads convincingly and
              describes someone else&rsquo;s business.
            </p>
          </Notice>
        </Container>
      </section>

      <Section divider>
        <SectionHeading id="required-sections" className="mb-8">
          Required sections
        </SectionHeading>

        <ol className="grid list-none gap-0 border-t border-line p-0">
          {page.requiredSections.map((section, index) => (
            <li
              key={section.id}
              id={section.id}
              className="grid gap-x-10 gap-y-3 border-b border-hairline py-7 md:grid-cols-[minmax(0,18rem)_minmax(0,1fr)]"
            >
              <h3 className="flex items-baseline gap-3.5 text-h4 font-semibold">
                <span
                  aria-hidden="true"
                  className="font-mono text-xs font-normal text-brand"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                {section.heading}
              </h3>
              <ul className="grid gap-2 p-0">
                {section.inputs.map((input) => (
                  <li key={input} className="flex gap-3 text-body text-muted">
                    <span
                      aria-hidden="true"
                      className="mt-2.5 size-1.5 flex-none rounded-full bg-line"
                    />
                    <span>{input}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>

        {page.related.length > 0 ? (
          <ul className="mt-10 flex flex-wrap gap-3 p-0">
            {page.related.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex min-h-11 items-center rounded-control border border-line px-4 text-body text-anchor transition-colors duration-150 hover:border-field hover:bg-surface motion-reduce:transition-none"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </Section>

      <CtaBanner
        heading="Questions about this policy?"
        body="Ask through the contact form. Queries about a specific engagement are answered against its agreement rather than against a general statement."
        label="Contact Us About This Policy"
      />
    </>
  );
}
