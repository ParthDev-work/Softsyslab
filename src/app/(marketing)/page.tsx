import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLink, LinkButton } from "@/components/ui/Button";
import {
  Card,
  CardGrid,
  CardGridItem,
  LinkCard,
  RuledCell,
  RuledGrid,
} from "@/components/ui/Card";
import {
  Container,
  Eyebrow,
  Section,
  SectionHeader,
  SectionHeading,
} from "@/components/ui/Layout";
import { FaqList } from "@/components/blocks/FaqList";
import { CtaBanner } from "@/components/blocks/CtaBanner";
import {
  ProjectBriefFigure,
  SecurityBoundaryFigure,
} from "@/components/blocks/Figure";
import { Reveal } from "@/components/ui/Reveal";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  capabilitySummary,
  clientJourney,
  deliveryMethod,
  deliveryPrinciples,
  engagementCards,
  finalCta,
  hero,
  homepageFaqs,
  homepageSeo,
  securityAndQuality,
  serviceGroupCards,
  technologyChoices,
  valueProposition,
  workflowExamples,
} from "@/content/homepage";
import { publishableTechnologies } from "@/content/technologies";

export const metadata: Metadata = buildMetadata(homepageSeo, "/");

/**
 * PRD section 13.
 *
 * Nineteen modules are specified; this page publishes the fifteen that have
 * verified content. Modules 8 (featured projects), 15 (testimonials) and 16
 * (insights) are absent entirely — not stubbed, not hidden — because section 13
 * says a module with no verified content is omitted, and section 26 says to
 * block placeholder publication rather than hide text in CSS.
 */
/* The design's emphasis treatment for the hero headline: the final two
   words carry the brand accent colour. Derived from the content string
   rather than hardcoded so the copy in content/homepage.ts stays the only
   source of truth for the words themselves. */
const heroHeadingAccentWords = 2;
const heroHeadingWords = hero.h1.split(" ");
const heroHeadingLead = heroHeadingWords
  .slice(0, -heroHeadingAccentWords)
  .join(" ");
const heroHeadingAccent = heroHeadingWords
  .slice(-heroHeadingAccentWords)
  .join(" ");

