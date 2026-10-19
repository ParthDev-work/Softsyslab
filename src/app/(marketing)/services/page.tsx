import type { Metadata } from "next";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container, Section } from "@/components/ui/Layout";
import { EditorialContactBand } from "@/components/blocks/EditorialContactBand";
import { EditorialPageHero } from "@/components/blocks/EditorialPageHero";
import { FaqList } from "@/components/blocks/FaqList";
import {
  ServiceGroupsEditorial,
  type EditorialServiceGroup,
} from "@/components/blocks/ServiceGroupsEditorial";
import { BreadcrumbJsonLd } from "@/lib/seo/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { content } from "@/lib/content";
import { servicesHub } from "@/content/pages";
import { serviceGroups } from "@/content/services";

export const metadata: Metadata = buildMetadata(servicesHub.seo, "/services/");

const trail = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services/" },
];

export default async function ServicesHubPage() {
  const services = await content.listServices();

  const populated = serviceGroups
    .map((group) => ({
      ...group,
      services: services.filter((service) => service.group === group.id),
    }))
    .filter((group) => group.services.length > 0);

  const editorialGroups: EditorialServiceGroup[] = populated.map((group) => ({
    id: group.id,
    title: group.title,
    summary: group.summary,
    items: group.services.map((service) => ({
      label: service.h1,
      href: `/services/${service.slug}/`,
    })),
  }));

  return (
    <>
      <BreadcrumbJsonLd trail={trail} />

      <Container>
        <Breadcrumb trail={trail} />
      </Container>

      <EditorialPageHero
        eyebrow="Services"
        headingId="hub-h"
        heading={servicesHub.h1}
        lead={servicesHub.lead}
      />

      <ServiceGroupsEditorial groups={editorialGroups} />

      <Section labelledBy="services-faqs" divider>
        <FaqList faqs={[...servicesHub.faqs]} headingId="services-faqs" />
      </Section>

      <EditorialContactBand
        heading="Not sure which service fits?"
        eyebrow="Describe the problem, not the label"
        label={servicesHub.cta.label}
      />
    </>
  );
}
