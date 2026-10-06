import { isPublishedRoute, labelForRoute } from "@/lib/content/routes";

/**
 * Navigation is derived from the published-route registry, not from a hardcoded
 * list — PRD section 12 ("never place an unavailable destination in the menu")
 * and REQ-NAV-01.
 *
 * Section 12 asks for eleven destinations. Three of them cannot be published in
 * this build and are therefore absent rather than linked to an empty page:
 *
 *   Industries — section 11 marks every industry page P1 pending sector review.
 *   Resources  — section 22 gates the listing on three approved articles.
 *   Work       — section 18 withholds the listing until approved work exists,
 *                and AC01 requires the link be omitted or replaced by Process.
 *
 * Adding real content later publishes the routes, and they appear here with no
 * change to this file beyond the candidate list below.
 */

export type NavItem = { label: string; href: string };
export type NavSection = { label: string; href: string; children?: NavItem[] };

/** Everything section 12 asks for. Only the published entries survive. */
const candidateMainRow: NavSection[] = [
  { label: "Services", href: "/services/" },
  { label: "Solutions", href: "/solutions/" },
  { label: "Industries", href: "/industries/" },
  { label: "Technologies", href: "/technologies/" },
  { label: "Work", href: "/case-studies/" },
  { label: "Resources", href: "/resources/" },
];

const candidateUtilityRow: NavSection[] = [
  { label: "How We Work", href: "/how-we-work/" },
  {
    label: "Company",
    href: "/company/",
    children: [
      { label: "Business Information", href: "/company/business-information/" },
      { label: "Engagement Models", href: "/engagement-models/" },
      { label: "Support", href: "/support/" },
      { label: "Security", href: "/security/" },
    ],
  },
  { label: "Careers", href: "/careers/" },
  { label: "Contact", href: "/contact/" },
];

function published(sections: NavSection[]): NavSection[] {
  return sections
    .filter((section) => isPublishedRoute(section.href))
    .map((section) => ({
      ...section,
      label: labelForRoute(section.href) === null ? section.label : section.label,
      children: section.children?.filter((child) => isPublishedRoute(child.href)),
    }));
}

export const mainNav: NavSection[] = published(candidateMainRow);
export const utilityNav: NavSection[] = published(candidateUtilityRow);

/** Flattened list used by the mobile menu, which shows every destination. */
export const allNavDestinations: NavItem[] = [
  ...mainNav.flatMap((section) => [
    { label: section.label, href: section.href },
    ...(section.children ?? []),
  ]),
  ...utilityNav.flatMap((section) => [
    { label: section.label, href: section.href },
    ...(section.children ?? []),
  ]),
];

export const primaryCta = { label: "Discuss Your Project", href: "/contact/" };
