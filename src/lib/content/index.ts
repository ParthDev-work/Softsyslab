import { serviceRecords } from "@/content/services";
import { solutionRecords } from "@/content/solutions";
import { caseStudyRecords } from "@/content/case-studies";
import { jobRecords } from "@/content/jobs";
import { corporatePages } from "@/content/pages";
import { policyPages } from "@/content/legal";
import { isCmsConfigured } from "@/lib/content/sanityClient";
import { sanityContentSource } from "@/lib/content/sanitySource";
import type {
  CaseStudy,
  CorporatePage,
  Job,
  PolicyPage,
  Service,
  Solution,
} from "@/lib/content/schemas";

/**
 * The CMS seam — PRD section 34.
 *
 * Every page reads content through this interface and never imports from
 * content/ directly, so replacing the typed local modules with a managed
 * headless CMS means implementing ContentSource once. Page components do not
 * change, which is section 34's "do not maintain two editable copies of the
 * same content" honoured structurally rather than by convention.
 *
 * The local implementation is synchronous, but the interface is async so that a
 * network-backed source can be substituted without touching call sites.
 */
export interface ContentSource {
  listServices(): Promise<Service[]>;
  getService(slug: string): Promise<Service | null>;

  listSolutions(): Promise<Solution[]>;
  getSolution(slug: string): Promise<Solution | null>;

  getCorporatePage(slug: string): Promise<CorporatePage | null>;
  getPolicyPage(slug: string): Promise<PolicyPage | null>;

  /** Empty while no work is approved. Section 18 withholds rather than fakes. */
  listCaseStudies(): Promise<CaseStudy[]>;
  getCaseStudy(slug: string): Promise<CaseStudy | null>;

  /** Open roles only. A closed role publishes no route and no JobPosting markup. */
  listOpenJobs(): Promise<Job[]>;
  getJob(slug: string): Promise<Job | null>;
}

const localContentSource: ContentSource = {
  async listServices() {
    return serviceRecords;
  },
  async getService(slug) {
    return serviceRecords.find((record) => record.slug === slug) ?? null;
  },

  async listSolutions() {
    return solutionRecords;
  },
  async getSolution(slug) {
    return solutionRecords.find((record) => record.slug === slug) ?? null;
  },

  async getCorporatePage(slug) {
    return corporatePages.find((record) => record.slug === slug) ?? null;
  },
  async getPolicyPage(slug) {
    return policyPages.find((record) => record.slug === slug) ?? null;
  },

  async listCaseStudies() {
    return caseStudyRecords;
  },
  async getCaseStudy(slug) {
    return caseStudyRecords.find((record) => record.slug === slug) ?? null;
  },

  async listOpenJobs() {
    return jobRecords.filter((job) => job.status === "open");
  },
  async getJob(slug) {
    return jobRecords.find((job) => job.slug === slug) ?? null;
  },
};

/**
 * `CMS_PROJECT_ID`/`CMS_DATASET`/`CMS_READ_TOKEN` being set switches every
 * page to the Sanity-backed source, exactly as DATABASE_URL switches
 * leadStore.ts from the JSONL fallback to Postgres. No other flag — set all
 * three (see studio/ and .env.example) and the swap is automatic.
 */
function selectContentSource(): ContentSource {
  return isCmsConfigured() ? sanityContentSource : localContentSource;
}

export const content: ContentSource = selectContentSource();

export type {
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
  Technology,
} from "@/lib/content/schemas";
