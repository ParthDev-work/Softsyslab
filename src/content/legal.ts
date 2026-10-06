import { policyPageSchema, type PolicyPage } from "@/lib/content/schemas";

/**
 * Policy pages — PRD section 25.
 *
 * Section 25 is explicit: "The following is a content specification, not a
 * ready-to-publish legal opinion. Appoint qualified counsel for applicable
 * jurisdictions before publication. Avoid importing unrelated policy text from
 * competitors."
 *
 * These records therefore publish the required section headings and the inputs
 * each needs, together with a standing notice that counsel review is outstanding.
 * They do not contain policy prose. A plausible-looking privacy policy that no
 * lawyer has read, describing processing that does not match what the site
 * actually does, is worse than an honest statement that it is not ready — and it
 * is the kind of text a regulator reads literally.
 *
 * Section 45 also requires that policy text be readable without accepting
 * optional cookies, which these pages satisfy by loading no optional scripts.
 */

const pages: PolicyPage[] = [
  {
    slug: "privacy",
    path: "/privacy/",
    h1: "Privacy Policy",
    lead: "This notice will explain how the company operating this website handles personal information collected through the website and through project enquiries. It has not yet been reviewed by counsel and is not in force.",
    seo: {
      title: "Privacy Policy",
      description:
        "How personal information collected through this website and through project enquiries is handled. Pending counsel review.",
    },
    requiredSections: [
      {
        heading: "Controller identity",
        id: "controller-identity",
        inputs: [
          "Legal name of the controlling entity",
          "Registered address and jurisdiction",
          "Contact point for privacy questions, and a representative where one is required",
        ],
      },
      {
        heading: "Data categories and sources",
        id: "data-categories",
        inputs: [
          "Fields collected by the enquiry form",
          "Technical data recorded by the hosting platform, including address and request metadata",
          "Consent records and their version",
        ],
      },
      {
        heading: "Purposes and legal bases",
        id: "purposes-and-bases",
        inputs: [
          "Purpose for each category of data collected",
          "The lawful basis relied on for each purpose, determined by counsel rather than labelled as consent by default",
        ],
      },
      {
        heading: "Recipients and processors",
        id: "recipients",
        inputs: [
          "Hosting provider and its processing region",
          "Any future email, CRM or analytics processor, with its data processing agreement status",
        ],
      },
      {
        heading: "International transfers",
        id: "transfers",
        inputs: [
          "Processing regions of each vendor",
          "Transfer mechanism relied on where data leaves the controller's jurisdiction",
        ],
      },
      {
        heading: "Retention",
        id: "retention",
        inputs: [
          "Retention period for enquiry records and the basis for it",
          "Retention period for consent receipts",
          "The deletion process and who is accountable for running it",
        ],
      },
      {
        heading: "Your rights",
        id: "rights",
        inputs: [
          "The rights available in each applicable jurisdiction",
          "How a request is made and how identity is verified",
          "Response timeframe and the complaint route to a supervisory authority",
        ],
      },
      {
        heading: "Contact, version and effective date",
        id: "contact-and-version",
        inputs: [
          "Monitored contact address for privacy requests",
          "Notice version recorded against each submission",
          "Effective date and the change history",
        ],
      },
    ],
    counselReviewOutstanding: true,
    related: [
      { label: "Cookie Policy", href: "/cookies/" },
      { label: "Business Information", href: "/company/business-information/" },
      { label: "Contact", href: "/contact/" },
    ],
  },

  {
    slug: "terms",
    path: "/terms/",
    h1: "Website Terms",
    lead: "These terms will describe the conditions for using this website. Software project services are governed by a separate signed agreement. The terms have not yet been reviewed by counsel and are not in force.",
    seo: {
      title: "Website Terms",
      description:
        "Conditions for using this website, separate from the signed agreement governing project services. Pending counsel review.",
    },
    requiredSections: [
      {
        heading: "Operator",
        id: "operator",
        inputs: [
          "Legal name and registered address of the website operator",
          "Jurisdiction and registration number where applicable",
        ],
      },
      {
        heading: "Permitted use",
        id: "permitted-use",
        inputs: [
          "What visitors may and may not do with the site",
          "Any restriction on automated access or bulk collection",
        ],
      },
      {
        heading: "Website intellectual property",
        id: "intellectual-property",
        inputs: [
          "Ownership of the site's content and design",
          "Treatment of third-party trademarks used descriptively",
        ],
      },
      {
        heading: "Third-party links",
        id: "third-party-links",
        inputs: ["Position on linked sites and their content"],
      },
      {
        heading: "Disclaimers and liability",
        id: "disclaimers",
        inputs: [
          "Scope of any disclaimer, drafted subject to applicable law",
          "Liability position approved by counsel for each market served",
        ],
      },
      {
        heading: "Dispute route and applicable law",
        id: "disputes",
        inputs: [
          "Governing law and jurisdiction, approved by counsel",
          "Dispute resolution route before proceedings",
        ],
      },
    ],
    counselReviewOutstanding: true,
    related: [
      { label: "Engagement Models", href: "/engagement-models/" },
      { label: "Privacy Policy", href: "/privacy/" },
      { label: "Business Information", href: "/company/business-information/" },
    ],
  },

  {
    slug: "cookies",
    path: "/cookies/",
    h1: "Cookie Policy",
    lead: "This page will explain the storage and tracking technologies used on this website and how to change your preferences. The inventory below reflects what this build actually stores today; the policy wording has not yet been reviewed by counsel.",
    seo: {
      title: "Cookie Policy",
      description:
        "Storage and tracking technologies used on this website and how to change your preferences. Pending counsel review.",
    },
    requiredSections: [
      {
        heading: "Current inventory",
        id: "inventory",
        inputs: [
          "One strictly necessary first-party cookie recording the consent choice and its version",
          "No analytics, advertising or third-party cookie is set by this build",
          "No tag manager, pixel or third-party script is loaded, before or after a consent choice",
        ],
      },
      {
        heading: "Categories and purposes",
        id: "categories",
        inputs: [
          "Definition of each category used by the preference control",
          "Purpose, provider and duration per entry once any optional technology is introduced",
        ],
      },
      {
        heading: "First and third party",
        id: "parties",
        inputs: [
          "Which entries are set by this site and which by a third party",
          "Processing region of each third party, where any exists",
        ],
      },
      {
        heading: "Controls and withdrawal",
        id: "controls",
        inputs: [
          "How a choice is made, changed and withdrawn from the footer",
          "What happens to stored identifiers when consent is withdrawn",
        ],
      },
      {
        heading: "Version and effective date",
        id: "version",
        inputs: [
          "Policy version recorded in each consent receipt",
          "Effective date and change history",
        ],
      },
    ],
    counselReviewOutstanding: true,
    related: [
      { label: "Privacy Policy", href: "/privacy/" },
      { label: "Accessibility Statement", href: "/accessibility/" },
    ],
  },

  {
    slug: "accessibility",
    path: "/accessibility/",
    h1: "Accessibility Statement",
    lead: "We aim to make this website usable by people with different access needs and to provide a way to report barriers. This statement records the scope that has been evaluated, the target applied and the limitations currently known. It claims no conformance.",
    seo: {
      title: "Accessibility Statement",
      description:
        "Evaluated scope, accessibility target, testing performed and known limitations for this website, with a route to report a barrier.",
    },
    requiredSections: [
      {
        heading: "Target applied",
        id: "target",
        inputs: [
          "WCAG 2.2 Level AA is the target applied during development",
          "Primary interactive controls are designed to at least 44 by 44 CSS pixels, exceeding the AA minimum",
          "This is a development target, not a certification or an audited conformance claim",
        ],
      },
      {
        heading: "Scope evaluated",
        id: "scope",
        inputs: [
          "The published public pages of this website",
          "Keyboard navigation, the enquiry form and the consent control",
          "Excludes any future authenticated area, uploads and third-party embeds, none of which exist in this build",
        ],
      },
      {
        heading: "Testing performed",
        id: "testing",
        inputs: [
          "Automated scanning during development",
          "Manual keyboard traversal of navigation, forms and disclosures",
          "Screen reader combinations tested, recorded with the date of testing",
          "Verification at 320 to 1920 pixels and at 200 percent text zoom",
        ],
      },
      {
        heading: "Known limitations",
        id: "limitations",
        inputs: [
          "Any issue found and not yet resolved, with its effect and the intended remedy",
          "Date the list was last reviewed",
        ],
      },
      {
        heading: "Reporting a barrier",
        id: "reporting",
        inputs: [
          "Monitored contact route for accessibility reports",
          "What information helps — the page, the assistive technology and what happened",
          "Commitment on acknowledgement, pending an accountable owner",
        ],
      },
    ],
    counselReviewOutstanding: true,
    related: [
      { label: "Contact", href: "/contact/" },
      { label: "Cookie Policy", href: "/cookies/" },
    ],
  },
];

/** Validated at module load — an invalid record fails the build, not a review. */
export const policyPages: PolicyPage[] = pages.map((page) =>
  policyPageSchema.parse(page),
);

export function policyPage(slug: string): PolicyPage {
  const page = policyPages.find((candidate) => candidate.slug === slug);
  if (!page) {
    throw new Error(`No policy page record for slug "${slug}".`);
  }
  return page;
}
