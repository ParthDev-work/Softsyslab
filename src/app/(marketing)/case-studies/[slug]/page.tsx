import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Card } from "@/components/ui/Card";
import { Container, Eyebrow, Section, SectionHeading } from "@/components/ui/Layout";
import { CtaBanner } from "@/components/blocks/CtaBanner";
import { content } from "@/lib/content";
import { caseStudyRecords } from "@/content/case-studies";

export async function generateStaticParams() {
  return caseStudyRecords.map((study) => ({ slug: study.slug }));
}

export const dynamicParams = false;

/**
 * The case study detail template — PRD section 18 and the section 54
 * wireframe. Ships as code over an empty collection, so no route is generated
 * and any direct request 404s.
 *
 * The outcome block renders evidence records rather than free-text claims: the
 * schema requires at least one, each with an owner, a verification date and a
 * permission status, which is what section 18 means by an approved project.
 */
export default async function CaseStudyPage({
  params,
}: PageProps<"/case-studies/[slug]">) {
  const { slug } = await params;
  const study = await content.getCaseStudy(slug);
  if (!study) notFound();

  const trail = [
    { label: "Home", href: "/" },
    { label: "Case Studies", href: "/case-studies/" },
    { label: study.h1, href: `/case-studies/${slug}/` },
  ];

  return (
    <>
      <Container>
        <Breadcrumb trail={trail} />
      </Container>

      <section aria-labelledby="cs-h" className="pb-[clamp(2.5rem,6vw,4rem)]">
        <Container>
          <Eyebrow>
            {study.client.permission === "named"
              ? study.client.attribution
              : "Anonymised client"}
          </Eyebrow>
          <h1 id="cs-h" className="type-h1 mt-5 max-w-[18ch]">
            {study.h1}
          </h1>
          <dl className="mt-8 grid gap-4 border-t border-line pt-6 sm:grid-cols-3">
            <div>
              <dt className="type-meta text-dim">Industry</dt>
              <dd className="mt-1 text-body">{study.industry}</dd>
            </div>
            <div>
              <dt className="type-meta text-dim">Duration</dt>
              <dd className="mt-1 text-body">{study.duration}</dd>
            </div>
            <div>
              <dt className="type-meta text-dim">Stack</dt>
              <dd className="mt-1 text-body">{study.stack.join(", ")}</dd>
            </div>
          </dl>
        </Container>
      </section>

      <Section divider>
        <div className="max-w-prose space-y-10">
          <section aria-labelledby="problem">
            <SectionHeading id="problem" className="mb-4">
              The problem
            </SectionHeading>
            <p className="text-body-lg text-muted">{study.problem}</p>
          </section>
          <section aria-labelledby="approach">
            <SectionHeading id="approach" className="mb-4">
              The approach
            </SectionHeading>
            <p className="text-body-lg text-muted">{study.approach}</p>
          </section>
        </div>

        <section aria-labelledby="outcome" className="mt-12">
          <SectionHeading id="outcome" className="mb-6">
            Outcome
          </SectionHeading>
          <ul className="grid gap-4 p-0">
            {study.outcome.map((item) => (
              <li key={item.claim}>
                <Card tone="surface">
                  <p className="text-body-lg">{item.claim}</p>
                  <p className="mt-3 font-mono text-xs text-dim">
                    {item.sourceReference} · owner {item.owner} · verified{" "}
                    {item.verificationDate}
                  </p>
                </Card>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="related" className="mt-12">
          <SectionHeading id="related" className="mb-6">
            Related services
          </SectionHeading>
          <ul className="flex flex-wrap gap-3 p-0">
            {study.related.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex min-h-11 items-center rounded-control border border-line px-4 text-body text-anchor hover:border-field hover:bg-surface"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </Section>

      <CtaBanner
        heading="Discuss a similar project."
        body="Share the problem and the constraints you are working within."
        label="Discuss a Similar Project"
      />
    </>
  );
}
