import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { LinkButton } from "@/components/ui/Button";
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
import { solutionRecords } from "@/content/solutions";

export async function generateStaticParams() {
  return solutionRecords.map((solution) => ({ slug: solution.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps<"/solutions/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const solution = await content.getSolution(slug);
  if (!solution) return {};
  return buildMetadata(solution.seo, `/solutions/${slug}/`);
}

/**
 * The solution template — PRD section 15: workflow hero, current-state pain,
 * proposed boundaries, roles, sample flow, modules, integrations, data and
 * security decisions, rollout, related services, FAQs and CTA.
 */
export default async function SolutionPage({
  params,
}: PageProps<"/solutions/[slug]">) {
  const { slug } = await params;
  const solution = await content.getSolution(slug);
  if (!solution) notFound();

  const path = `/solutions/${slug}/`;
  const trail = [
    { label: "Home", href: "/" },
    { label: "Solutions", href: "/solutions/" },
    { label: solution.h1, href: path },
  ];

  return (
    <>
      <BreadcrumbJsonLd trail={trail} />

      <Container>
        <Breadcrumb trail={trail} />
      </Container>

      <section aria-labelledby="sol-h" className="pb-[clamp(2.5rem,6vw,4rem)]">
        <Container>
          <div className="flex flex-wrap items-start gap-x-16 gap-y-10">
            <div className="min-w-0 flex-7 basis-115">
              <Eyebrow>Solution</Eyebrow>
              <h1 id="sol-h" className="type-h1 mt-5 max-w-[16ch]">
                {solution.h1}
              </h1>
              <Lead className="mt-6">{solution.lead}</Lead>
              <div className="mt-8">
                <LinkButton href="/contact/" size="lg">
                  {solution.cta.label}
                </LinkButton>
              </div>
            </div>

            <div className="min-w-0 flex-5 basis-80">
              <Card tone="surface">
                <h2 className="type-meta text-dim">Where it usually starts</h2>
                <ul className="mt-4 grid gap-3 p-0">
                  {solution.currentState.map((pain) => (
                    <li key={pain} className="flex gap-3 text-small">
                      <span aria-hidden="true" className="text-faint">
                        —
                      </span>
                      <span className="text-muted">{pain}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        </Container>
      </section>

      <Section divider>
        <div className="flex flex-wrap-reverse gap-x-16 gap-y-10 lg:flex-nowrap">
          <div className="min-w-0 flex-1">
            <ContentSections sections={solution.sections} />

            <div className="mt-14 space-y-12 lg:mt-16 lg:space-y-16">
              <section aria-labelledby="roles">
                <SectionHeading id="roles" className="mb-6">
                  Who uses it
                </SectionHeading>
                <dl className="grid gap-4 p-0 sm:grid-cols-2">
                  {solution.roles.map((role) => (
                    <div
                      key={role.role}
                      className="rounded-card border border-hairline bg-surface p-5"
                    >
                      <dt className="text-body font-semibold text-anchor">
                        {role.role}
                      </dt>
                      <dd className="mt-1.5 text-small text-muted">
                        {role.scope}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>

              <section aria-labelledby="sample-flow">
                <SectionHeading id="sample-flow" className="mb-6">
                  A sample flow
                </SectionHeading>
                <WorkflowFigure illustration={solution.sampleFlow} />
              </section>

              <ListBlock
                id="modules"
                heading="Essential modules"
                items={solution.modules}
                columns={2}
              />

              <ListBlock
                id="integrations"
                heading="Integrations"
                items={solution.integrations}
              />

              <section aria-labelledby="data-security">
                <SectionHeading id="data-security" className="mb-6">
                  Data and security decisions
                </SectionHeading>
                <div className="max-w-prose space-y-3">
                  {solution.dataAndSecurity.map((note) => (
                    <p key={note} className="text-body text-muted">
                      {note}
                    </p>
                  ))}
                </div>
              </section>

              <ListBlock
                id="rollout"
                heading="Rollout and adoption"
                items={solution.rollout}
              />

              <div>
                <LinkButton href="/contact/" variant="dark">
                  {solution.cta.label}
                </LinkButton>
              </div>
            </div>
          </div>

          <aside className="w-full shrink-0 lg:w-65">
            <ContentsList
              sections={solution.sections}
              extra={[
                { id: "roles", heading: "Who uses it" },
                { id: "sample-flow", heading: "A sample flow" },
                { id: "modules", heading: "Essential modules" },
                { id: "data-security", heading: "Data and security" },
                { id: "rollout", heading: "Rollout" },
                { id: "faqs", heading: "Questions" },
              ]}
            />
          </aside>
        </div>
      </Section>

      <Section labelledBy="faqs" tone="surface">
        <FaqList faqs={solution.faqs} heading="Questions" headingId="faqs" />
      </Section>

      <Section labelledBy="related-h" divider>
        <SectionHeading id="related-h" className="mb-6">
          Related services
        </SectionHeading>
        <ul className="flex flex-wrap gap-3 p-0">
          {solution.related.map((link) => (
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
        body="Share the workflow, who is involved and what it currently costs you. A short summary is enough to begin."
        label={solution.cta.label}
      />
    </>
  );
}
