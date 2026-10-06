import Link from "next/link";
import type { ReactNode } from "react";
import { Breadcrumb, type Crumb } from "@/components/ui/Breadcrumb";
import {
  Container,
  Eyebrow,
  Lead,
  Section,
  SectionHeading,
} from "@/components/ui/Layout";
import { ContentSections, ContentsList } from "@/components/blocks/ContentSections";
import { FaqList } from "@/components/blocks/FaqList";
import { CtaBanner } from "@/components/blocks/CtaBanner";
import { BreadcrumbJsonLd } from "@/lib/seo/JsonLd";
import type { CorporatePage } from "@/lib/content/schemas";

/**
 * Shared shell for the corporate pages — PRD section 54's page shell: full
 * width header, 1200px container, breadcrumb above the title, long-form body
 * at reading width with a contents list, then the final CTA.
 *
 * `beforeSections` and `afterSections` let an individual page insert its own
 * structured block — the engagement comparison table, the business information
 * record — without each page re-implementing the shell.
 */
export function CorporatePageTemplate({
  page,
  eyebrow,
  trail,
  beforeSections,
  afterSections,
  contentsExtra = [],
  ctaHeading = "Tell us what you're building.",
  ctaBody = "Share the problem, the stage of your project and any important constraints. A short summary is enough to begin.",
}: {
  page: CorporatePage;
  eyebrow: string;
  trail: Crumb[];
  beforeSections?: ReactNode;
  afterSections?: ReactNode;
  contentsExtra?: Array<{ id: string; heading: string }>;
  ctaHeading?: string;
  ctaBody?: string;
}) {
  return (
    <>
      <BreadcrumbJsonLd trail={trail} />

      <Container>
        <Breadcrumb trail={trail} />
      </Container>

      <section aria-labelledby="page-h" className="pb-[clamp(2.5rem,6vw,4rem)]">
        <Container>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 id="page-h" className="type-h1 mt-5 max-w-[18ch]">
            {page.h1}
          </h1>
          <Lead className="mt-6">{page.lead}</Lead>
        </Container>
      </section>

      {beforeSections}

      <Section divider>
        <div className="flex flex-wrap-reverse gap-x-16 gap-y-10 lg:flex-nowrap">
          <div className="min-w-0 flex-1">
            <ContentSections sections={page.sections} />
          </div>
          <aside className="w-full shrink-0 lg:w-65">
            <ContentsList sections={page.sections} extra={contentsExtra} />
          </aside>
        </div>
      </Section>

      {afterSections}

      {page.faqs.length > 0 ? (
        <Section labelledBy="faqs" tone="surface">
          <FaqList faqs={page.faqs} heading="Questions" headingId="faqs" />
        </Section>
      ) : null}

      {page.related.length > 0 ? (
        <Section labelledBy="related-h" divider>
          <SectionHeading id="related-h" className="mb-6">
            Related
          </SectionHeading>
          <ul className="flex flex-wrap gap-3 p-0">
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
        </Section>
      ) : null}

      <CtaBanner
        heading={ctaHeading}
        body={ctaBody}
        label={page.cta.label}
      />
    </>
  );
}
