import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Card } from "@/components/ui/Card";
import { Notice } from "@/components/ui/Notice";
import {
  Container,
  Eyebrow,
  Section,
  SectionHeading,
} from "@/components/ui/Layout";
import { ListBlock } from "@/components/blocks/ContentSections";
import { content } from "@/lib/content";
import { jobRecords } from "@/content/jobs";

export async function generateStaticParams() {
  return jobRecords
    .filter((job) => job.status === "open")
    .map((job) => ({ slug: job.slug }));
}

export const dynamicParams = false;

/**
 * The job template — PRD section 23. Ships as code over an empty collection.
 *
 * A closed role disables applications and removes its JobPosting markup; this
 * build emits no JobPosting at all, because section 47 permits it only for
 * genuine active roles and there are none.
 *
 * There is no application form. Section 23 permits collecting a CV only where
 * an approved process and retention policy exist, and section 20's REQ-UPLOAD
 * rule says to remove the attachment interface rather than build one that
 * discards the file.
 */
export default async function JobPage({
  params,
}: PageProps<"/careers/[slug]">) {
  const { slug } = await params;
  const job = await content.getJob(slug);
  if (!job || job.status !== "open") notFound();

  const trail = [
    { label: "Home", href: "/" },
    { label: "Careers", href: "/careers/" },
    { label: job.role, href: `/careers/${slug}/` },
  ];

  return (
    <>
      <Container>
        <Breadcrumb trail={trail} />
      </Container>

      <section aria-labelledby="job-h" className="pb-[clamp(2.5rem,6vw,4rem)]">
        <Container>
          <Eyebrow>Open role</Eyebrow>
          <h1 id="job-h" className="type-h1 mt-5 max-w-[18ch]">
            {job.role}
          </h1>
          <dl className="mt-8 grid gap-4 border-t border-line pt-6 sm:grid-cols-3">
            <div>
              <dt className="type-meta text-dim">Location</dt>
              <dd className="mt-1 text-body">{job.location}</dd>
            </div>
            <div>
              <dt className="type-meta text-dim">Employment type</dt>
              <dd className="mt-1 text-body">{job.employmentType}</dd>
            </div>
            <div>
              <dt className="type-meta text-dim">Listed until</dt>
              <dd className="mt-1 text-body">{job.validThrough}</dd>
            </div>
          </dl>
        </Container>
      </section>

      <Section divider>
        <div className="flex flex-wrap gap-x-16 gap-y-10">
          <div className="min-w-0 flex-8 basis-125 space-y-10">
            <p className="max-w-prose text-body-lg text-muted">{job.mission}</p>

            <ListBlock
              id="responsibilities"
              heading="Responsibilities"
              items={job.responsibilities}
            />
            <ListBlock
              id="required-skills"
              heading="Required skills"
              items={job.requiredSkills}
            />
            {job.helpfulExperience.length > 0 ? (
              <ListBlock
                id="helpful-experience"
                heading="Helpful experience"
                items={job.helpfulExperience}
              />
            ) : null}
            <ListBlock
              id="hiring-stages"
              heading="Hiring stages"
              items={job.hiringStages}
            />

            <section aria-labelledby="adjustments">
              <SectionHeading id="adjustments" className="mb-4">
                Accessibility adjustments
              </SectionHeading>
              <p className="max-w-prose text-body text-muted">
                {job.accessibilityAdjustments}
              </p>
            </section>
          </div>

          <aside className="min-w-0 flex-4 basis-75">
            <Card tone="surface">
              <h2 className="text-h4 font-semibold">Applying</h2>
              <Notice tone="info" role="note" className="mt-4">
                <p>
                  Applications are handled by the hiring owner for this role
                  rather than through a form on this site. No CV is collected
                  here, because no approved retention policy is in place.
                </p>
              </Notice>
              <p className="mt-4 font-mono text-xs text-dim">
                Role {job.jobId} · hiring owner {job.hiringOwner}
              </p>
            </Card>
          </aside>
        </div>
      </Section>
    </>
  );
}
