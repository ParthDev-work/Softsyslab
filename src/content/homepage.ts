import type { Faq } from "@/lib/content/schemas";

/**
 * Homepage content — PRD section 13's nineteen modules.
 *
 * Section 13: "Modules with no verified content are omitted entirely; do not
 * publish bracketed placeholders." Three modules are therefore absent from this
 * file and from the page, rather than present and hidden:
 *
 *   Module 8  Featured projects — no approved client work exists.
 *   Module 15 Testimonials      — no quotation carries publication permission.
 *   Module 16 Insights          — section 22 gates this on three approved
 *                                 articles; none are published.
 *
 * Module 9 publishes its explanatory copy but no technology chips, because no
 * capability record has passed the section 17 review gate. The copy claims no
 * capability, so it stands on its own.
 *
 * Module 10's call to action points at Solutions rather than at Industries:
 * section 11 marks every industry page P1 pending sector review, and section 12
 * forbids routing to a destination that does not exist.
 */

export const homepageSeo = {
  title: "Custom Software Development and Product Engineering",
  description:
    "Explore custom software, web, mobile and SaaS development, delivery methods and engagement options. Discuss the scope of your next product.",
} as const;

/** Module 1. Optional, and carries only the process line — never a fake notice. */
export const announcement = {
  text: "Explore how a software project moves from discovery to support.",
  linkLabel: "Our process",
  href: "/how-we-work/",
} as const;

/** Module 3. */
export const hero = {
  h1: "Software built around your business.",
  body: "Turn a product idea or a difficult workflow into a clear development plan. Design, build and maintain web, mobile, SaaS and AI-enabled software around your users, systems and commercial priorities.",
  supportingLine:
    "Define the scope, delivery responsibilities and next steps before development begins.",
  primaryCta: { label: "Discuss Your Project", href: "/contact/" },
  /* Section 13: "View Our Work" replaces this only once approved work exists.
     AC01 requires Process here while the case-study collection is empty. */
  secondaryCta: { label: "Explore Our Process", href: "/how-we-work/" },
} as const;

/** Module 4. Outline icons plus text — never an unlabelled logo. */
export const capabilitySummary = {
  heading: "From product decisions to production software.",
  intro: "Choose a starting point based on the problem you need to solve.",
  items: [
    { label: "Web Applications", href: "/services/web-development/" },
    { label: "Mobile Products", href: "/services/mobile-app-development/" },
    { label: "SaaS Platforms", href: "/services/saas-development/" },
    {
      label: "AI and Automation",
      href: "/services/api-development-integration/",
    },
    { label: "Cloud and DevOps", href: "/technologies/" },
    { label: "Product Design", href: "/services/ui-ux-design/" },
  ],
} as const;

/** Module 5. */
export const valueProposition = {
  heading: "Make the important decisions before they become expensive changes.",
  body: "Clarify who will use the software, which workflows matter first, and how the system will connect to the tools you already use. A documented plan makes scope, trade-offs and acceptance criteria easier to discuss.",
  panels: [
    {
      title: "Scope",
      body: "What the first release covers, and what is explicitly deferred so the exclusion is a decision rather than an omission.",
    },
    {
      title: "Architecture",
      body: "Which system owns which record, where the boundaries sit, and what happens when a dependency is unavailable.",
    },
    {
      title: "Delivery",
      body: "What each stage produces, who accepts it and what evidence the acceptance rests on.",
    },
  ],
  cta: { label: "Plan Product Discovery", href: "/services/mvp-development/" },
} as const;

/** Module 6. Five cards, each with one primary link and no nested controls. */
export const serviceGroupCards = [
  {
    title: "Strategy and design",
    body: "Translate user needs into a prioritised product plan.",
    href: "/services/ui-ux-design/",
  },
  {
    title: "Application engineering",
    body: "Build the interfaces, services and data model.",
    href: "/services/custom-software-development/",
  },
  {
    title: "AI and integration",
    body: "Connect systems and introduce evaluated automation.",
    href: "/services/api-development-integration/",
  },
  {
    title: "Cloud and modernization",
    body: "Plan releases, infrastructure and system change.",
    href: "/technologies/",
  },
  {
    title: "Quality and support",
    body: "Test, maintain and extend the software.",
    href: "/services/qa-testing/",
  },
] as const;

