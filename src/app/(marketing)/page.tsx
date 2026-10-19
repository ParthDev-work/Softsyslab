import type { Metadata } from "next";
import { Reveal } from "@/components/ui/Reveal";
import { SecurityBoundaryFigure } from "@/components/blocks/HeroFigures";
import { FaqList } from "@/components/blocks/FaqList";
import { JourneyTimeline } from "@/components/blocks/JourneyTimeline";
import { EditorialStatementPanel } from "@/components/blocks/editorial/EditorialStatementPanel";
import {
  capabilityBoardAccents,
  capabilityBoardCopy,
} from "@/components/blocks/editorial/capabilityBoardData";
import { HomeHero } from "@/components/blocks/home/HomeHero";
import { Marquee } from "@/components/blocks/home/Marquee";
import { HomeSectionHeader } from "@/components/blocks/home/HomeSectionHeader";
import { CapabilityBento } from "@/components/blocks/home/CapabilityBento";
import { ServiceExplorer } from "@/components/blocks/home/ServiceExplorer";
import { ProcessJourney } from "@/components/blocks/home/ProcessJourney";
import { WorkflowShowcase } from "@/components/blocks/home/WorkflowShowcase";
import {
  DecisionBand,
  EngagementBand,
  FinalCta,
  PrinciplesBand,
  SecurityBand,
  TechnologyBand,
} from "@/components/blocks/home/HomeSections";
import { ArrowLink } from "@/components/ui/Button";
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
import { serviceGroups } from "@/content/services";

const homepageServiceGroups = serviceGroupCards.map((card) => {
  const group = serviceGroups.find((entry) => entry.title === card.title);
  const groupHref = group ? `/services/#${group.id}` : "/services/";
  return {
    id: group?.id ?? "services",
    title: card.title,
    summary: card.body,
    items: [
      { label: "Review a representative service", href: card.href },
      { label: "Browse this service group", href: groupHref },
    ],
  };
});

const capabilityItems = capabilitySummary.items.map((item, index) => {
  const extra = capabilityBoardCopy[item.label];
  return {
    number: String(index + 1).padStart(2, "0"),
    title: item.label,
    copy: extra?.copy ?? capabilitySummary.intro,
    tags: extra?.tags ?? [],
    href: item.href,
    accent: capabilityBoardAccents[index % capabilityBoardAccents.length],
  };
});

export const metadata: Metadata = buildMetadata(homepageSeo, "/");

/**
 * PRD section 13 homepage. Section ids match `homeSectionTracker` in
 * content/homepage.ts. Modules without verified content stay omitted.
 */
