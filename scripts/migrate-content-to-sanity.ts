import { randomUUID } from "node:crypto";
import { createClient, type SanityClient } from "@sanity/client";
import { serviceRecords } from "../src/content/services";
import { solutionRecords } from "../src/content/solutions";
import { caseStudyRecords } from "../src/content/case-studies";
import { jobRecords } from "../src/content/jobs";
import { corporatePages } from "../src/content/pages";
import { policyPages } from "../src/content/legal";
import type {
  CaseStudy,
  CorporatePage,
  Evidence,
  Faq,
  Illustration,
  Job,
  Link,
  PolicyPage,
  Section,
  Seo,
  Service,
  Solution,
} from "../src/lib/content/schemas";

/**
 * One-time seed: push the local typed content modules into Sanity as the
 * starting point for editors, so the CMS does not launch empty. PRD section
 * 34's "do not maintain two editable copies" means this is a migration, not
 * an ongoing sync — after this runs, src/content/*.ts stops being read (see
 * selectContentSource in src/lib/content/index.ts) and the Studio is the
 * editable copy from then on. Re-running is safe: every document gets a
 * deterministic `_id`, so this always upserts rather than duplicating.
 *
 * Requires a token wider than the runtime CMS_READ_TOKEN — that token is
 * documented as read-only on purpose. Create a separate token with "Editor"
 * permission in manage.sanity.io, pass it as CMS_WRITE_TOKEN for this
 * command only, and do not put it in any committed or deployed env file:
 *
 *   CMS_PROJECT_ID=... CMS_DATASET=... CMS_WRITE_TOKEN=... npm run migrate:cms
 */

const projectId = process.env.CMS_PROJECT_ID;
const dataset = process.env.CMS_DATASET;
const token = process.env.CMS_WRITE_TOKEN;

if (!projectId || !dataset || !token) {
  console.error(
    "Set CMS_PROJECT_ID, CMS_DATASET and CMS_WRITE_TOKEN (an Editor-level token, separate from CMS_READ_TOKEN) before running this script.",
  );
  process.exit(1);
}

const client: SanityClient = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2025-01-01",
  useCdn: false,
});

function key(): string {
  return randomUUID().replace(/-/g, "").slice(0, 12);
}

function slugField(value: string) {
  return { _type: "slug" as const, current: value };
}

function sectionDocs(sections: Section[]) {
  return sections.map((section) => ({ _type: "section", _key: key(), ...section }));
}

function faqDocs(faqs: Faq[]) {
  return faqs.map((faq) => ({ _type: "faq", _key: key(), ...faq }));
}

function linkDocs(links: Link[]) {
  return links.map((link) => ({ _type: "link", _key: key(), ...link }));
}

function evidenceDocs(evidence: Evidence[]) {
  return evidence.map((item) => ({ _type: "evidence", _key: key(), ...item }));
}

function illustrationDoc(illustration: Illustration) {
  return { _type: "illustration" as const, ...illustration };
}

function seoDoc(seo: Seo) {
  return { _type: "seo" as const, ...seo };
}

function serviceDoc(service: Service) {
  return {
    _id: `service-${service.slug}`,
    _type: "service",
    slug: slugField(service.slug),
    group: service.group,
    h1: service.h1,
    lead: service.lead,
    seo: seoDoc(service.seo),
    businessProblems: service.businessProblems,
    goodFit: service.goodFit,
    poorFit: service.poorFit,
    sections: sectionDocs(service.sections),
    capabilities: service.capabilities,
    deliverables: service.deliverables,
    architectureDecisions: service.architectureDecisions,
    securityNotes: service.securityNotes,
    integrations: service.integrations,
    scheduleDrivers: service.scheduleDrivers,
    engagementNote: service.engagementNote,
    exampleWorkflow: illustrationDoc(service.exampleWorkflow),
    evidence: evidenceDocs(service.evidence),
    faqs: faqDocs(service.faqs),
    related: linkDocs(service.related),
    cta: service.cta,
  };
}

