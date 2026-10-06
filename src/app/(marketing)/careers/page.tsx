import type { Metadata } from "next";
import { CorporatePageTemplate } from "@/components/blocks/CorporatePageTemplate";
import { Card } from "@/components/ui/Card";
import { Section, SectionHeading } from "@/components/ui/Layout";
import { buildMetadata } from "@/lib/seo/metadata";
import { corporatePage } from "@/content/pages";
import { content } from "@/lib/content";

const page = corporatePage("careers");

export const metadata: Metadata = buildMetadata(page.seo, page.path);

/**
 * PRD section 23.
 *
 * The empty state is the literal copy section 23 requires, and it replaces
 * only the role list — the rest of the page stays. No speculative CVs are
 * collected, because section 23 permits that only where an approved process
 * and retention policy exist, and neither does.
 *
 * No JobPosting structured data is emitted: section 47 allows it only for
 * genuine active roles.
 */
export default async function CareersPage() {
  const openRoles = await content.listOpenJobs();

  return (
    <CorporatePageTemplate
      page={page}
      eyebrow="Careers"
      trail={[
        { label: "Home", href: "/" },
        { label: "Careers", href: "/careers/" },
      ]}
      beforeSections={
        <Section tone="surface" labelledBy="roles-h">
          <SectionHeading id="roles-h" className="mb-6">
            Open roles
          </SectionHeading>
          {openRoles.length === 0 ? (
            <Card className="max-w-quote">
              <p className="text-body-lg text-anchor">
                There are no open roles listed at the moment.
              </p>
              <p className="mt-3 text-body text-muted">
                When a role opens it appears here with its responsibilities,
                required skills, employment type, location and hiring stages.
                There is no application form on this page in the meantime —
                see below for why.
              </p>
            </Card>
          ) : (
            <ul className="grid gap-4 p-0">
              {openRoles.map((job) => (
                <li key={job.slug}>
                  <Card>
                    <h3 className="text-h3 font-semibold">{job.role}</h3>
                    <p className="mt-2 text-small text-muted">
                      {job.location} · {job.employmentType}
                    </p>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </Section>
      }
      ctaHeading="Looking for software delivery, not a role?"
      ctaBody="The enquiry form is the right route for project work."
    />
  );
}
