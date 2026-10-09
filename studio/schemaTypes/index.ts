import { seo } from "./objects/seo";
import { faq } from "./objects/faq";
import { link } from "./objects/link";
import { section } from "./objects/section";
import { evidence } from "./objects/evidence";
import { illustration } from "./objects/illustration";
import { service } from "./documents/service";
import { solution } from "./documents/solution";
import { corporatePage } from "./documents/corporatePage";
import { policyPage } from "./documents/policyPage";
import { caseStudy } from "./documents/caseStudy";
import { job } from "./documents/job";

export const schemaTypes = [
  // Shared objects first — the documents below reference these by name.
  seo,
  faq,
  link,
  section,
  evidence,
  illustration,
  // Documents — one per src/lib/content ContentSource method pair.
  service,
  solution,
  corporatePage,
  policyPage,
  caseStudy,
  job,
];
