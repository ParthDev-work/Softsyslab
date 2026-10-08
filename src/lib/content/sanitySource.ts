import "server-only";
import { sanityQuery } from "@/lib/content/sanityClient";
import {
  caseStudySchema,
  corporatePageSchema,
  jobSchema,
  policyPageSchema,
  serviceSchema,
  solutionSchema,
  type CaseStudy,
  type CorporatePage,
  type Job,
  type PolicyPage,
  type Service,
  type Solution,
} from "@/lib/content/schemas";
import type { ContentSource } from "@/lib/content/index";

/**
 * Sanity-backed ContentSource — PRD section 34.
 *
 * Every query asks for exactly the fields each zod schema needs (plus
 * Sanity's own `_id`/`_type`/`_rev`/etc., which `.parse()` silently strips —
 * zod object schemas drop unrecognised keys by default). Running every
 * fetched document back through the same schema the local, hand-authored
 * records are validated against means a malformed edit in the Studio fails
 * the same way a bad local edit would: at the point this app reads it, not
 * silently in production markup. That is section 26's publishing gate,
 * preserved across the swap from local content to a managed CMS.
 *
 * `evidence.expiresAt` is the one schema field that is both required and
 * nullable (`z.iso.date().nullable()`); every other optional field in these
 * schemas uses `.default(...)`, which zod applies when the key is simply
 * absent. Sanity omits a key entirely when a field was never filled in,
 * rather than storing an explicit `null` — so `expiresAt` alone needs
 * `coalesce(expiresAt, null)` in its projection to turn "absent" into the
 * `null` the schema requires; every other optional array defaults fine from
 * absence alone.
 */

const evidenceProjection = `{
  claim,
  sourceReference,
  owner,
  verificationDate,
  permissionStatus,
  "expiresAt": coalesce(expiresAt, null)
}`;

const sectionProjection = `{ heading, id, body, points }`;
const faqProjection = `{ question, answer }`;
const linkProjection = `{ label, href }`;
const illustrationProjection = `{
  kind,
  caption,
  "label": "Illustrative — not delivered client work",
  steps
}`;

const serviceProjection = `{
  "slug": slug.current,
  group,
  h1,
  lead,
  seo,
  businessProblems,
  goodFit,
  poorFit,
  "sections": sections[]${sectionProjection},
  capabilities,
  deliverables,
  architectureDecisions,
  securityNotes,
  integrations,
  scheduleDrivers,
  engagementNote,
  "exampleWorkflow": exampleWorkflow${illustrationProjection},
  "evidence": coalesce(evidence[]${evidenceProjection}, []),
  "faqs": faqs[]${faqProjection},
  "related": related[]${linkProjection},
  cta
}`;

const solutionProjection = `{
  "slug": slug.current,
  h1,
  lead,
  seo,
  currentState,
  "sections": sections[]${sectionProjection},
  roles[]{ role, scope },
  modules,
  integrations,
  dataAndSecurity,
  rollout,
  "sampleFlow": sampleFlow${illustrationProjection},
  "faqs": faqs[]${faqProjection},
  "related": related[]${linkProjection},
  cta
}`;

const corporatePageProjection = `{
  "slug": slug.current,
  path,
  h1,
  lead,
  seo,
  "sections": sections[]${sectionProjection},
  "faqs": coalesce(faqs[]${faqProjection}, []),
  "related": coalesce(related[]${linkProjection}, []),
  cta
}`;

const policyPageProjection = `{
  "slug": slug.current,
  path,
  h1,
  lead,
  seo,
  "requiredSections": requiredSections[]{ heading, id, inputs },
  "counselReviewOutstanding": true,
  "related": coalesce(related[]${linkProjection}, [])
}`;

const caseStudyProjection = `{
  "slug": slug.current,
  h1,
  seo,
  client,
  industry,
  problem,
  approach,
  stack,
  duration,
  "outcome": outcome[]${evidenceProjection},
  "related": related[]${linkProjection}
}`;

const jobProjection = `{
  "slug": slug.current,
  jobId,
  role,
  status,
  hiringOwner,
  location,
  employmentType,
  validThrough,
  mission,
  responsibilities,
  requiredSkills,
  "helpfulExperience": coalesce(helpfulExperience, []),
  hiringStages,
  accessibilityAdjustments,
  seo
}`;

export const sanityContentSource: ContentSource = {
  async listServices() {
    const results = await sanityQuery<unknown[]>(
      `*[_type == "service"] | order(h1 asc) ${serviceProjection}`,
      {},
      ["cms:service"],
    );
    return results.map((r) => serviceSchema.parse(r)) as Service[];
  },
  async getService(slug) {
    const result = await sanityQuery<unknown | null>(
      `*[_type == "service" && slug.current == $slug][0] ${serviceProjection}`,
      { slug },
      ["cms:service", `cms:service:${slug}`],
    );
    return result ? (serviceSchema.parse(result) as Service) : null;
  },

  async listSolutions() {
    const results = await sanityQuery<unknown[]>(
      `*[_type == "solution"] | order(h1 asc) ${solutionProjection}`,
      {},
      ["cms:solution"],
    );
    return results.map((r) => solutionSchema.parse(r)) as Solution[];
  },
  async getSolution(slug) {
    const result = await sanityQuery<unknown | null>(
      `*[_type == "solution" && slug.current == $slug][0] ${solutionProjection}`,
      { slug },
      ["cms:solution", `cms:solution:${slug}`],
    );
    return result ? (solutionSchema.parse(result) as Solution) : null;
  },

  async getCorporatePage(slug) {
    const result = await sanityQuery<unknown | null>(
      `*[_type == "corporatePage" && slug.current == $slug][0] ${corporatePageProjection}`,
      { slug },
      ["cms:corporatePage", `cms:corporatePage:${slug}`],
    );
    return result ? (corporatePageSchema.parse(result) as CorporatePage) : null;
  },
  async getPolicyPage(slug) {
    const result = await sanityQuery<unknown | null>(
      `*[_type == "policyPage" && slug.current == $slug][0] ${policyPageProjection}`,
      { slug },
      ["cms:policyPage", `cms:policyPage:${slug}`],
    );
    return result ? (policyPageSchema.parse(result) as PolicyPage) : null;
  },

  async listCaseStudies() {
    const results = await sanityQuery<unknown[]>(
      `*[_type == "caseStudy"] | order(h1 asc) ${caseStudyProjection}`,
      {},
      ["cms:caseStudy"],
    );
    return results.map((r) => caseStudySchema.parse(r)) as CaseStudy[];
  },
  async getCaseStudy(slug) {
    const result = await sanityQuery<unknown | null>(
      `*[_type == "caseStudy" && slug.current == $slug][0] ${caseStudyProjection}`,
      { slug },
      ["cms:caseStudy", `cms:caseStudy:${slug}`],
    );
    return result ? (caseStudySchema.parse(result) as CaseStudy) : null;
  },

  async listOpenJobs() {
    const results = await sanityQuery<unknown[]>(
      `*[_type == "job" && status == "open"] | order(validThrough asc) ${jobProjection}`,
      {},
      ["cms:job"],
    );
    return results.map((r) => jobSchema.parse(r)) as Job[];
  },
  async getJob(slug) {
    const result = await sanityQuery<unknown | null>(
      `*[_type == "job" && slug.current == $slug][0] ${jobProjection}`,
      { slug },
      ["cms:job", `cms:job:${slug}`],
    );
    return result ? (jobSchema.parse(result) as Job) : null;
  },
};
