import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ArrowLink, LinkButton } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  Container,
  Eyebrow,
  Lead,
  Section,
  SectionHeading,
} from "@/components/ui/Layout";
import {
  ContentSections,
  ContentsList,
  ListBlock,
} from "@/components/blocks/ContentSections";
import { FaqList } from "@/components/blocks/FaqList";
import { CtaBanner } from "@/components/blocks/CtaBanner";
import { WorkflowFigure } from "@/components/blocks/Figure";
import { BreadcrumbJsonLd } from "@/lib/seo/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { content } from "@/lib/content";
import { serviceRecords } from "@/content/services";

export async function generateStaticParams() {
  return serviceRecords.map((service) => ({ slug: service.slug }));
}

/** Unknown slugs 404 rather than rendering (section 47: no soft 404s). */
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = await content.getService(slug);
  if (!service) return {};
  return buildMetadata(service.seo, `/services/${slug}/`);
}

/**
 * The service template — PRD section 14's shared contract laid out to the
 * section 54 wireframe: breadcrumb, 7/5 hero, 8/4 body with a ~260px sticky
 * contents list, alternating blocks, evidence, FAQ, CTA.
 *
 * The primary call to action appears in the hero, after scope, and at the end.
 * There is no sticky overlay — section 31's default is none, and an obstructive
 * one would violate section 32's rule that focus must not be obscured.
 */
