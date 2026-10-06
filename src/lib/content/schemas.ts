import { z } from "zod";

/**
 * Content contract — PRD section 14's shared service contract and section 26's
 * publishing gate, encoded as types so an incomplete record fails typechecking
 * and the build rather than shipping a thin page.
 *
 * These schemas run at module load. scripts/validate-content.ts layers the
 * placeholder and cross-reference checks on top (REQ-CONTENT-01 / AC02).
 */

/** Section 17: a claim about company capability needs an accountable record. */
export const evidenceSchema = z.object({
  claim: z.string().min(1),
  sourceReference: z.string().min(1),
  owner: z.string().min(1),
  verificationDate: z.iso.date(),
  permissionStatus: z.enum(["granted", "internal-only", "pending"]),
  expiresAt: z.iso.date().nullable(),
});
export type Evidence = z.infer<typeof evidenceSchema>;

/** An internal destination. Validated against the published-route registry. */
export const internalPathSchema = z
  .string()
  .regex(
    /^\/(?:[a-z0-9]+(?:-[a-z0-9]+)*\/)*$/,
    "Internal paths are lowercase, hyphenated and end in a trailing slash.",
  );

export const linkSchema = z.object({
  label: z.string().min(1).max(60),
  href: internalPathSchema,
});
export type Link = z.infer<typeof linkSchema>;

export const faqSchema = z.object({
  question: z.string().min(8).max(200),
  answer: z.string().min(20).max(1200),
});
export type Faq = z.infer<typeof faqSchema>;

export const sectionSchema = z.object({
  /** Becomes an H2, and the anchor label where the template shows a contents list. */
  heading: z.string().min(2).max(120),
  /** Stable anchor id. Lowercase and hyphenated. */
  id: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Anchor ids are lowercase and hyphenated."),
  /** One or more paragraphs. Rendered as plain text, never as HTML. */
  body: z.array(z.string().min(30)).min(1),
  /** Optional bulleted points beneath the paragraphs. */
  points: z.array(z.string().min(3)).optional(),
});
export type Section = z.infer<typeof sectionSchema>;

/** Section 13: illustrative visuals carry a visible label and are never case studies. */
export const illustrationSchema = z.object({
  kind: z.enum(["workflow", "boundary", "layers"]),
  caption: z.string().min(10),
  /** Rendered beneath the figure. Required — the PRD forbids unlabelled mockups. */
  label: z.literal("Illustrative — not delivered client work"),
  steps: z.array(z.string().min(2)).min(2),
});
export type Illustration = z.infer<typeof illustrationSchema>;

export const seoSchema = z.object({
  /** H1 doubles as the SEO title with the brand suffix appended (section 14). */
  title: z.string().min(10).max(70),
  description: z.string().min(70).max(170),
});
export type Seo = z.infer<typeof seoSchema>;

/** PRD section 14 — every field here is required by the shared service contract. */
export const serviceSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  /** Grouping used by the services hub and homepage module 6. */
  group: z.enum([
    "strategy-and-design",
    "application-engineering",
    "ai-and-integration",
    "cloud-and-modernization",
    "quality-and-support",
  ]),
  h1: z.string().min(5).max(80),
  /** Section 14 requires a 50-90 word lead. Word count enforced by the validator. */
  lead: z.string().min(240).max(900),
  seo: seoSchema,
  businessProblems: z.array(z.string().min(20)).min(3),
  goodFit: z.array(z.string().min(15)).min(2),
  /** Section 14 explicitly requires poor-fit cases, not just a sales list. */
  poorFit: z.array(z.string().min(15)).min(2),
  sections: z.array(sectionSchema).min(3),
  capabilities: z.array(z.string().min(10)).min(4),
  deliverables: z.array(z.string().min(5)).min(3),
  architectureDecisions: z.array(z.string().min(20)).min(2),
  securityNotes: z.array(z.string().min(20)).min(1),
  integrations: z.array(z.string().min(10)).min(1),
  scheduleDrivers: z.array(z.string().min(10)).min(2),
  engagementNote: z.string().min(60),
  exampleWorkflow: illustrationSchema,
  evidence: z.array(evidenceSchema).default([]),
  faqs: z.array(faqSchema).min(4).max(6),
  related: z.array(linkSchema).min(2).max(4),
  cta: z.object({ label: z.string().min(4).max(48) }),
});
export type Service = z.infer<typeof serviceSchema>;