/** Module 7. Nine stages, each with one concrete artifact. */
export const deliveryMethod = {
  heading: "A clear path from discovery to release.",
  intro:
    "Each stage should produce something you can review, from the initial brief to tested software and operating documentation.",
  stages: [
    { name: "Discovery", artifact: "Workflow map and stakeholder list" },
    { name: "Planning", artifact: "Prioritised backlog with stated exclusions" },
    { name: "UX and UI", artifact: "Tested prototype and component specification" },
    { name: "Architecture", artifact: "Decision record naming system boundaries" },
    { name: "Development", artifact: "Reviewed code in a repository you own" },
    { name: "Testing", artifact: "Test evidence against acceptance criteria" },
    { name: "Deployment", artifact: "Release plan with a rehearsed rollback" },
    { name: "Monitoring", artifact: "Alerts with a named owner and escalation" },
    { name: "Improvement", artifact: "Change requests with cost and approval" },
  ],
  cta: { label: "See How We Work", href: "/how-we-work/" },
} as const;

/** Module 9. Copy publishes; the chip groups await the section 17 review gate. */
export const technologyChoices = {
  heading: "Choose technology for the job.",
  body: "The right stack depends on the product, your existing systems, the team maintaining it and the cost of operating it. Review the options and trade-offs before committing.",
  /* Rendered in place of the chip groups while no capability record is verified.
     Naming the absence is more useful than a logo wall nobody can rely on. */
  withheldNote:
    "No technology capability list is published yet. Each entry needs a named internal owner, an evidence reference and a review date before it appears here.",
  cta: { label: "Explore Our Technology Approach", href: "/technologies/" },
} as const;

/** Module 10. Workflow examples, not claims of sector experience. */
export const workflowExamples = {
  heading: "Software shaped by the workflow.",
  intro:
    "These are common workflow shapes rather than a claim of sector experience. No industry pages are published, because sector content has not been reviewed.",
  cards: [
    {
      title: "SaaS",
      body: "Onboarding, permissions and subscription operations.",
    },
    {
      title: "Professional services",
      body: "Client intake, approvals and reporting.",
    },
    {
      title: "E-commerce",
      body: "Product, inventory and order workflows.",
    },
  ],
  cta: { label: "Explore Solutions", href: "/solutions/" },
} as const;

/** Module 11. No invented price ranges anywhere. */
export const engagementCards = {
  heading: "A commercial model that fits the work.",
  body: "A defined scope, an evolving backlog and an ongoing support need require different agreements. Compare how scope, billing and changes are handled.",
  models: [
    "Fixed Scope",
    "Time and Materials",
    "Dedicated Team",
    "Staff Augmentation",
    "Discovery Sprint",
    "Maintenance",
  ],
  cta: { label: "Compare Engagement Models", href: "/engagement-models/" },
} as const;

/**
 * Module 12. Section 13 marks these "proposed commitments requiring owner
 * signoff", so they are framed as what an agreement should set out rather than
 * as promises this business has adopted. The specific commitments for an
 * engagement live in its agreement.
 */
export const deliveryPrinciples = {
  heading: "Know what you are reviewing and receiving.",
  intro:
    "These describe what a software agreement should make explicit — ours or anyone's. The specific commitments for a given engagement are stated in its own agreement rather than as a general claim here.",
  rows: [
    {
      title: "A written scope",
      body: "Agree what is included, and what has been deliberately left out.",
    },
    {
      title: "Visible progress",
      body: "Review completed work against the backlog rather than against a status report.",
    },
    {
      title: "A tested release",
      body: "Examine the acceptance evidence behind a release decision.",
    },
    {
      title: "A planned handover",
      body: "Identify the repositories, accounts and operating documentation that transfer to you.",
    },
  ],
  cta: { label: "Explore Delivery Responsibilities", href: "/engagement-models/" },
} as const;

