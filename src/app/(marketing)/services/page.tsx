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
import { servicesHub } from "@/content/pages";
import { serviceGroups } from "@/content/services";

export const metadata: Metadata = buildMetadata(servicesHub.seo, "/services/");

const trail = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services/" },
];

/**
 * PRD section 26's hub copy standards: the H2s are the five service groups.
 *
 * A group with no published service renders no heading — section 10 requires
 * every published page to have a useful onward path, and a group heading over
 * an empty list is the opposite of one. Cloud and modernization is currently
 * in that position, so it does not appear.
 */
export default async function ServicesHubPage() {
  const services = await content.listServices();

  const populated = serviceGroups
    .map((group) => ({
      ...group,
      services: services.filter((service) => service.group === group.id),
    }))
    .filter((group) => group.services.length > 0);

  return (
    <>
      <BreadcrumbJsonLd trail={trail} />

      <Container>
        <Breadcrumb trail={trail} />
      </Container>

      <section aria-labelledby="hub-h" className="pb-[clamp(2.5rem,6vw,4rem)]">
        <Container>
          <Eyebrow>Services</Eyebrow>
          <h1 id="hub-h" className="type-h1 mt-5 max-w-[18ch]">
            {servicesHub.h1}
          </h1>
          <Lead className="mt-5">{servicesHub.lead}</Lead>
        </Container>
      </section>

      {populated.map((group, index) => (
        <Section
          key={group.id}
          id={group.id}
          labelledBy={`${group.id}-h`}
          tone={index % 2 === 1 ? "surface" : "canvas"}
          divider={index === 0}
        >
          <div className="mb-8 flex flex-wrap items-baseline gap-x-6 gap-y-2">
            <SectionHeading id={`${group.id}-h`}>{group.title}</SectionHeading>
            <p className="text-body text-muted">{group.summary}</p>
          </div>
          <CardGrid min="20rem">
            {group.services.map((service, serviceIndex) => (
              <CardGridItem key={service.slug}>
                <LinkCard
                  href={`/services/${service.slug}/`}
                  index={String(serviceIndex + 1).padStart(2, "0")}
                  title={service.h1}
                  body={service.seo.description}
                  action="Review scope"
                />
              </CardGridItem>
            ))}
          </CardGrid>
        </Section>
      ))}

      <Section labelledBy="services-faqs" divider>
        <FaqList faqs={[...servicesHub.faqs]} headingId="services-faqs" />
      </Section>

      <CtaBanner
        heading="Not sure which service fits?"
        body="Describe the problem rather than the solution. If another supplier or an existing product would serve you better, we will say so."
        label={servicesHub.cta.label}
      />
    </>
  );
}
