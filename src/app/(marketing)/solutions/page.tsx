import type { Metadata } from "next";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container, Section } from "@/components/ui/Layout";
import { EditorialContactBand } from "@/components/blocks/EditorialContactBand";
import { EditorialPageHero } from "@/components/blocks/EditorialPageHero";
import { FaqList } from "@/components/blocks/FaqList";
import { ServiceGroupsEditorial } from "@/components/blocks/ServiceGroupsEditorial";
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

export default async function SolutionsHubPage() {
  const solutions = await content.listSolutions();

  const editorialGroups = solutions.map((solution) => ({
    id: solution.slug,
    title: solution.h1,
    summary: solution.seo.description,
    items: [
      {
        label: "Review the system and delivery scope",
        href: `/solutions/${solution.slug}/`,
      },
    ],
  }));

  return (
    <>
      <BreadcrumbJsonLd trail={trail} />

      <Container>
        <Breadcrumb trail={trail} />
      </Container>

      <EditorialPageHero
        eyebrow="Solutions"
        headingId="hub-h"
        heading={solutionsHub.h1}
        lead={solutionsHub.lead}
      />

      <ServiceGroupsEditorial groups={editorialGroups} />

      <Section labelledBy="solutions-faqs" tone="surface" divider>
        <FaqList faqs={[...solutionsHub.faqs]} headingId="solutions-faqs" />
      </Section>

      <p className="container-page -mt-8 max-w-prose pb-12 text-small text-muted">
        Further solutions — digital transformation, CRM, ERP, marketplaces,
        analytics dashboards and AI-powered applications among them — are
        specified but not published. Each needs its own review before it
        appears here, and an unpublished page is better than an empty one.
      </p>

      <EditorialContactBand
        heading="Describe the workflow, not the software."
        eyebrow="Start from the work that costs time"
        label={solutionsHub.cta.label}
      />
    </>
  );
}