export default function HomePage() {
  return (
    <>
      <HomeHero
        headingId="hero-h"
        eyebrow="Custom software development"
        h1={hero.h1}
        body={hero.body}
        supportingLine={hero.supportingLine}
        primaryCta={hero.primaryCta}
        secondaryCta={hero.secondaryCta}
      />

      <Marquee
        items={[
          ...capabilitySummary.items.map((item) => item.label),
          ...serviceGroupCards.map((card) => card.title),
        ]}
      />

      <div id="approach">
        <EditorialStatementPanel
          statement={valueProposition.heading}
          support={valueProposition.body}
          phases={valueProposition.approachPhases}
        />
      </div>

      <section
        id="capabilities"
        aria-labelledby="cap-h"
        className="py-[clamp(4.5rem,10vw,8rem)]"
      >
        <div className="container-page">
          <HomeSectionHeader
            eyebrow="Capabilities"
            heading={capabilitySummary.heading}
            headingId="cap-h"
            support={capabilitySummary.intro}
          />
          <CapabilityBento capabilities={capabilityItems} />
        </div>
      </section>

      <DecisionBand
        eyebrow="Planning"
        heading="Scope, architecture and delivery — decided early."
        rows={valueProposition.panels}
        cta={valueProposition.cta}
      />

      <section
        id="services"
        aria-labelledby="svc-h"
        className="py-[clamp(4.5rem,10vw,8rem)]"
      >
        <div className="container-page">
          <HomeSectionHeader
            eyebrow="Services"
            heading="Choose the support your project needs."
            headingId="svc-h"
            support="Five service groups, each with its own scope, deliverables and boundaries. Every service page states when it is the wrong choice as well as when it is the right one."
          />
          <ServiceExplorer groups={homepageServiceGroups} />
        </div>
      </section>

      <section
        id="process"
        aria-labelledby="proc-h"
        className="relative overflow-hidden bg-surface py-[clamp(4.5rem,10vw,8rem)]"
      >
        <div
          aria-hidden="true"
          className="dot-grid fade-mask absolute inset-0"
        />
        <div className="container-page relative">
          <HomeSectionHeader
            eyebrow="Process"
            heading={deliveryMethod.heading}
            headingId="proc-h"
            support={deliveryMethod.intro}
            align="center"
          />
          <Reveal>
            <ProcessJourney
              stages={deliveryMethod.stages}
              phases={deliveryMethod.phases}
            />
          </Reveal>
          <div className="mt-10 text-center">
            <ArrowLink href={deliveryMethod.cta.href}>
              {deliveryMethod.cta.label}
            </ArrowLink>
          </div>
        </div>
      </section>

      <TechnologyBand
        heading={technologyChoices.heading}
        body={technologyChoices.body}
        withheldNote={technologyChoices.withheldNote}
        cta={technologyChoices.cta}
      />

      <section
        aria-labelledby="work-h"
        className="py-[clamp(4.5rem,10vw,8rem)]"
      >
        <div className="container-page">
          <HomeSectionHeader
            eyebrow="Workflows"
            heading={workflowExamples.heading}
            headingId="work-h"
            support={workflowExamples.intro}
          />
          <WorkflowShowcase cards={workflowExamples.cards} />
          <div className="mt-10">
            <ArrowLink href={workflowExamples.cta.href}>
              {workflowExamples.cta.label}
            </ArrowLink>
          </div>
        </div>
      </section>

      <EngagementBand
        heading={engagementCards.heading}
        body={engagementCards.body}
        models={engagementCards.models}
        cta={engagementCards.cta}
      />

      <PrinciplesBand
        eyebrow="Delivery principles"
        heading={deliveryPrinciples.heading}
        intro={deliveryPrinciples.intro}
        rows={deliveryPrinciples.rows}
        cta={deliveryPrinciples.cta}
      />

      <SecurityBand
        heading={securityAndQuality.heading}
        body={securityAndQuality.body}
        cta={securityAndQuality.cta}
        figure={
          <SecurityBoundaryFigure
            caption={`${securityAndQuality.boundary.caption} ${securityAndQuality.boundary.label}.`}
          />
        }
      />

      <section
        id="journey"
        aria-labelledby="jr-h"
        className="py-[clamp(4.5rem,10vw,8rem)]"
      >
        <div className="container-page grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div className="lg:sticky lg:top-40 lg:self-start">
            <HomeSectionHeader
              eyebrow="Client journey"
              heading={clientJourney.heading}
              headingId="jr-h"
              className="mb-0 !grid-cols-1"
            />
            <Reveal className="mt-6">
              <p className="max-w-[44ch] rounded-2xl border border-info-bg bg-info-bg/60 p-5 text-small leading-relaxed text-info">
                {clientJourney.note}
              </p>
              <ArrowLink href={clientJourney.cta.href} className="mt-6">
                {clientJourney.cta.label}
              </ArrowLink>
            </Reveal>
          </div>
          <div className="rounded-[1.75rem] border border-hairline bg-canvas p-6 shadow-soft sm:p-10">
            <JourneyTimeline groups={clientJourney.groups} />
          </div>
        </div>
      </section>

      <section
        id="faq"
        aria-labelledby="faqs"
        className="bg-paper py-[clamp(4.5rem,10vw,8rem)]"
      >
        <div className="container-page">
          <FaqList
            faqs={homepageFaqs}
            support="Short answers to what most people ask before the first call."
          />
        </div>
      </section>

      <div id="contact-cta" className="bg-paper">
        <FinalCta
          heading={finalCta.heading}
          body={finalCta.body}
          cta={finalCta.cta}
          secondary={hero.secondaryCta}
          cycleWords={capabilitySummary.items.map((item) => item.label)}
        />
      </div>
    </>
  );
}