/** PRD section 15 — solution pages share a workflow-first structure. */
export const solutionSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  h1: z.string().min(5).max(80),
  lead: z.string().min(120).max(900),
  seo: seoSchema,
  /** Section 15: current-state pain before proposed system boundaries. */
  currentState: z.array(z.string().min(20)).min(2),
  sections: z.array(sectionSchema).min(3),
  roles: z
    .array(z.object({ role: z.string().min(2), scope: z.string().min(15) }))
    .min(2),
  modules: z.array(z.string().min(5)).min(3),
  integrations: z.array(z.string().min(10)).min(1),
  dataAndSecurity: z.array(z.string().min(20)).min(1),
  rollout: z.array(z.string().min(15)).min(2),
  sampleFlow: illustrationSchema,
  faqs: z.array(faqSchema).min(2).max(6),
  related: z.array(linkSchema).min(2).max(4),
  cta: z.object({ label: z.string().min(4).max(48) }),
});
export type Solution = z.infer<typeof solutionSchema>;

/** A corporate page: company, how-we-work, engagement-models, support, security. */
export const corporatePageSchema = z.object({
  slug: z.string().min(1),
  path: internalPathSchema,
  h1: z.string().min(5).max(90),
  lead: z.string().min(80).max(900),
  seo: seoSchema,
  sections: z.array(sectionSchema).min(2),
  faqs: z.array(faqSchema).max(6).default([]),
  related: z.array(linkSchema).max(6).default([]),
  cta: z.object({ label: z.string().min(4).max(48) }),
});
export type CorporatePage = z.infer<typeof corporatePageSchema>;

/**
 * Section 25 is explicit that it supplies a content specification, not legal text.
 * A policy page therefore publishes its required-inputs skeleton plus a standing
 * notice that counsel review is outstanding — never invented policy prose.
 */
export const policyPageSchema = z.object({
  slug: z.string().min(1),
  path: internalPathSchema,
  h1: z.string().min(5).max(90),
  lead: z.string().min(60).max(600),
  seo: seoSchema,
  /** The section headings section 25 requires, with the inputs each needs. */
  requiredSections: z
    .array(
      z.object({
        heading: z.string().min(3),
        id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
        inputs: z.array(z.string().min(5)).min(1),
      }),
    )
    .min(4),
  counselReviewOutstanding: z.literal(true),
  related: z.array(linkSchema).max(6).default([]),
});
export type PolicyPage = z.infer<typeof policyPageSchema>;

/** Section 18 — ships as a template over an empty collection. */
export const caseStudySchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  h1: z.string().min(5),
  seo: seoSchema,
  client: z.object({
    attribution: z.string().min(2),
    permission: z.enum(["named", "anonymized"]),
  }),
  industry: z.string().min(2),
  problem: z.string().min(40),
  approach: z.string().min(40),
  stack: z.array(z.string().min(1)).min(1),
  duration: z.string().min(2),
  outcome: z.array(evidenceSchema).min(1),
  related: z.array(linkSchema).min(1),
});
export type CaseStudy = z.infer<typeof caseStudySchema>;

/** Section 23 — ships as a template over an empty collection. */
export const jobSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  jobId: z.string().min(1),
  role: z.string().min(2),
  status: z.enum(["open", "closed"]),
  hiringOwner: z.string().min(2),
  location: z.string().min(2),
  employmentType: z.string().min(2),
  validThrough: z.iso.date(),
  mission: z.string().min(40),
  responsibilities: z.array(z.string().min(10)).min(3),
  requiredSkills: z.array(z.string().min(5)).min(3),
  helpfulExperience: z.array(z.string().min(5)).default([]),
  hiringStages: z.array(z.string().min(5)).min(2),
  accessibilityAdjustments: z.string().min(20),
  seo: seoSchema,
});
export type Job = z.infer<typeof jobSchema>;

/**
 * A technology the company claims to work with. Section 17 requires status,
 * capability owner, evidence reference and last review date on every record.
 * Unverified entries are withheld from render, not published with a caveat.
 */
export const technologySchema = z.object({
  name: z.string().min(1),
  layer: z.enum(["frontend", "backend", "mobile", "data", "cloud", "ai", "devops"]),
  status: z.enum(["verified", "currently-offered", "retired", "unverified"]),
  capabilityOwner: z.string().nullable(),
  evidenceReference: z.string().nullable(),
  lastReviewedAt: z.iso.date().nullable(),
});
export type Technology = z.infer<typeof technologySchema>;

/** A technology renders only when its record carries real verification. */
export function isPublishableTechnology(record: Technology): boolean {
  return (
    (record.status === "verified" || record.status === "currently-offered") &&
    record.capabilityOwner !== null &&
    record.evidenceReference !== null &&
    record.lastReviewedAt !== null
  );
}
