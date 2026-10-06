import {
  corporatePageSchema,
  type CorporatePage,
  type Faq,
} from "@/lib/content/schemas";

/**
 * Corporate and hub page copy — PRD sections 17, 19, 23, 24 and 26.
 *
 * Where the PRD supplies copy that states a process, it is published. Where the
 * PRD supplies copy that states a company fact — mission adopted by the owner,
 * verified locations, a real team, an actual support window, a claimed security
 * control — it is withheld, and the page says plainly that it is withheld.
 * Section 26 requires blocking placeholder publication rather than hiding text,
 * so nothing below contains a bracketed slot waiting to be filled in.
 */

/* ------------------------------------------------------------------ hubs -- */

export const servicesHub = {
  h1: "Software development services from planning to support",
  lead: "Explore the work involved in defining, building and operating a software product. Choose a service to review scope, deliverables and typical decisions.",
  seo: {
    title: "Software Development Services",
    description:
      "Explore custom software, product design, application development, integration, testing and support services with clear delivery information.",
  },
  faqs: [
    {
      question: "How do I choose between these services?",
      answer:
        "Start from the decision you are trying to make rather than from the service name. If the scope is unclear, design and discovery work first. If the scope is clear but capacity is short, a team arrangement fits. If an application already exists and is causing trouble, start with an assessment. Most engagements combine two or three of these in sequence.",
    },
    {
      question: "Can services be combined in one engagement?",
      answer:
        "Usually, and most real projects do. What matters is that each part has its own scope and acceptance criteria rather than being folded into a single undifferentiated agreement, because that is what makes progress reviewable.",
    },
    {
      question: "What is not listed here?",
      answer:
        "This list covers the services for which scope and delivery are defined. Industry-specific pages, technology category pages and published project work are not part of this release — the pages appear once the underlying content has been reviewed and approved, rather than being published as empty destinations.",
    },
  ] satisfies Faq[],
  cta: { label: "Discuss Your Project" },
} as const;

export const solutionsHub = {
  h1: "Software solutions for the work you need to do",
  lead: "Explore common systems and workflows, then examine the services and engineering decisions needed to deliver them.",
  seo: {
    title: "Business Software Solutions",
    description:
      "Explore customer portals, internal tools, startup product development and workflow automation, with practical delivery and integration considerations.",
  },
  faqs: [
    {
      question: "How do solutions differ from services?",
      answer:
        "A solution describes a system or workflow you might need — a customer portal, an internal tool. A service describes the work involved in producing one — design, application development, testing. Most engagements start from a solution and draw on several services.",
    },
    {
      question: "How is scope selected?",
      answer:
        "By identifying the workflow that currently costs the most and scoping that one properly, rather than covering several partially. The solution pages each describe the modules, roles and integrations involved so the trade-off is visible before a proposal is written.",
    },
  ] satisfies Faq[],
  cta: { label: "Discuss Your Requirements" },
} as const;

/* ---------------------------------------------------- corporate pages ----- */