export default function HomePage() {
  return (
    <>
      {/* Module 3 — hero. A subtle tint-to-canvas wash (section 29's tokens
          only, nothing new) replaces the flat canvas background; the figure
          beside it is markup, not a photo, so there is no image to clash
          with. */}
      <section aria-labelledby="hero-h" className="section-y-lg hero-wash">
        <Container>
          <div className="flex flex-wrap items-center gap-x-[clamp(2.5rem,6vw,6rem)] gap-y-10">
            <div className="min-w-0 max-w-155 flex-7 basis-115">
              <p className="type-eyebrow m-0 inline-flex items-center gap-2.5 rounded-full border border-hairline bg-canvas px-3 py-1.5">
                <span
                  aria-hidden="true"
                  className="size-1.5 shrink-0 rounded-full bg-brand animate-pulse motion-reduce:animate-none"
                />
                Custom software development
              </p>
              <h1 id="hero-h" className="type-display mt-7">
                {heroHeadingLead}{" "}
                <span className="text-brand">{heroHeadingAccent}</span>
              </h1>
              <p className="type-lead mt-7">{hero.body}</p>

              <div className="mt-9 flex flex-wrap gap-3">
                <LinkButton href={hero.primaryCta.href} size="lg">
                  {hero.primaryCta.label}
                </LinkButton>
                <LinkButton
                  href={hero.secondaryCta.href}
                  variant="outline"
                  size="lg"
                >
                  {hero.secondaryCta.label}
                </LinkButton>
              </div>

              <p className="mt-7 max-w-[46ch] border-t border-hairline pt-5 text-small text-muted">
                {hero.supportingLine}
              </p>
            </div>

            {/* The LCP candidate is text, and this figure is markup rather than
                an image, so there is nothing here to lazy-load or preload. */}
            <ProjectBriefFigure />
          </div>
        </Container>
      </section>

      {/* Module 4 — capability summary */}
      <section
        id="capabilities"
        aria-labelledby="cap-h"
        className="pb-[clamp(3rem,7vw,5.5rem)]"
      >
        <Container>
          <Reveal className="flex flex-wrap gap-x-12 gap-y-6 border-t border-anchor pt-8">
            <div className="max-w-95 flex-1 basis-70">
              <h2
                id="cap-h"
                className="text-[clamp(1.375rem,2vw,1.5rem)]/8 font-semibold tracking-[-0.01em]"
              >
                {capabilitySummary.heading}
              </h2>
              <p className="mt-3 text-body text-muted">
                {capabilitySummary.intro}
              </p>
            </div>
            <ul
              className="grid flex-2 basis-130 list-none gap-x-6 p-0"
              style={{
                gridTemplateColumns:
                  "repeat(auto-fill, minmax(min(100%, 13.75rem), 1fr))",
              }}
            >
              {capabilitySummary.items.map((item, index) => (
                <li key={item.href} className="border-b border-hairline">
                  <Link
                    href={item.href}
                    className="flex items-center justify-between gap-3 py-4 text-[1.0625rem] font-medium text-anchor transition-colors duration-150 hover:text-brand motion-reduce:transition-none"
                  >
                    <span className="flex items-baseline gap-3.5">
                      <span
                        aria-hidden="true"
                        className="font-mono text-xs font-normal text-faint"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {item.label}
                    </span>
                    <span aria-hidden="true" className="text-faint">
                      ↗
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </section>

      {/* Module 5 — value proposition */}
      <Section tone="surface" labelledBy="val-h">
        <Reveal className="flex flex-wrap gap-x-16 gap-y-12">
          <div className="min-w-0 flex-5 basis-85">
            <SectionHeading id="val-h">
              {valueProposition.heading}
            </SectionHeading>
            <p className="mt-6 text-body-lg text-muted text-pretty">
              {valueProposition.body}
            </p>
            <LinkButton
              href={valueProposition.cta.href}
              variant="outline"
              className="mt-8 border-anchor hover:bg-anchor hover:text-white"
            >
              {valueProposition.cta.label}
            </LinkButton>
          </div>
          <ul className="grid min-w-0 flex-7 basis-110 list-none gap-3 p-0">
            {valueProposition.panels.map((panel) => (
              <li
                key={panel.title}
                className="grid grid-cols-1 gap-x-6 gap-y-2 rounded-card border border-hairline bg-canvas px-7 py-6 sm:grid-cols-[minmax(0,8.75rem)_minmax(0,1fr)]"
              >
                <h3 className="text-h4 font-semibold">{panel.title}</h3>
                <p className="text-body text-muted">{panel.body}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </Section>

      {/* Module 6 — service groups */}
      <Section id="services" labelledBy="svc-h">
        <SectionHeader
          id="svc-h"
          heading="Choose the support your project needs."
          support="Five service groups, each with its own scope, deliverables and boundaries. Every service page states when it is the wrong choice as well as when it is the right one."
        />
        <Reveal>
          <CardGrid min="20rem">
            {serviceGroupCards.map((group, index) => (
              <CardGridItem key={group.href}>
                <LinkCard
                  href={group.href}
                  index={String(index + 1).padStart(2, "0")}
                  title={group.title}
                  body={group.body}
                  action="Explore"
                />
              </CardGridItem>
            ))}
          </CardGrid>
        </Reveal>
      </Section>

      {/* Module 7 — delivery method. Each stage reveals in sequence rather
          than all at once, via a per-index transition-delay (section 10). */}
      <Section id="process" labelledBy="proc-h" divider>
        <SectionHeader
          id="proc-h"
          heading={deliveryMethod.heading}
          support={deliveryMethod.intro}
          className="mb-12"
        />
        <RuledGrid min="20rem">
          {deliveryMethod.stages.map((stage, index) => (
            <RuledCell key={stage.name}>
              <Reveal delay={index * 60} className="grid content-start gap-2.5">
                <span
                  aria-hidden="true"
                  className="font-mono text-eyebrow text-brand"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="text-h3 font-semibold">{stage.name}</h3>
                <p className="text-small text-muted">
                  <span className="text-dim">Artifact — </span>
                  <span className="text-anchor">{stage.artifact}</span>
                </p>
              </Reveal>
            </RuledCell>
          ))}
        </RuledGrid>
        <ArrowLink href={deliveryMethod.cta.href} className="mt-8">
          {deliveryMethod.cta.label}
        </ArrowLink>
      </Section>

      {/* Module 9 — technology choices. Copy publishes; the capability list
          does not, because no record has passed the section 17 review gate. */}
      <Section tone="surface" labelledBy="tech-h">
        <Reveal className="flex flex-wrap gap-x-16 gap-y-10">
          <div className="min-w-0 flex-5 basis-85">
            <SectionHeading id="tech-h">
              {technologyChoices.heading}
            </SectionHeading>
            <p className="mt-6 text-body-lg text-muted text-pretty">
              {technologyChoices.body}
            </p>
            <ArrowLink href={technologyChoices.cta.href} className="mt-6">
              {technologyChoices.cta.label}
            </ArrowLink>
          </div>
          <div className="min-w-0 flex-7 basis-110">
            {publishableTechnologies.length > 0 ? (
              <ul className="flex flex-wrap gap-2 p-0">
                {publishableTechnologies.map((technology) => (
                  <li
                    key={technology.name}
                    className="rounded-full border border-line bg-canvas px-3 py-1 text-xs"
                  >
                    {technology.name}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="rounded-card border border-dashed border-line bg-canvas p-7">
                <p className="type-meta text-dim">Capability list withheld</p>
                <p className="mt-3 text-body text-muted">
                  {technologyChoices.withheldNote}
                </p>
              </div>
            )}
          </div>
        </Reveal>
      </Section>

      {/* Module 10 — workflow shapes, framed as examples rather than sectors */}
      <Section labelledBy="ind-h">
        <SectionHeader
          id="ind-h"
          heading={workflowExamples.heading}
          support={workflowExamples.intro}
        />
        <Reveal>
          <CardGrid min="17rem">
            {workflowExamples.cards.map((card) => (
              <CardGridItem key={card.title}>
                <Card className="w-full">
                  <h3 className="text-h4 font-semibold">{card.title}</h3>
                  <p className="mt-2 text-body text-muted">{card.body}</p>
                </Card>
              </CardGridItem>
            ))}
          </CardGrid>
        </Reveal>
        <ArrowLink href={workflowExamples.cta.href} className="mt-8">
          {workflowExamples.cta.label}
        </ArrowLink>
      </Section>

      {/* Module 11 — engagement models. No invented price ranges. */}
      <Section id="engagement" labelledBy="eng-h" divider>
        <SectionHeader
          id="eng-h"
          heading={engagementCards.heading}
          support={engagementCards.body}
        />
        <Reveal>
          <CardGrid min="17rem">
            {engagementCards.models.map((model) => (
              <CardGridItem key={model}>
                <Card className="w-full">
                  <h3 className="text-h4 font-semibold">{model}</h3>
                </Card>
              </CardGridItem>
            ))}
          </CardGrid>
        </Reveal>
        <ArrowLink href={engagementCards.cta.href} className="mt-8">
          {engagementCards.cta.label}
        </ArrowLink>
      </Section>

      {/* Module 12 — delivery principles, framed as what any agreement
          should set out, since section 13 marks them pending owner signoff. */}
      <Section labelledBy="prin-h" divider>
        <Reveal className="flex flex-wrap gap-x-16 gap-y-8">
          <div className="min-w-0 flex-4 basis-75">
            <SectionHeading id="prin-h" className="lg:sticky lg:top-36">
              {deliveryPrinciples.heading}
            </SectionHeading>
          </div>
          <div className="min-w-0 flex-8 basis-125">
            <p className="mb-2 max-w-[60ch] text-body text-muted">
              {deliveryPrinciples.intro}
            </p>
            <ul className="p-0">
              {deliveryPrinciples.rows.map((row) => (
                <li
                  key={row.title}
                  className="grid gap-x-8 gap-y-2 border-t border-line py-7 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]"
                >
                  <h3 className="text-h3 font-semibold">{row.title}</h3>
                  <p className="text-[1.0625rem]/7 text-muted">{row.body}</p>
                </li>
              ))}
            </ul>
            <div className="border-t border-line pt-6">
              <ArrowLink href={deliveryPrinciples.cta.href}>
                {deliveryPrinciples.cta.label}
              </ArrowLink>
            </div>
          </div>
        </Reveal>
      </Section>

      {/* Module 13 — security and quality */}
      <Section id="security" tone="ink" size="large" labelledBy="sec-h">
        <Reveal className="flex flex-wrap items-center gap-x-18 gap-y-12">
          <div className="min-w-0 flex-1 basis-95">
            <Eyebrow className="text-faint">Security and quality</Eyebrow>
            <SectionHeading
              id="sec-h"
              className="mt-5 max-w-[16ch] text-white"
            >
              {securityAndQuality.heading}
            </SectionHeading>
            <p className="mt-6 max-w-[50ch] text-body-lg text-line">
              {securityAndQuality.body}
            </p>
            <LinkButton
              href={securityAndQuality.cta.href}
              variant="onDark"
              className="mt-8"
            >
              {securityAndQuality.cta.label}
            </LinkButton>
          </div>
          <SecurityBoundaryFigure caption="Illustrative boundary — controls are agreed per project" />
        </Reveal>
      </Section>

      {/* Module 14 — client journey */}
      <Section id="journey" labelledBy="jr-h">
        <SectionHeader
          id="jr-h"
          heading={clientJourney.heading}
          support={clientJourney.note}
        />
        <Reveal>
          <ul
            className="grid list-none gap-6 p-0"
            style={{
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 27.5rem), 1fr))",
            }}
          >
            {clientJourney.groups.map((group, groupIndex) => (
              <li
                key={group.title}
                className="rounded-card border border-hairline bg-surface p-7"
              >
                <h3 className="mb-5 text-h3 font-semibold">{group.title}</h3>
                <ol className="grid list-none gap-3 p-0">
                  {group.steps.map((step, stepIndex) => (
                    <li
                      key={step}
                      className="grid grid-cols-[2rem_minmax(0,1fr)] items-baseline gap-3 text-body"
                    >
                      <span
                        aria-hidden="true"
                        className="font-mono text-eyebrow text-brand"
                      >
                        {String(groupIndex * 3 + stepIndex + 1).padStart(2, "0")}
                      </span>
                      <span className="text-muted">{step}</span>
                    </li>
                  ))}
                </ol>
              </li>
            ))}
          </ul>
        </Reveal>
        <LinkButton
          href={clientJourney.cta.href}
          variant="dark"
          className="mt-8"
        >
          {clientJourney.cta.label}
        </LinkButton>
      </Section>

      {/* Module 17 — FAQs. All answer text is in the rendered HTML. */}
      <Section id="faq" labelledBy="faqs" divider>
        <FaqList
          faqs={homepageFaqs}
          support="Short answers to what most people ask before the first call."
        />
      </Section>

      {/* Module 18 — final call to action */}
      <CtaBanner
        heading={finalCta.heading}
        body={finalCta.body}
        label={finalCta.cta.label}
        href={finalCta.cta.href}
      />
    </>
  );
}
