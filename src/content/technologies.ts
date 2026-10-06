import {
  isPublishableTechnology,
  technologySchema,
  type Technology,
} from "@/lib/content/schemas";

/**
 * Technology capability register — PRD section 17.
 *
 * Section 17 requires every technology record to carry a status, an internal
 * capability owner, an evidence reference and a last review date. Section 13
 * module 9 says to group "verified items"; section 26 says an unverified claim
 * is withheld rather than published with a caveat.
 *
 * Every record below is therefore `unverified` with null owner, evidence and
 * review date. None of them render. They are listed here as the register of what
 * an accountable reviewer still has to confirm — the same list that appears in
 * LAUNCH-BLOCKERS.md — so that verifying one is a data edit rather than a code
 * change. The technologies hub and homepage module 9 publish their standalone
 * explanatory copy either way, since that copy claims no capability.
 *
 * Names here are drawn from section 17's "examples to verify" column. Their
 * presence is not a claim that the company works with them. Vendor trademarks
 * are descriptive and imply no partnership.
 */

const records: Technology[] = [
  { name: "React", layer: "frontend", status: "unverified", capabilityOwner: null, evidenceReference: null, lastReviewedAt: null },
  { name: "Next.js", layer: "frontend", status: "unverified", capabilityOwner: null, evidenceReference: null, lastReviewedAt: null },
  { name: "TypeScript", layer: "frontend", status: "unverified", capabilityOwner: null, evidenceReference: null, lastReviewedAt: null },

  { name: "Node.js", layer: "backend", status: "unverified", capabilityOwner: null, evidenceReference: null, lastReviewedAt: null },
  { name: "Python", layer: "backend", status: "unverified", capabilityOwner: null, evidenceReference: null, lastReviewedAt: null },
  { name: "Java", layer: "backend", status: "unverified", capabilityOwner: null, evidenceReference: null, lastReviewedAt: null },
  { name: ".NET", layer: "backend", status: "unverified", capabilityOwner: null, evidenceReference: null, lastReviewedAt: null },
  { name: "PHP / Laravel", layer: "backend", status: "unverified", capabilityOwner: null, evidenceReference: null, lastReviewedAt: null },

  { name: "Flutter", layer: "mobile", status: "unverified", capabilityOwner: null, evidenceReference: null, lastReviewedAt: null },
  { name: "React Native", layer: "mobile", status: "unverified", capabilityOwner: null, evidenceReference: null, lastReviewedAt: null },

  { name: "PostgreSQL", layer: "data", status: "unverified", capabilityOwner: null, evidenceReference: null, lastReviewedAt: null },
  { name: "MySQL", layer: "data", status: "unverified", capabilityOwner: null, evidenceReference: null, lastReviewedAt: null },
  { name: "MongoDB", layer: "data", status: "unverified", capabilityOwner: null, evidenceReference: null, lastReviewedAt: null },
  { name: "Redis", layer: "data", status: "unverified", capabilityOwner: null, evidenceReference: null, lastReviewedAt: null },

  { name: "AWS", layer: "cloud", status: "unverified", capabilityOwner: null, evidenceReference: null, lastReviewedAt: null },
  { name: "Azure", layer: "cloud", status: "unverified", capabilityOwner: null, evidenceReference: null, lastReviewedAt: null },
  { name: "Google Cloud", layer: "cloud", status: "unverified", capabilityOwner: null, evidenceReference: null, lastReviewedAt: null },

  { name: "Docker", layer: "devops", status: "unverified", capabilityOwner: null, evidenceReference: null, lastReviewedAt: null },
  { name: "Kubernetes", layer: "devops", status: "unverified", capabilityOwner: null, evidenceReference: null, lastReviewedAt: null },

  { name: "Retrieval and evaluation tooling", layer: "ai", status: "unverified", capabilityOwner: null, evidenceReference: null, lastReviewedAt: null },
];

export const technologyRecords: Technology[] = records.map((record) =>
  technologySchema.parse(record),
);

/** The only list any component may render. Empty until records are verified. */
export const publishableTechnologies: Technology[] =
  technologyRecords.filter(isPublishableTechnology);

export const technologyLayers = [
  { id: "frontend", title: "Frontend" },
  { id: "backend", title: "Backend" },
  { id: "mobile", title: "Mobile" },
  { id: "data", title: "Data" },
  { id: "cloud", title: "Cloud" },
  { id: "ai", title: "AI" },
  { id: "devops", title: "DevOps" },
] as const;

/** How many records are still waiting on an accountable reviewer. */
export const unverifiedTechnologyCount: number =
  technologyRecords.length - publishableTechnologies.length;
