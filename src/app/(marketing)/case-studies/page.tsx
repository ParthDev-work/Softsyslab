import { notFound } from "next/navigation";
import { content } from "@/lib/content";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { CardGrid, CardGridItem, LinkCard } from "@/components/ui/Card";
import { Container, Eyebrow, Lead, Section } from "@/components/ui/Layout";

/**
 * PRD section 18.
 *
 * "No approved work means the public listing and inbound links are withheld,
 * not a fake project gallery." The listing template ships as code; while the
 * collection is empty the route returns a genuine 404, the route registry
 * contributes no path, the sitemap therefore excludes it, and navigation never
 * offers a Work link (AC01).
 *
 * Adding one approved case study publishes the listing, the detail pages, the
 * sitemap entries and the navigation link, with no code change here.
 */
export default async function CaseStudiesPage() {
  const caseStudies = await content.listCaseStudies();
  if (caseStudies.length === 0) notFound();

  const trail = [
    { label: "Home", href: "/" },
    { label: "Case Studies", href: "/case-studies/" },
  ];

  return (
    <>
      <Container>
        <Breadcrumb trail={trail} />
      </Container>

      <section aria-labelledby="cs-h" className="pb-[clamp(2.5rem,6vw,4rem)]">
        <Container>
          <Eyebrow>Work</Eyebrow>
          <h1 id="cs-h" className="type-h1 mt-5">
            Software projects in context
          </h1>
          <Lead className="mt-5">
            Examine the problem, the decisions and the delivered work behind
            each approved project.
          </Lead>
        </Container>
      </section>

      <Section divider>
        <CardGrid min="22rem">
          {caseStudies.map((study) => (
            <CardGridItem key={study.slug}>
              <LinkCard
                href={`/case-studies/${study.slug}/`}
                title={study.h1}
                body={study.problem}
                action="Read the case study"
              />
            </CardGridItem>
          ))}
        </CardGrid>
      </Section>
    </>
  );
}
