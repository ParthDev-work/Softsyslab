import { caseStudySchema, type CaseStudy } from "@/lib/content/schemas";

/**
 * Case studies — PRD section 18.
 *
 * Deliberately empty. Section 18: "No approved work means the public listing and
 * inbound links are withheld, not a fake project gallery." The listing and detail
 * templates ship as code, the route registry contributes no case-study paths while
 * this array is empty, and the routes call notFound().
 *
 * To publish: add a record whose outcome entries each carry a real evidence
 * reference with an owner, a verification date and a permission status. The schema
 * and the content validator both reject anything less.
 */
const records: CaseStudy[] = [];

export const caseStudyRecords: CaseStudy[] = records.map((record) =>
  caseStudySchema.parse(record),
);
