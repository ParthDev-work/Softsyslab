import { serviceRecords } from "@/content/services";
import { solutionRecords } from "@/content/solutions";
import { caseStudyRecords } from "@/content/case-studies";
import { jobRecords } from "@/content/jobs";

/**
 * The published-route registry.
 *
 * PRD section 12 forbids placing an unavailable destination in the menu, and
 * REQ-NAV-01 requires every visible navigation item to resolve. Navigation, the
 * footer, the sitemap and the content validator all read this one list, so a
 * route cannot appear in the menu without also being published, and a published
 * route cannot be missed by the sitemap.
 *
 * Collections that are empty (case studies, jobs) contribute no routes, which is
 * how section 18's "withheld, not a fake gallery" rule is enforced structurally.
 */

export type RouteGroup =
  | "home"
  | "services"
  | "solutions"
  | "technologies"
  | "company"
  | "contact"
  | "careers"
  | "trust"
  | "legal";

export type PublishedRoute = {
  path: string;
  /** Short label used in navigation and breadcrumbs. */
  label: string;
  group: RouteGroup;
  /** Relative weight for sitemap ordering within a group. */
  order: number;
};

const staticRoutes: PublishedRoute[] = [
  { path: "/", label: "Home", group: "home", order: 0 },

  { path: "/services/", label: "Services", group: "services", order: 0 },
  { path: "/solutions/", label: "Solutions", group: "solutions", order: 0 },
  {
    path: "/technologies/",
    label: "Technologies",
    group: "technologies",
    order: 0,
  },

  { path: "/how-we-work/", label: "How We Work", group: "company", order: 1 },
  {
    path: "/engagement-models/",
    label: "Engagement Models",
    group: "company",
    order: 2,
  },
  { path: "/support/", label: "Support", group: "company", order: 3 },
  { path: "/company/", label: "Company", group: "company", order: 0 },
  {
    path: "/company/business-information/",
    label: "Business Information",
    group: "company",
    order: 4,
  },

  { path: "/contact/", label: "Contact", group: "contact", order: 0 },
  { path: "/careers/", label: "Careers", group: "careers", order: 0 },
  { path: "/security/", label: "Security", group: "trust", order: 0 },

  { path: "/privacy/", label: "Privacy Policy", group: "legal", order: 0 },
  { path: "/terms/", label: "Website Terms", group: "legal", order: 1 },
  { path: "/cookies/", label: "Cookie Policy", group: "legal", order: 2 },
  {
    path: "/accessibility/",
    label: "Accessibility Statement",
    group: "legal",
    order: 3,
  },
];

const serviceRoutes: PublishedRoute[] = serviceRecords.map((service, index) => ({
  path: `/services/${service.slug}/`,
  label: service.h1,
  group: "services" as const,
  order: index + 1,
}));

const solutionRoutes: PublishedRoute[] = solutionRecords.map((solution, index) => ({
  path: `/solutions/${solution.slug}/`,
  label: solution.h1,
  group: "solutions" as const,
  order: index + 1,
}));

/**
 * Section 18: the listing is withheld while no approved work exists, so these
 * routes materialise only once the collection is non-empty. The templates ship
 * either way — see app/(marketing)/case-studies.
 */
const caseStudyRoutes: PublishedRoute[] =
  caseStudyRecords.length === 0
    ? []
    : [
        {
          path: "/case-studies/",
          label: "Case Studies",
          group: "services" as const,
          order: 90,
        },
        ...caseStudyRecords.map((record, index) => ({
          path: `/case-studies/${record.slug}/`,
          label: record.h1,
          group: "services" as const,
          order: 91 + index,
        })),
      ];

/** Section 23: an open role gets a route; a closed or absent one does not. */
const jobRoutes: PublishedRoute[] = jobRecords
  .filter((job) => job.status === "open")
  .map((job, index) => ({
    path: `/careers/${job.slug}/`,
    label: job.role,
    group: "careers" as const,
    order: index + 1,
  }));

export const publishedRoutes: PublishedRoute[] = [
  ...staticRoutes,
  ...serviceRoutes,
  ...solutionRoutes,
  ...caseStudyRoutes,
  ...jobRoutes,
];

const publishedPaths = new Set(publishedRoutes.map((route) => route.path));

export function isPublishedRoute(path: string): boolean {
  return publishedPaths.has(path);
}

export function routesInGroup(group: RouteGroup): PublishedRoute[] {
  return publishedRoutes
    .filter((route) => route.group === group)
    .sort((a, b) => a.order - b.order);
}

export function labelForRoute(path: string): string | null {
  return publishedRoutes.find((route) => route.path === path)?.label ?? null;
}

/**
 * Section 11 redirects. Kept beside the registry so a renamed route and its
 * redirect stay in one place, and so the validator can check targets resolve.
 */
export const permanentRedirects: Array<{ source: string; destination: string }> = [
  { source: "/company/about", destination: "/company/" },
  { source: "/company/careers", destination: "/careers/" },
];
