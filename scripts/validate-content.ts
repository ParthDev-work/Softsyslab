/**
 * The publication gate — PRD section 26 (REQ-CONTENT-01) and AC02.
 *
 * Section 26: "Regex detection is a helper, not the whole review: detect ADD,
 * VERIFIED, INSERT and common dummy content in customer-visible fields. Block
 * placeholder publication rather than merely hiding text in CSS."
 *
 * This runs in `prebuild` and in CI, and it exits non-zero on any finding, so
 * a placeholder cannot reach a deployed page. It checks four things the type
 * system cannot:
 *
 *   1. Placeholder markers and lorem ipsum in customer-visible text.
 *   2. Word-count bounds the schema states but cannot express.
 *   3. Every internal link resolves to a published route (REQ-NAV-01).
 *   4. No unverified technology record is reachable from rendered output.
 *
 * It is not a substitute for the human review section 26 describes. It catches
 * the mechanical failures so the review can spend its attention elsewhere.
 */

import {
  isPublishableTechnology,
  type Faq,
  type Section,
} from "../src/lib/content/schemas";
import { serviceRecords } from "../src/content/services";
import { solutionRecords } from "../src/content/solutions";
import { corporatePages, contactPage, servicesHub, solutionsHub } from "../src/content/pages";
import { policyPages } from "../src/content/legal";
import { caseStudyRecords } from "../src/content/case-studies";
import { jobRecords } from "../src/content/jobs";
import { technologyRecords } from "../src/content/technologies";
import { isPublishedRoute, publishedRoutes } from "../src/lib/content/routes";
import * as homepage from "../src/content/homepage";

type Finding = { where: string; problem: string };

const findings: Finding[] = [];

function report(where: string, problem: string) {
  findings.push({ where, problem });
}

/* -------------------------------------------------- 1. placeholder scan -- */

/**
 * Bracketed slots, the PRD's own placeholder verbs and classic dummy content.
 *
 * "VERIFIED" is matched only in the shouting form section 26 names, so that
 * ordinary prose about verification does not trip the gate. Likewise "ADD" is
 * matched as a standalone shouted word rather than inside "address".
 */
const placeholderPatterns: Array<{ label: string; pattern: RegExp }> = [
  { label: "bracketed placeholder", pattern: /\[[A-Z][A-Z0-9 _/-]{2,}\]/ },
  { label: "ADD marker", pattern: /\bADD\b/ },
  { label: "VERIFIED marker", pattern: /\bVERIFIED\b/ },
  { label: "INSERT marker", pattern: /\bINSERT\b/ },
  { label: "TODO marker", pattern: /\bTODO\b/i },
  { label: "TBD marker", pattern: /\bTBD\b/ },
  { label: "lorem ipsum", pattern: /lorem ipsum/i },
  { label: "dummy counter", pattern: /\b(?:xx|999\+|000\+)\b/i },
  { label: "placeholder domain", pattern: /example\.(?:com|org)\b/i },
];

function scanText(where: string, value: string) {
  for (const { label, pattern } of placeholderPatterns) {
    if (pattern.test(value)) {
      const match = pattern.exec(value)?.[0] ?? "";
      report(where, `contains a ${label}: "${match}"`);
    }
  }
}

/** Walk every string in a record, skipping keys that are not reader-facing. */
const nonVisibleKeys = new Set([
  "slug",
  "id",
  "href",
  "path",
  "group",
  "layer",
  "status",
  "kind",
  "jobId",
  "canonicalOrigin",
]);

function scanRecord(where: string, value: unknown, keyPath = "") {
  if (typeof value === "string") {
    const leaf = keyPath.split(".").pop() ?? "";
    if (!nonVisibleKeys.has(leaf)) scanText(`${where}${keyPath}`, value);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => scanRecord(where, item, `${keyPath}[${index}]`));
    return;
  }
  if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      scanRecord(where, child, keyPath ? `${keyPath}.${key}` : `.${key}`);
    }
  }
}

/* ------------------------------------------------------ 2. word counts -- */