/** Module 13. Verified practices only — so this module states the approach. */
export const securityAndQuality = {
  heading: "Make security part of the engineering plan.",
  body: "Discuss access, data handling, dependencies, backups and monitoring alongside features. The controls and evidence required for your project should be defined in its scope.",
  boundary: {
    caption: "Where the responsibility boundary usually sits in a delivery agreement.",
    label: "Illustrative — not delivered client work" as const,
    columns: [
      {
        title: "Agreed in project scope",
        items: [
          "Access model and role permissions",
          "Data handling and retention",
          "Dependency and update policy",
          "Backup coverage and restore testing",
          "Monitoring and alert ownership",
        ],
      },
      {
        title: "Owned by the client",
        items: [
          "Domain, hosting and vendor accounts",
          "Approval of access for each system",
          "Decisions on data classification",
          "Incident declaration authority",
        ],
      },
    ],
  },
  cta: { label: "Read Our Security Approach", href: "/security/" },
} as const;

/** Module 14. Buying and onboarding, distinct from the engineering method. */
export const clientJourney = {
  heading: "What happens after you get in touch.",
  note: "Sending an enquiry creates no development contract. Nothing is committed until an agreement is signed.",
  groups: [
    {
      title: "Enquiry and discovery call",
      steps: ["You send a short summary", "We review fit and reply"],
    },
    {
      title: "Requirements and proposal",
      steps: [
        "We clarify scope and constraints",
        "You receive a written proposal",
      ],
    },
    {
      title: "Agreement and kickoff",
      steps: [
        "Terms, ownership and acceptance are agreed",
        "Owners are named and the plan is set",
      ],
    },
    {
      title: "Development, QA, launch and support",
      steps: [
        "Work proceeds against the agreed backlog",
        "Release follows tested acceptance evidence",
        "Support continues under the signed agreement",
      ],
    },
  ],
  cta: { label: "Submit a Project Inquiry", href: "/contact/" },
} as const;

/** Module 17. All eight answers are present in the rendered HTML. */
export const homepageFaqs: Faq[] = [
  {
    question: "Where should a project start?",
    answer:
      "Start with the users, workflows and constraints. Discovery can turn these into a scoped backlog. Starting from a feature list instead tends to produce a system that does what was asked for and not what was needed.",
  },
  {
    question: "Can an existing product be improved?",
    answer:
      "Begin with access, architecture and dependency review before deciding what to replace. A great deal of software that feels beyond repair turns out to need a bounded intervention rather than a rewrite, and the assessment is far cheaper than finding out the other way.",
  },
  {
    question: "How is cost estimated?",
    answer:
      "Scope, integrations, delivery capacity and risk inform the proposal. An estimate made before the integrations have been assessed is a guess, which is why discovery usually precedes a figure anyone should rely on.",
  },
  {
    question: "Who owns the software?",
    answer:
      "Ownership, pre-existing components and third-party licences must be set out in the signed agreement. These are three different things with different terms, and assuming all of them transfer is a common and expensive misunderstanding.",
  },
  {
    question: "How are changes handled?",
    answer:
      "Record the request, assess the effect on time and cost, and approve the change before work proceeds. Changes are expected; the procedure exists so the cost of one is visible before it is incurred rather than afterwards.",
  },
  {
    question: "Can you sign an NDA?",
    answer:
      "Raise confidentiality requirements before sharing restricted materials. Availability and wording have to be agreed, so it is better handled before the first detailed conversation than during it.",
  },
  {
    question: "What happens after launch?",
    answer:
      "The agreement defines handover, any defect period and ongoing maintenance separately. Handover should transfer the repositories, accounts and operating documentation, and should be checked rather than assumed.",
  },
  {
    question: "How do we start?",
    answer:
      "Send a short project summary and your preferred contact method. A few paragraphs covering the problem, who would use the result and any fixed constraint is enough to begin.",
  },
];

/** Module 18. */
export const finalCta = {
  heading: "Tell us what you're building.",
  body: "Share the problem, the stage of your project and any important constraints. Start with a short summary; confidential files can wait until an appropriate sharing arrangement is in place.",
  cta: { label: "Discuss Your Project", href: "/contact/" },
} as const;