const pages: CorporatePage[] = [
  {
    slug: "technologies",
    path: "/technologies/",
    h1: "Technology chosen for the product and the team",
    lead: "Architecture decisions should reflect the workload, existing systems, security requirements and the people who will maintain the software. Compare choices in context rather than selecting a stack from a list of logos.",
    seo: {
      title: "Technology and Engineering Approach",
      description:
        "Review how software technologies are selected across frontend, backend, data, cloud, automation and integrations.",
    },
    sections: [
      {
        heading: "Selection criteria",
        id: "selection-criteria",
        body: [
          "A technology choice is a commitment to operate something for years, so the criteria that matter are rarely the ones that appear in a benchmark. The workload shapes the first constraint: a system handling a few hundred operations a day has different needs from one handling a few hundred a second, and designing for the second when you have the first buys complexity you will pay for every week.",
          "The second constraint is the team. A stack nobody present can debug at two in the morning is a liability regardless of its merits, and hiring for an unusual choice narrows the field at exactly the moment you need it to be wide. The third is the existing estate: a new component that cannot authenticate against your identity provider or deploy through your pipeline will acquire a parallel set of procedures.",
        ],
        points: [
          "Workload shape: request volume, data size, latency expectations and how each is expected to change",
          "Operating capability: who runs it, what they already know and what they are on call for",
          "Integration fit with the identity, deployment and monitoring you already have",
          "Licensing, support and the realistic cost of changing direction later",
        ],
      },
      {
        heading: "Application layers",
        id: "application-layers",
        body: [
          "Decisions are taken per layer rather than as a single stack choice, because the constraints differ. The interface layer is shaped by content, interaction and accessibility requirements. The application layer is shaped by the boundaries between responsibilities and by how the team is organised. The data layer is shaped by consistency requirements, access patterns and what recovery has to look like.",
          "Treating these as separate decisions avoids the common failure where a preference about one layer silently determines the others.",
        ],
      },
      {
        heading: "Operations",
        id: "operations",
        body: [
          "Deployment, observability, recovery and cost management are part of the architecture rather than work that follows it. Prefer simpler managed components over self-operated ones unless there is a specific reason to take on the operational burden, because the cost of running infrastructure is paid continuously and usually by people who did not choose it.",
          "A design is not finished until someone can say how it is deployed, how a failure is noticed, how it is restored and what it costs to run.",
        ],
      },
      {
        heading: "Integration boundaries",
        id: "integration-boundaries",
        body: [
          "Each external service is an explicit dependency with a quota, a failure mode, a credential owner and a contract. Writing those down before adoption turns an outage from a surprise into a known scenario, and makes the question of whether to add another dependency a decision rather than a default.",
        ],
      },
      {
        heading: "Capability records",
        id: "capability-records",
        body: [
          "Specific technology capabilities are published only once an internal capability owner has confirmed them against an evidence reference and a review date. No capability records have completed that review, so no technology list appears on this site yet. A list of names is easy to produce and tells a prospective client nothing they can rely on, which is why the review gate exists rather than being worked around.",
        ],
      },
    ],
    faqs: [
      {
        question: "Will it work with the stack we already have?",
        answer:
          "That is an assessment rather than an assumption. What matters is what your systems expose, how they authenticate, what their rate limits allow and who owns them. Some integrations turn out to be routine and some constrain the design substantially, and knowing which before the proposal is written is worth the assessment.",
      },
      {
        question: "How is a vendor chosen?",
        answer:
          "Against the workload, the data region requirements, the operational burden and the realistic cost of moving away later. Vendor trademarks used on this site are descriptive and imply no partnership or reseller relationship.",
      },
      {
        question: "What about long-term maintenance?",
        answer:
          "It is part of the selection. A component that requires frequent intervention, or that depends on a skill the maintaining team does not have, costs more over the life of the system than a less capable option that runs quietly. That cost belongs in the comparison rather than appearing afterwards.",
      },
    ],
    related: [
      {
        label: "API Development and Integration",
        href: "/services/api-development-integration/",
      },
      { label: "How We Work", href: "/how-we-work/" },
      { label: "Security Practices", href: "/security/" },
    ],
    cta: { label: "Discuss Your Architecture" },
  },

  {
    slug: "how-we-work",
    path: "/how-we-work/",
    h1: "A defined process from the first discussion to ongoing support",
    lead: "Software delivery works best when scope, responsibilities and review points are visible. Each engagement should state what is being built, how decisions are made and what your team receives.",
    seo: {
      title: "Software Development Process",
      description:
        "Review the software delivery process from discovery and design to development, testing, deployment, documentation and support.",
    },
    sections: [
      {
        heading: "Stages and what each produces",
        id: "stages",
        body: [
          "Each stage produces something you can review, from the initial brief to tested software and operating documentation. A stage that produces only a sense of progress is a stage that cannot be checked.",
        ],
        points: [
          "Consultation establishes fit and any restrictions before work is proposed",
          "Discovery maps the stakeholders, workflows and systems involved",
          "Requirements produce acceptance criteria rather than a wish list",
          "Specification describes functional and non-functional behaviour",
          "Wireframes establish layout, journeys and reading order",
          "UI design defines components and their interaction states",
          "Architecture records system boundaries and the decisions behind them",
          "Planning prioritises the backlog against the agreed scope",
          "Development produces reviewed code",
          "QA records test evidence against the acceptance criteria",
          "User acceptance testing confirms the agreed criteria with your team",
          "Security review checks the controls scoped for the project",
          "Deployment follows a release plan with a rehearsed rollback",
          "Documentation and training support handover",
          "Maintenance and optimisation follow the signed agreement",
        ],
      },
      {
        heading: "Decisions and who makes them",
        id: "decisions",
        body: [
          "Three roles are named at the start of an engagement: the business owner who can commit the organisation, the product owner who prioritises day to day, and the technical owner who decides architecture. Work slows most often because one of these is unnamed and a question has nowhere to go.",
          "An accepted milestone identifies its approver, the date and the evidence the acceptance was based on. A change request states the description, the reason, the effect on time and cost, and the approval — recorded before the work begins rather than discovered in an invoice.",
        ],
      },
      {
        heading: "Cadence and reporting",
        id: "cadence",
        body: [
          "A proposed working rhythm is a weekly progress update with a risk log, demonstrations at agreed intervals, and client decisions recorded in the project system rather than in a thread somebody has to find later. The specific cadence is agreed per engagement and written into the plan.",
          "One delivery method is selected for the work — Scrum, Kanban or another — rather than claiming several simultaneously. Saying a project is agile without naming the practices it actually uses tends to mean nobody has agreed how it will run.",
        ],
      },
      {
        heading: "What your team provides",
        id: "what-your-team-provides",
        body: [
          "Delivery timing depends on scope, access to existing systems, integration readiness and review turnaround. Those last two are usually the client's to supply, which is why a proposal states its assumptions rather than only its dates. Where an assumption fails, the effect on the plan is raised at the time rather than absorbed quietly.",
        ],
      },
    ],
    faqs: [
      {
        question: "What does the working cadence look like?",
        answer:
          "A weekly progress update with a risk log, demonstrations at agreed intervals, and decisions recorded in the project system. The exact rhythm is agreed per engagement; what matters is that it is agreed rather than assumed, and that someone on each side owns attending.",
      },
      {
        question: "What if our priorities change mid-project?",
        answer:
          "Changing priorities are normal. A change request records the description, the reason, the effect on time and cost, and the approval, and the work starts after approval. The procedure exists so that neither side discovers the budget consequence after the fact.",
      },
      {
        question: "How is work accepted?",
        answer:
          "Against acceptance criteria agreed in advance and written as observable behaviour. An accepted milestone records its approver, the date and the evidence. Acceptance by general impression is what produces a disagreement at the end of a project.",
      },
      {
        question: "What happens when something is late?",
        answer:
          "It is raised in the weekly update with the reason and the revised expectation, not at the point the date passes. Most delays come from a dependency rather than from the development itself, which is why the plan states its assumptions about access and review turnaround.",
      },
    ],
    related: [
      { label: "Engagement Models", href: "/engagement-models/" },
      { label: "Security Practices", href: "/security/" },
      { label: "Services", href: "/services/" },
    ],
    cta: { label: "Discuss Your Project" },
  },

  {
    slug: "engagement-models",
    path: "/engagement-models/",
    h1: "Choose how the work is scoped, managed and billed",
    lead: "The right engagement depends on how much is known, how quickly priorities may change and who manages day-to-day delivery. Compare the responsibilities and limits before requesting a proposal.",
    seo: {
      title: "Software Development Engagement Models",
      description:
        "Compare fixed scope, time and materials, dedicated teams, discovery and maintenance, including billing, changes and project responsibilities.",
    },
    sections: [
      {
        heading: "Choosing between them",
        id: "choosing",
        body: [
          "The question that separates these models is how much is genuinely known. A fixed-scope agreement needs a scope that can be fixed, which means the integrations have been assessed and the acceptance criteria written. Where that is not true, a fixed price is a guess with a contract around it, and the cost of the guess is paid by whichever side wrote it.",
          "The second question is who prioritises day to day. A managed arrangement puts that with the supplier against agreed outcomes; staff augmentation puts it with you. Mixing the two without saying so is the most common source of disappointment in these arrangements.",
        ],
      },
      {
        heading: "Commercial terms",
        id: "commercial-terms",
        body: [
          "A proposal identifies the contracting entity, scope, payment schedule, taxes where applicable, third-party costs and the acceptance process. Ownership of newly developed work, pre-existing tools and licensed components is defined in the signed agreement. An estimate is not a fixed-price commitment, and a proposal that presents one as the other is worth questioning.",
          "Client infrastructure and vendor charges should be identifiable in the billing rather than bundled, so you can see what you are paying a third party for and retain the account if the supplier relationship changes.",
        ],
      },
      {
        heading: "Terms not yet published",
        id: "terms-not-published",
        body: [
          "Deposit, refund, cancellation and dispute rules are published only after contract and counsel review, and that review has not been completed. No figures, rates or payment terms appear anywhere on this site. Ask for them in writing as part of a proposal, where they can be stated against a specific engagement rather than as a general claim.",
        ],
      },
    ],
    faqs: [
      {
        question: "What is the difference between an estimate and a quote?",
        answer:
          "An estimate is a considered expectation based on what is known at the time and will move as more is learned. A quote is a commitment to a price. Treating an early estimate as a quote is how fixed-price projects end badly for one side or the other.",
      },
      {
        question: "Who owns the intellectual property?",
        answer:
          "It is defined in the signed agreement, and it needs to distinguish newly developed work from pre-existing components and third-party licensed elements. Each of those three carries different terms, and assuming they are all transferred is a common and expensive misunderstanding.",
      },
      {
        question: "Are deposits required?",
        answer:
          "Payment schedules are agreed per engagement and set out in the proposal. No deposit, refund or cancellation terms are published on this site because they have not completed contract and counsel review.",
      },
      {
        question: "What happens if we cancel?",
        answer:
          "Cancellation terms belong in the signed agreement, including notice, what is payable for work completed and what transfers to you at that point. Agree them before starting rather than at the moment you want to use them.",
      },
      {
        question: "Who pays for third-party services?",
        answer:
          "Hosting, licences and vendor fees should be identifiable rather than bundled into a single figure, and the accounts should be owned by you with engineering holding scoped access. That keeps the services with you if the supplier relationship ends.",
      },
    ],
    related: [
      { label: "How We Work", href: "/how-we-work/" },
      { label: "Support", href: "/support/" },
      { label: "Website Terms", href: "/terms/" },
      { label: "Contact", href: "/contact/" },
    ],
    cta: { label: "Discuss an Engagement" },
  },

  {
    slug: "support",
    path: "/support/",
    h1: "Know what support covers after release",
    lead: "Support begins with a shared understanding of the application, its dependencies and the responsibilities in your agreement. Distinguish a defect, an operational incident and a request for new functionality.",
    seo: {
      title: "Software Support and Maintenance",
      description:
        "Understand post-launch support, maintenance scope, issue triage, updates, infrastructure responsibilities and escalation.",
    },
    sections: [
      {
        heading: "Handover",
        id: "handover",
        body: [
          "Support starts at handover, not at the first incident. Handover identifies the repositories, accounts, environments, credentials and operating documentation that transfer to you, and confirms that someone on your side can actually reach each of them. A handover that transfers code but not the hosting account is incomplete in the way that matters.",
        ],
      },
      {
        heading: "Defect reporting",
        id: "defect-reporting",
        body: [
          "A report that includes what was expected, what happened, and the steps that produced it can be acted on; one that reports a general impression usually cannot. Each report is classified before it is worked: a defect differs from what was agreed, an incident is a loss of service, an enhancement is new behaviour. Each has a different route and a different approval.",
        ],
      },
      {
        heading: "Dependency updates",
        id: "dependency-updates",
        body: [
          "Updates are scheduled rather than deferred until something forces them. Applied regularly they are routine; deferred for years they become a migration project carrying real risk. Where a dependency is no longer supported at all, that is raised as a standing risk rather than recorded as technical debt.",
        ],
      },
      {
        heading: "Infrastructure and backups",
        id: "infrastructure-and-backups",
        body: [
          "The agreement states who operates the infrastructure, who holds the accounts and who is called when it fails. Backups are only a control once a restore has been performed into an isolated environment and the result checked; until then they are an assumption.",
        ],
      },
      {
        heading: "Planned enhancements",
        id: "planned-enhancements",
        body: [
          "Small changes can be included within a contracted allowance, which keeps minor work from needing a new agreement each time. Anything beyond the allowance is quoted separately, which is fairer than an open-ended commitment that neither side can price.",
        ],
      },
      {
        heading: "Coverage and escalation",
        id: "coverage-and-escalation",
        body: [
          "Supported hours, the timezone they are stated in, the escalation route and any defect period are set out in the agreement for each engagement. They are not published here, because publishing a coverage window the staffing does not support would be a commitment this business cannot currently honour. Ask for them in writing as part of a proposal.",
          "Three tiers are described in proposals — essential maintenance, managed operations and continuous improvement — and remain descriptive until contracted. Emergency support is offered only where it is actually operated.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is this a bug or an enhancement?",
        answer:
          "A bug is behaviour that differs from what was agreed; an enhancement is new or changed behaviour. The boundary is occasionally genuinely unclear, which is why the agreement names who decides and what happens when the two sides disagree about a particular item.",
      },
      {
        question: "What happens during a vendor outage?",
        answer:
          "We confirm the cause, communicate the effect and apply whatever mitigation the application supports. Resolving another company's outage is not within anyone's power, so the agreement separates our responsibilities from theirs before one happens.",
      },
      {
        question: "Can we raise something outside supported hours?",
        answer:
          "You can always send it; whether it is worked before the next supported period depends on the coverage in your agreement. Out-of-hours response is only offered where it is genuinely staffed, because an unstaffed promise is worse than an honest limit.",
      },
      {
        question: "Can you support software you did not build?",
        answer:
          "Yes, beginning with a takeover assessment covering what the application does, what it depends on, how it deploys and what is undocumented. The assessment states what is not yet understood rather than implying command of an unfamiliar system from the first week.",
      },
    ],
    related: [
      { label: "Software Maintenance", href: "/services/software-maintenance/" },
      { label: "Security Practices", href: "/security/" },
      { label: "Engagement Models", href: "/engagement-models/" },
    ],
    cta: { label: "Discuss Maintenance" },
  },

  {
    slug: "company",
    path: "/company/",
    h1: "A software partner you can understand before you engage",
    lead: "This page explains what is published about the business operating this website, how work is organised and where to find company and contact information. Several details that would normally appear here have not been verified, and are therefore absent rather than approximated.",
    seo: {
      title: "About SoftSysLab",
      description:
        "Learn what is published about SoftSysLab, how delivery work is organised, and where to find company identity and contact information.",
    },
    sections: [
      {
        heading: "What we build",
        id: "what-we-build",
        body: [
          "The services for which scope, deliverables and delivery decisions are defined are published individually, covering custom business software, web applications, mobile products, SaaS platforms, first releases, integrations, design, testing, maintenance and team arrangements. Each page states its own poor-fit cases alongside its good-fit cases, because a service page that cannot say when not to buy it is advertising rather than information.",
        ],
        points: [
          "Ten service pages, each with scope, deliverables, architecture decisions and FAQs",
          "Four solution pages describing systems and the workflows they support",
          "A technology approach describing how choices are made, without a capability list that has not been verified",
        ],
      },
      {
        heading: "How work is organised",
        id: "how-work-is-organised",
        body: [
          "Delivery follows a defined sequence of stages, each producing something reviewable, with named owners for business, product and technical decisions. Changes are recorded with their cost and approved before work begins; milestones record their approver, date and evidence. The process page sets this out stage by stage.",
        ],
      },
      {
        heading: "Mission, values and history",
        id: "mission-values-history",
        body: [
          "No mission statement, values list, company history or timeline is published here. Statements of that kind are commitments made on behalf of a business, and adopting them requires the owner's approval, which has not been given. Publishing a plausible version in the meantime would be exactly the kind of unverified claim this site is built to avoid.",
        ],
      },
      {
        heading: "People and locations",
        id: "people-and-locations",
        body: [
          "No team profiles, photographs or office locations are published. Team entries require a real person, an approved biography and an accurate description of whether they are an employee, a contractor or a partner. Locations require a verified address, correctly labelled as registered or operating. None of that has been supplied, and stock photography standing in for staff or premises is not an acceptable substitute.",
        ],
      },
      {
        heading: "Company identity",
        id: "company-identity",
        body: [
          "Legal name, jurisdiction, registration number, registered address, operating address, business email and telephone are the responsibility of the business owner to supply and confirm. They are listed on the business information page with their current status, which is unverified across the board.",
        ],
      },
    ],
    faqs: [
      {
        question: "Where do you operate from?",
        answer:
          "That is not published, because no address has been verified. A registered address and an operating address are different things and are shown separately once confirmed; presenting a registered address as a staffed office would be misleading.",
      },
      {
        question: "Who manages the work?",
        answer:
          "Each engagement names a business owner, a product owner and a technical owner at the start, and the delivery governance for the arrangement is set out in the agreement. The process page describes how decisions, acceptance and changes are handled.",
      },
      {
        question: "Why is so little published about the company?",
        answer:
          "Because the facts have not been verified, and the alternative is to publish something plausible. Every absence on this site is deliberate and recorded. The identity details are listed with their status on the business information page rather than being quietly omitted.",
      },
    ],
    related: [
      { label: "Business Information", href: "/company/business-information/" },
      { label: "How We Work", href: "/how-we-work/" },
      { label: "Careers", href: "/careers/" },
      { label: "Contact", href: "/contact/" },
    ],
    cta: { label: "Discuss Your Project" },
  },

  {
    slug: "business-information",
    path: "/company/business-information/",
    h1: "Company and contact information",
    lead: "Find the legal identity and contact details of the business responsible for this website and its services. Each field below shows its current verification status; nothing is shown as confirmed until an accountable owner has confirmed it.",
    seo: {
      title: "Business Information",
      description:
        "Company identity, jurisdiction and business contact information for SoftSysLab, with the verification status of each field.",
    },
    sections: [
      {
        heading: "Why these fields are empty",
        id: "why-empty",
        body: [
          "This page is generated from a single settings record that the whole site reads, so the footer, the contact page and the structured data can never disagree with it. That record currently holds no verified values beyond the trading name.",
          "The alternative — publishing a plausible legal name and address until the real ones arrive — would put an unverifiable claim about a legal entity in front of anyone evaluating the business, and would be the hardest kind of error to retract once it had been indexed.",
        ],
      },
      {
        heading: "Corrections",
        id: "corrections",
        body: [
          "If any detail published here is wrong, or if you need the contracting entity confirmed before an engagement, use the contact page. Corrections to company identity are applied to the settings record, which updates every page that displays them at once.",
        ],
      },
    ],
    faqs: [
      {
        question: "Which entity would we be contracting with?",
        answer:
          "That is confirmed in the proposal and the signed agreement, where it is stated against a specific engagement. It is not published here because the legal entity details have not been verified for publication.",
      },
      {
        question: "What is the difference between a registered and an operating address?",
        answer:
          "A registered address is the official address recorded with the company registry and may be an accountant's or agent's office. An operating address is where people actually work. They are shown separately and labelled, because presenting one as the other misleads anyone trying to understand where a business is based.",
      },
    ],
    related: [
      { label: "Company", href: "/company/" },
      { label: "Website Terms", href: "/terms/" },
      { label: "Privacy Policy", href: "/privacy/" },
      { label: "Support", href: "/support/" },
    ],
    cta: { label: "Contact the Company" },
  },

  {
    slug: "security",
    path: "/security/",
    h1: "Security practices and project responsibilities",
    lead: "Security requirements depend on the application, its users and the data involved. This page describes how project-specific requirements are agreed and which controls are built into this website. It does not list company-wide security practices, because those claims have not been verified.",
    seo: {
      title: "Security Practices",
      description:
        "How project security requirements are agreed, the controls built into this website, and how to report a security concern.",
    },
    sections: [
      {
        heading: "How project requirements are agreed",
        id: "project-requirements",
        body: [
          "Security requirements belong in the project scope alongside features, not in a review at the end. Access, data handling, dependencies, backups and monitoring are discussed during scoping, and the controls and evidence a particular project needs are written into its agreement.",
          "That conversation produces a threat model proportionate to the application: what is worth protecting, who might want it, what a realistic failure looks like, and which controls are being relied on. Naming the control owner matters as much as naming the control.",
        ],
      },
      {
        heading: "Controls built into this website",
        id: "website-controls",
        body: [
          "The following are properties of this website and can be checked by anyone inspecting it. They are build requirements for this site, and they are not evidence that the same controls are applied to any client project — that remains a per-engagement question.",
        ],
        points: [
          "All traffic is served over HTTPS with a managed certificate",
          "A content security policy restricts where scripts and other resources may load from",
          "The enquiry endpoint validates with a shared schema, bounds the request body and rate-limits by address",
          "A submitted website address is stored as text and is never fetched by the server",
          "No file upload is offered anywhere, so no attachment reaches the server to be scanned",
          "No analytics, tag manager or third-party tracking script is loaded, before or after consent",
          "Enquiry contents are not written to application logs",
        ],
      },
      {
        heading: "Practices not yet published",
        id: "not-yet-published",
        body: [
          "Section 24 of the product requirements lists the areas a security page should cover. Each claim in those areas requires an internal evidence owner, a last verified date and a stated scope before it can be published. None have completed that review, so none appear here as a claim.",
        ],
        points: [
          "Secure development lifecycle, source control and code review",
          "Authentication, authorisation and access review cadence",
          "Encryption at rest and in transit, and secret management",
          "Infrastructure, environment separation and change control",
          "Backup coverage, retention and tested restoration",
          "Logging, monitoring and alert ownership",
          "Dependency and vulnerability management",
          "Employee and customer access, joiner and leaver process",
          "Third-party services, data regions and processing agreements",
          "Data minimisation, retention and deletion",
          "Business continuity and incident response",
        ],
      },
      {
        heading: "Certifications",
        id: "certifications",
        body: [
          "No certification is claimed. There is no SOC 2 report, ISO 27001 certificate, HIPAA attestation or PCI DSS assessment, and no badge representing one appears on this site. A certification claim without the corresponding evidence and scope is straightforwardly false, and is one of the easier things for a prospective client's procurement team to check.",
        ],
      },
      {
        heading: "Reporting a security issue",
        id: "reporting",
        body: [
          "If you believe you have found a security issue affecting this website, please report it through the contact page with a description and the affected address. Please do not include unnecessary personal data in the report.",
          "A dedicated security mailbox is not yet published because no monitored address has been confirmed. There is no bug bounty, and no disclosure history or response commitment is claimed; the scope and any safe-harbour wording require approval from counsel and a security owner before they could be stated here.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can you provide security documentation for our review?",
        answer:
          "Project-specific documentation is produced as part of scoping and shared under the engagement. Company-wide documentation is not available for distribution, and sensitive evidence is requested through contact rather than offered for download from a public page.",
      },
      {
        question: "Do you hold any certifications?",
        answer:
          "No. No certification is claimed anywhere on this site. If a certification is a procurement requirement for your organisation, raise it early, because it is a question about the supplier rather than about the project.",
      },
      {
        question: "How are project-specific requirements handled?",
        answer:
          "They are agreed during scoping and written into the project's scope with a named owner for each control, rather than being assumed from a general statement. Regulated sectors usually bring requirements that change the architecture, which is why they belong in the first conversation.",
      },
    ],
    related: [
      { label: "How We Work", href: "/how-we-work/" },
      { label: "Privacy Policy", href: "/privacy/" },
      { label: "Contact", href: "/contact/" },
    ],
    cta: { label: "Contact Us About Security" },
  },

  {
    slug: "careers",
    path: "/careers/",
    h1: "Work on software with clear expectations",
    lead: "This page lists the roles currently open. Information about working here — culture, benefits, employment arrangements, remote eligibility and locations — is not published yet, because none of it has been verified.",
    seo: {
      title: "Careers at SoftSysLab",
      description:
        "Current openings at SoftSysLab and what is published about applying. No speculative applications are collected.",
    },
    sections: [
      {
        heading: "Open roles",
        id: "open-roles",
        body: [
          "There are no open roles listed at the moment. When a role opens it appears here with its responsibilities, required skills, employment type, location and hiring stages, along with how to request an adjustment to the process.",
        ],
      },
      {
        heading: "Working here",
        id: "working-here",
        body: [
          "Culture, benefits, employment type, remote policy and office locations are all company-specific facts that require verification before publication. None has been verified, so none is published. A benefits list that turns out to be aspirational is a poor way to begin a working relationship, and a careers page is read most carefully by exactly the people who would notice.",
        ],
      },
      {
        heading: "Applications without an open role",
        id: "speculative-applications",
        body: [
          "Speculative applications are not being collected. Accepting a CV means holding someone's personal data, which requires an approved process for who may read it, how long it is kept and how it is deleted. That process does not exist yet, so asking for CVs would mean collecting personal data with no retention policy behind it.",
        ],
      },
    ],
    faqs: [
      {
        question: "Are roles remote?",
        answer:
          "Remote eligibility is not published, because it has not been verified. Where a role opens, its employment type and location eligibility are stated on the role itself rather than as a general policy claim.",
      },
      {
        question: "Can I apply without an open role?",
        answer:
          "Not at the moment. Collecting a CV means holding personal data, and the approved process and retention policy for doing that are not in place. Rather than accept applications it could not handle properly, this site does not ask for them.",
      },
    ],
    related: [
      { label: "Company", href: "/company/" },
      { label: "How We Work", href: "/how-we-work/" },
    ],
    cta: { label: "Discuss Your Project" },
  },
];

/** Validated at module load — an invalid record fails the build, not a review. */
export const corporatePages: CorporatePage[] = pages.map((page) =>
  corporatePageSchema.parse(page),
);

export function corporatePage(slug: string): CorporatePage {
  const page = corporatePages.find((candidate) => candidate.slug === slug);
  if (!page) {
    throw new Error(`No corporate page record for slug "${slug}".`);
  }
  return page;
}

/* ------------------------------------------- engagement model comparison -- */

/** PRD section 19's engagement table, kept structured so it can be rendered
 *  as a real table on desktop and a definition list on mobile. */
export const engagementModels = [
  {
    model: "Fixed scope",
    bestFit: "Defined outcomes, billed against agreed milestones.",
    advantages: "A clear scope baseline everyone can check against.",
    limits: "New work changes the price and the timing.",
    documents:
      "Signed statement of work, acceptance checklist, written change orders.",
  },
  {
    model: "Time and materials",
    bestFit: "An evolving backlog, billed at agreed rates for approved time.",
    advantages: "Priorities can change without renegotiating the agreement.",
    limits: "The final cost depends on the effort actually required.",
    documents:
      "Timesheets or agreed effort records, budget cap alerts, backlog approvals.",
  },
  {
    model: "Dedicated team",
    bestFit: "Sustained delivery under a monthly capacity agreement.",
    advantages: "Continuity of people who learn your systems.",
    limits: "Capacity does not guarantee a fixed quantity of output.",
    documents:
      "Role plan, availability, management responsibilities, replacement terms.",
  },
  {
    model: "Staff augmentation",
    bestFit: "Client-managed delivery, billed on time or capacity.",
    advantages: "Specific skills added to a team you direct.",
    limits: "You own prioritisation and day-to-day supervision.",
    documents:
      "Role scope, access rules, interview process, offboarding, time approval.",
  },
  {
    model: "Discovery sprint",
    bestFit: "Unknown scope, billed as an agreed discovery fee.",
    advantages: "Reduces uncertainty before a larger commitment.",
    limits: "Does not include the full build.",
    documents:
      "Agenda, research access, findings, and a prototype or specification as contracted.",
  },
  {
    model: "Retainer",
    bestFit: "Ongoing improvement against reserved time or a service scope.",
    advantages: "Predictable access to the team.",
    limits: "The treatment of unused capacity matters and must be agreed.",
    documents: "Monthly scope, approval limits, rollover rules, reporting.",
  },
  {
    model: "Maintenance",
    bestFit: "An operating application under an agreed coverage fee.",
    advantages: "Defined support responsibilities.",
    limits: "Not unlimited enhancement work.",
    documents:
      "Service inventory, hours, priorities, exclusions, escalation, renewal terms.",
  },
] as const;

/* ----------------------------------------------------- contact page copy -- */

export const contactPage = {
  h1: "Tell us about your project",
  lead: "Share the problem you want to solve, the stage of your project and any important constraints. A short summary is enough to begin. Please do not send passwords, payment details or confidential customer data.",
  seo: {
    title: "Discuss Your Software Project",
    description:
      "Contact SoftSysLab to discuss software requirements, project scope, integrations, timelines and engagement options.",
  },
  nextSteps: [
    {
      title: "We review fit",
      body: "Your summary is read against what we actually do. If another supplier or an existing product would serve you better, we say so.",
    },
    {
      title: "We clarify requirements",
      body: "We come back with the questions that would change the shape of a proposal — usually about integrations, users and constraints.",
    },
    {
      title: "We agree the next discussion",
      body: "A call or a written response, using the contact method you selected. Sending an enquiry creates no development contract.",
    },
  ],
  faqs: [
    {
      question: "What information should I include?",
      answer:
        "The problem you are trying to solve, who would use the result, anything it has to connect to, and any fixed constraint such as a date or an existing system. A few paragraphs is plenty. Precise requirements are not expected at this stage and are frequently premature.",
    },
    {
      question: "Will what I send be treated confidentially?",
      answer:
        "Your enquiry is used to respond to you and is not added to any marketing list. Please do not send passwords, payment details or confidential customer data through this form. If you need a non-disclosure agreement before sharing restricted material, raise that first; the availability and wording have to be agreed.",
    },
    {
      question: "What happens after I submit?",
      answer:
        "You receive a reference immediately and the enquiry is recorded. No response time is published, because publishing one would be a commitment the current staffing arrangements have not confirmed. The next steps listed on this page describe what the process involves rather than how quickly it happens.",
    },
  ] satisfies Faq[],
} as const;