function solutionDoc(solution: Solution) {
  return {
    _id: `solution-${solution.slug}`,
    _type: "solution",
    slug: slugField(solution.slug),
    h1: solution.h1,
    lead: solution.lead,
    seo: seoDoc(solution.seo),
    currentState: solution.currentState,
    sections: sectionDocs(solution.sections),
    roles: solution.roles.map((role) => ({ _type: "solutionRole", _key: key(), ...role })),
    modules: solution.modules,
    integrations: solution.integrations,
    dataAndSecurity: solution.dataAndSecurity,
    rollout: solution.rollout,
    sampleFlow: illustrationDoc(solution.sampleFlow),
    faqs: faqDocs(solution.faqs),
    related: linkDocs(solution.related),
    cta: solution.cta,
  };
}

function corporatePageDoc(page: CorporatePage) {
  return {
    _id: `corporatePage-${page.slug}`,
    _type: "corporatePage",
    slug: slugField(page.slug),
    path: page.path,
    h1: page.h1,
    lead: page.lead,
    seo: seoDoc(page.seo),
    sections: sectionDocs(page.sections),
    faqs: faqDocs(page.faqs),
    related: linkDocs(page.related),
    cta: page.cta,
  };
}

function policyPageDoc(page: PolicyPage) {
  return {
    _id: `policyPage-${page.slug}`,
    _type: "policyPage",
    slug: slugField(page.slug),
    path: page.path,
    h1: page.h1,
    lead: page.lead,
    seo: seoDoc(page.seo),
    // counselReviewOutstanding is intentionally omitted — the app always
    // reports it as `true` (see studio/schemaTypes/documents/policyPage.ts).
    requiredSections: page.requiredSections.map((section) => ({
      _type: "requiredSection",
      _key: key(),
      ...section,
    })),
    related: linkDocs(page.related),
  };
}

function caseStudyDoc(caseStudy: CaseStudy) {
  return {
    _id: `caseStudy-${caseStudy.slug}`,
    _type: "caseStudy",
    slug: slugField(caseStudy.slug),
    h1: caseStudy.h1,
    seo: seoDoc(caseStudy.seo),
    client: caseStudy.client,
    industry: caseStudy.industry,
    problem: caseStudy.problem,
    approach: caseStudy.approach,
    stack: caseStudy.stack,
    duration: caseStudy.duration,
    outcome: evidenceDocs(caseStudy.outcome),
    related: linkDocs(caseStudy.related),
  };
}

function jobDoc(job: Job) {
  return {
    _id: `job-${job.slug}`,
    _type: "job",
    slug: slugField(job.slug),
    jobId: job.jobId,
    role: job.role,
    status: job.status,
    hiringOwner: job.hiringOwner,
    location: job.location,
    employmentType: job.employmentType,
    validThrough: job.validThrough,
    mission: job.mission,
    responsibilities: job.responsibilities,
    requiredSkills: job.requiredSkills,
    helpfulExperience: job.helpfulExperience,
    hiringStages: job.hiringStages,
    accessibilityAdjustments: job.accessibilityAdjustments,
    seo: job.seo,
  };
}

async function migrate() {
  // Each mapper returns a differently-shaped document, so this is typed as
  // the common shape @sanity/client's write methods actually need rather
  // than forcing six document shapes into one union.
  const documents: Array<Record<string, unknown> & { _id: string; _type: string }> = [
    ...serviceRecords.map(serviceDoc),
    ...solutionRecords.map(solutionDoc),
    ...corporatePages.map(corporatePageDoc),
    ...policyPages.map(policyPageDoc),
    ...caseStudyRecords.map(caseStudyDoc),
    ...jobRecords.map(jobDoc),
  ];

  console.log(`Migrating ${documents.length} documents to ${dataset}...`);

  // createOrReplace per document (not one giant transaction) so one bad
  // record reports its own id rather than failing the whole batch silently.
  let migrated = 0;
  for (const doc of documents) {
    try {
      await client.createOrReplace(doc);
      migrated += 1;
    } catch (error) {
      console.error(`Failed to migrate ${doc._id}:`, error);
    }
  }

  console.log(`Done: ${migrated}/${documents.length} documents migrated.`);
  if (migrated !== documents.length) process.exitCode = 1;
}

migrate();