export default async function ServicePage({
  params,
}: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = await content.getService(slug);
  if (!service) notFound();

  const path = `/services/${slug}/`;
  const trail = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services/" },
    { label: service.h1, href: path },
  ];

  const contentsExtra = [
    { id: "capabilities", heading: "Capabilities and deliverables" },
    { id: "architecture", heading: "Architecture and security" },
    { id: "engagement", heading: "Engagement and timing" },
    { id: "faqs", heading: "Questions" },
  ];

  return (
    <>
      <BreadcrumbJsonLd trail={trail} />

      <Container>
        <Breadcrumb trail={trail} />
      </Container>

      {/* Hero — 7/5 split */}
      <section aria-labelledby="service-h" className="pb-[clamp(2.5rem,6vw,4rem)]">
        <Container>
          <div className="flex flex-wrap items-start gap-x-16 gap-y-10">
            <div className="min-w-0 flex-7 basis-115">
              <Eyebrow>Service</Eyebrow>
              <h1 id="service-h" className="type-h1 mt-5 max-w-[16ch]">
                {service.h1}
              </h1>
              <Lead className="mt-6">{service.lead}</Lead>
              <div className="mt-8">
                <LinkButton href="/contact/" size="lg">
                  {service.cta.label}
                </LinkButton>
              </div>
            </div>

            <div className="min-w-0 flex-5 basis-80">
              <Card tone="surface">
                <h2 className="type-meta text-dim">Business problems</h2>
                <ul className="mt-4 grid gap-3 p-0">
                  {service.businessProblems.map((problem) => (
                    <li key={problem} className="flex gap-3 text-small">
                      <span aria-hidden="true" className="text-faint">
                        —
                      </span>
                      <span className="text-muted">{problem}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        </Container>
      </section>

      {/* Fit — section 14 requires poor-fit cases alongside good-fit ones */}
      <Section id="fit" labelledBy="fit-h" tone="surface">
        <SectionHeading id="fit-h" className="mb-8">
          Where this fits, and where it does not
        </SectionHeading>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <h3 className="text-h4 font-semibold">A good fit when</h3>
            <ul className="mt-4 grid gap-3 p-0">
              {service.goodFit.map((item) => (
                <li key={item} className="flex gap-3 text-body">
                  <span aria-hidden="true" className="mt-0.5 text-accent">
                    ✓
                  </span>
                  <span className="text-muted">{item}</span>
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <h3 className="text-h4 font-semibold">Probably not when</h3>
            <ul className="mt-4 grid gap-3 p-0">
              {service.poorFit.map((item) => (
                <li key={item} className="flex gap-3 text-body">
                  <span aria-hidden="true" className="mt-0.5 text-dim">
                    ×
                  </span>
                  <span className="text-muted">{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </Section>

      {/* Body — 8/4 with the sticky contents list */}
      <Section divider>
        <div className="flex flex-wrap-reverse gap-x-16 gap-y-10 lg:flex-nowrap">
          <div className="min-w-0 flex-1">
            <ContentSections sections={service.sections} />

            <div className="mt-14 space-y-12 lg:mt-16 lg:space-y-16">
              <section aria-labelledby="capabilities">
                <SectionHeading id="capabilities" className="mb-6">
                  Capabilities and deliverables
                </SectionHeading>
                <div className="grid gap-6 sm:grid-cols-2">
                  <Card tone="surface">
                    <h3 className="type-meta text-dim">What we do</h3>
                    <ul className="mt-4 grid gap-2.5 p-0 text-body">
                      {service.capabilities.map((item) => (
                        <li key={item} className="flex gap-3">
                          <span
                            aria-hidden="true"
                            className="mt-2.5 size-1.5 flex-none rounded-full bg-brand"
                          />
                          <span className="text-muted">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                  <Card tone="surface">
                    <h3 className="type-meta text-dim">What you receive</h3>
                    <ul className="mt-4 grid gap-2.5 p-0 text-body">
                      {service.deliverables.map((item) => (
                        <li key={item} className="flex gap-3">
                          <span
                            aria-hidden="true"
                            className="mt-2.5 size-1.5 flex-none rounded-full bg-accent"
                          />
                          <span className="text-muted">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                </div>

                <div className="mt-8">
                  <h3 className="mb-4 text-h4 font-semibold">
                    An example workflow
                  </h3>
                  <WorkflowFigure illustration={service.exampleWorkflow} />
                </div>

                {/* Primary CTA repeated after scope, per section 54. */}
                <div className="mt-8">
                  <LinkButton href="/contact/" variant="dark">
                    {service.cta.label}
                  </LinkButton>
                </div>
              </section>

              <section aria-labelledby="architecture">
                <SectionHeading id="architecture" className="mb-6">
                  Architecture and security
                </SectionHeading>
                <div className="space-y-6">
                  <div>
                    <h3 className="mb-3 text-h4 font-semibold">
                      Decisions to record
                    </h3>
                    <ul className="max-w-prose space-y-3 p-0">
                      {service.architectureDecisions.map((item) => (
                        <li key={item} className="flex gap-3 text-body">
                          <span
                            aria-hidden="true"
                            className="mt-2.5 size-1.5 flex-none rounded-full bg-brand"
                          />
                          <span className="text-muted">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="mb-3 text-h4 font-semibold">
                      Security considerations
                    </h3>
                    <div className="max-w-prose space-y-3">
                      {service.securityNotes.map((note) => (
                        <p key={note} className="text-body text-muted">
                          {note}
                        </p>
                      ))}
                    </div>
                  </div>
                  <ListBlock
                    id="integrations"
                    heading="Typical integrations"
                    items={service.integrations}
                  />
                </div>
              </section>

              <section aria-labelledby="engagement">
                <SectionHeading id="engagement" className="mb-6">
                  Engagement and timing
                </SectionHeading>
                <p className="max-w-prose text-body-lg text-muted">
                  {service.engagementNote}
                </p>
                <h3 className="mb-3 mt-8 text-h4 font-semibold">
                  What drives the schedule
                </h3>
                <ul className="max-w-prose space-y-3 p-0">
                  {service.scheduleDrivers.map((item) => (
                    <li key={item} className="flex gap-3 text-body">
                      <span
                        aria-hidden="true"
                        className="mt-2.5 size-1.5 flex-none rounded-full bg-brand"
                      />
                      <span className="text-muted">{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 max-w-prose text-small text-muted">
                  Delivery timing depends on scope, access to existing systems,
                  integration readiness and review turnaround. A proposal states
                  its assumptions, milestones and change procedure. No completion
                  date is promised before those are known.
                </p>
                <div className="mt-6">
                  <ArrowLink href="/engagement-models/">
                    Compare engagement models
                  </ArrowLink>
                </div>
              </section>

              {/* Section 14 allows an evidence block only where evidence
                  exists. None does, so nothing renders rather than an
                  empty heading. */}
              {service.evidence.length > 0 ? (
                <section aria-labelledby="evidence">
                  <SectionHeading id="evidence" className="mb-6">
                    Evidence
                  </SectionHeading>
                  <ul className="grid gap-4 p-0">
                    {service.evidence.map((item) => (
                      <li key={item.claim}>
                        <Card tone="surface">
                          <p className="text-body">{item.claim}</p>
                          <p className="mt-2 font-mono text-xs text-dim">
                            {item.sourceReference} · verified{" "}
                            {item.verificationDate}
                          </p>
                        </Card>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
            </div>
          </div>

          <aside className="w-full shrink-0 lg:w-65">
            <ContentsList sections={service.sections} extra={contentsExtra} />
          </aside>
        </div>
      </Section>

      <Section labelledBy="faqs" tone="surface">
        <FaqList faqs={service.faqs} heading="Questions" headingId="faqs" />
      </Section>

      <Section labelledBy="related-h" divider>
        <SectionHeading id="related-h" className="mb-6">
          Related
        </SectionHeading>
        <ul className="flex flex-wrap gap-3 p-0">
          {service.related.map((link) => (
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

      <CtaBanner
        heading="Tell us what you're building."
        body="Share the problem, the stage of your project and any important constraints. A short summary is enough to begin."
        label={service.cta.label}
      />
    </>
  );
}
