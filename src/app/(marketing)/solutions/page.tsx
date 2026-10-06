import type { Metadata } from "next";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { CardGrid, CardGridItem, LinkCard } from "@/components/ui/Card";
import {
  Container,
  Eyebrow,
  Lead,
  Section,
  SectionHeading,
} from "@/components/ui/Layout";
import { FaqList } from "@/components/blocks/FaqList";
import { CtaBanner } from "@/components/blocks/CtaBanner";
import { BreadcrumbJsonLd } from "@/lib/seo/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { content } from "@/lib/content";
import { solutionsHub } from "@/content/pages";

export const metadata: Metadata = buildMetadata(
  solutionsHub.seo,
  "/solutions/",
);

const trail = [
  { label: "Home", href: "/" },
  { label: "Solutions", href: "/solutions/" },
];

/** PRD section 15's hub. Lists only solutions that are actually published. */
export default async function SolutionsHubPage() {
  const solutions = await content.listSolutions();

  return (
    <>
      <BreadcrumbJsonLd trail={trail} />

      <Container>
        <Breadcrumb trail={trail} />
      </Container>

      <section aria-labelledby="hub-h" className="pb-[clamp(2.5rem,6vw,4rem)]">
        <Container>
          <Eyebrow>Solutions</Eyebrow>
          <h1 id="hub-h" className="type-h1 mt-5 max-w-[18ch]">
            {solutionsHub.h1}
          </h1>
          <Lead className="mt-5">{solutionsHub.lead}</Lead>
        </Container>
      </section>

      <Section labelledBy="list-h" divider>
        <SectionHeading id="list-h" className="mb-8">
          Published solutions
        </SectionHeading>
        <CardGrid min="20rem">
          {solutions.map((solution, index) => (
            <CardGridItem key={solution.slug}>
              <LinkCard
                href={`/solutions/${solution.slug}/`}
                index={String(index + 1).padStart(2, "0")}
                title={solution.h1}
                body={solution.seo.description}
                action="Review the system"
              />
            </CardGridItem>
          ))}
        </CardGrid>
        <p className="mt-8 max-w-prose text-small text-muted">
          Further solutions — digital transformation, CRM, ERP, marketplaces,
          analytics dashboards and AI-powered applications among them — are
          specified but not published. Each needs its own review before it
          appears here, and an unpublished page is better than an empty one.
        </p>
      </Section>

      <Section labelledBy="solutions-faqs" tone="surface">
        <FaqList faqs={[...solutionsHub.faqs]} headingId="solutions-faqs" />
      </Section>

      <CtaBanner
        heading="Describe the workflow, not the software."
        body="The most useful first conversation is about what currently costs your team time, not about which system to buy."
        label={solutionsHub.cta.label}
      />
    </>
  );
}