function wordCount(value: string): number {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

/* -------------------------------------------------- 3. link resolution -- */

const seenLinks = new Set<string>();

function checkLink(where: string, href: string) {
  seenLinks.add(href);
  if (!isPublishedRoute(href)) {
    report(where, `links to "${href}", which is not a published route`);
  }
}

/* ------------------------------------------------------------- checks --- */

function checkSections(where: string, sections: Section[]) {
  const ids = new Set<string>();
  for (const section of sections) {
    if (ids.has(section.id)) {
      report(where, `has a duplicate anchor id "${section.id}"`);
    }
    ids.add(section.id);
  }
}

function checkFaqs(where: string, faqs: Faq[]) {
  const questions = new Set<string>();
  for (const faq of faqs) {
    if (questions.has(faq.question)) {
      report(where, `repeats the FAQ "${faq.question}"`);
    }
    questions.add(faq.question);
  }
}

for (const service of serviceRecords) {
  const where = `service "${service.slug}"`;
  scanRecord(where, service);
  checkSections(where, service.sections);
  checkFaqs(where, service.faqs);

  // Section 14: a 50-90 word lead.
  const words = wordCount(service.lead);
  if (words < 50 || words > 90) {
    report(where, `lead is ${words} words; section 14 requires 50-90`);
  }

  for (const link of service.related) checkLink(`${where} related link`, link.href);

  // Section 14 requires evidence to be absent or complete, never partial.
  for (const evidence of service.evidence) {
    if (evidence.permissionStatus === "pending") {
      report(where, `publishes evidence whose permission is still pending`);
    }
  }
}

for (const solution of solutionRecords) {
  const where = `solution "${solution.slug}"`;
  scanRecord(where, solution);
  checkSections(where, solution.sections);
  checkFaqs(where, solution.faqs);
  for (const link of solution.related) checkLink(`${where} related link`, link.href);
}

for (const page of corporatePages) {
  const where = `corporate page "${page.slug}"`;
  scanRecord(where, page);
  checkSections(where, page.sections);
  checkFaqs(where, page.faqs);
  for (const link of page.related) checkLink(`${where} related link`, link.href);
  if (!isPublishedRoute(page.path)) {
    report(where, `has path "${page.path}", which is not in the route registry`);
  }
}

for (const page of policyPages) {
  const where = `policy page "${page.slug}"`;
  scanRecord(where, page);
  for (const link of page.related) checkLink(`${where} related link`, link.href);
  if (!isPublishedRoute(page.path)) {
    report(where, `has path "${page.path}", which is not in the route registry`);
  }
}

scanRecord("services hub", servicesHub);
scanRecord("solutions hub", solutionsHub);
scanRecord("contact page", contactPage);
checkFaqs("services hub", [...servicesHub.faqs]);
checkFaqs("solutions hub", [...solutionsHub.faqs]);
checkFaqs("contact page", [...contactPage.faqs]);

/* Homepage modules are plain exported objects, so walk them all. */
for (const [name, value] of Object.entries(homepage)) {
  if (typeof value === "function") continue;
  scanRecord(`homepage.${name}`, value);
}
checkFaqs("homepage", homepage.homepageFaqs);

for (const link of [
  homepage.announcement.href,
  homepage.hero.primaryCta.href,
  homepage.hero.secondaryCta.href,
  homepage.valueProposition.cta.href,
  homepage.deliveryMethod.cta.href,
  homepage.technologyChoices.cta.href,
  homepage.workflowExamples.cta.href,
  homepage.engagementCards.cta.href,
  homepage.deliveryPrinciples.cta.href,
  homepage.securityAndQuality.cta.href,
  homepage.clientJourney.cta.href,
  homepage.finalCta.cta.href,
  ...homepage.capabilitySummary.items.map((item) => item.href),
  ...homepage.serviceGroupCards.map((card) => card.href),
]) {
  checkLink("homepage link", link);
}

/* Section 11's redirects must land somewhere published. Kept in step with
   next.config.ts, which declares the same pairs. */
for (const destination of ["/company/", "/careers/"]) {
  checkLink("redirect destination", destination);
}

/* ----------------------------------- 4. unverified capability reachable -- */

const publishable = technologyRecords.filter(isPublishableTechnology);
const publishableNames = new Set(publishable.map((record) => record.name));

for (const record of technologyRecords) {
  if (publishableNames.has(record.name)) continue;
  // An unverified record must not be named in any rendered copy.
  const haystack = [
    ...serviceRecords.flatMap((service) => [
      service.lead,
      ...service.sections.flatMap((section) => section.body),
      ...service.capabilities,
    ]),
    ...corporatePages.flatMap((page) =>
      page.sections.flatMap((section) => section.body),
    ),
  ];
  for (const text of haystack) {
    // Word-boundary match so "Java" does not match "JavaScript".
    const pattern = new RegExp(
      `\\b${record.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
    );
    if (pattern.test(text)) {
      report(
        `technology "${record.name}"`,
        `is unverified but is named in published copy`,
      );
      break;
    }
  }
}

/* ------------------------------------------- withheld collections check -- */

if (caseStudyRecords.length === 0 && isPublishedRoute("/case-studies/")) {
  report(
    "case studies",
    "collection is empty but /case-studies/ is in the published route registry",
  );
}

for (const job of jobRecords) {
  if (job.status === "open" && !isPublishedRoute(`/careers/${job.slug}/`)) {
    report(`job "${job.slug}"`, "is open but has no published route");
  }
}

/* --------------------------------------------------------------- report -- */

const routeCount = publishedRoutes.length;

if (findings.length > 0) {
  console.error(
    `\nContent validation failed — ${findings.length} finding(s).\n`,
  );
  for (const finding of findings) {
    console.error(`  ✗ ${finding.where} ${finding.problem}`);
  }
  console.error(
    "\nSection 26 blocks placeholder publication rather than hiding it.",
  );
  console.error("Fix the content, or withhold the record, then build again.\n");
  process.exit(1);
}

console.info(
  `Content validation passed — ${routeCount} published routes, ` +
    `${serviceRecords.length} services, ${solutionRecords.length} solutions, ` +
    `${seenLinks.size} distinct internal links resolved, ` +
    `${technologyRecords.length - publishable.length} technology records correctly withheld.`,
);
