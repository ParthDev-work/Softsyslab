import { serviceSchema, type Service } from "@/lib/content/schemas";

/**
 * Service records — authored from PRD section 14's per-service specifications.
 *
 * Every field of section 14's shared service contract is required by the schema,
 * so a record that omits poor-fit cases, architecture decisions or a security
 * note fails validation at module load rather than publishing a thin page.
 *
 * Technology names are deliberately absent from these records. Section 14 marks
 * them "examples requiring verification" and section 17 requires an owner and
 * evidence reference per technology, so they live in content/technologies.ts
 * and render only when verified.
 */

const records: Service[] = [
  {
    slug: "custom-software-development",
    group: "application-engineering",
    h1: "Custom Software Development",
    lead: "Build software around the work your business actually does. Start with the users, decisions and information flows, then define an application that fits your operations and can evolve with them. A useful scope describes the users, workflows, integrations and acceptance criteria together, so before development begins you can identify what must be delivered, which decisions remain open and what your team needs to provide.",
    seo: {
      title: "Custom Software Development",
      description:
        "Plan custom business software around your workflows, users and integrations. Review delivery stages, ownership and support options.",
    },
    businessProblems: [
      "Work is coordinated across spreadsheets and email, so nobody can see the current state of a job without asking someone.",
      "An existing tool covers part of the process, and the gap is filled by manual re-entry that introduces errors.",
      "Approval and assignment rules live in people's heads rather than in a system that records who decided what.",
      "Reporting takes days to assemble because the underlying records are inconsistent or incomplete.",
    ],
    goodFit: [
      "The workflow is specific to how your business operates and configuring an existing product would mean working against it.",
      "Several roles need different views and permissions over the same records.",
      "The process must integrate with systems you already run and intend to keep.",
    ],
    poorFit: [
      "An established product already covers the workflow and the real need is configuration, training or data cleanup.",
      "The process itself is undecided — discovery or a workshop will produce more value than a build.",
      "The budget assumes a fixed price before the integrations and data sources have been identified.",
    ],
    sections: [
      {
        heading: "When custom software is justified",
        id: "when-custom-is-justified",
        body: [
          "Custom development is worth its cost when the workflow is a genuine part of how the business competes, or when the available products force a change in process that would cost more than the software. Before recommending a build we compare configuring an existing tool against developing one, and record why the chosen option is the better of the two.",
          "That comparison is a deliverable in its own right. If an off-the-shelf product turns out to fit, saying so early is a better outcome than a project that reproduces something you could have licensed.",
        ],
        points: [
          "Which parts of the process are standard, and which are specific to your business",
          "What an existing product would require you to change in order to adopt it",
          "The operating cost of each option over the period you expect to run it",
        ],
      },
      {
        heading: "Workflow discovery",
        id: "workflow-discovery",
        body: [
          "Discovery maps the people involved, the decisions they make and the information each decision needs. It produces a domain model, a role matrix describing who may see and change what, and a list of the integrations and data migrations the system will depend on.",
          "The output is written down and reviewed with the people who do the work, because a workflow described only by a manager usually omits the exceptions that make the system difficult to build.",
        ],
        points: [
          "Domain model naming the records the business actually keeps",
          "Role matrix covering read, create, change and approve for each record type",
          "Integration inventory with the owner of each connected system",
          "Data migration assessment covering source quality and reconciliation",
        ],
      },
      {
        heading: "Application boundaries",
        id: "application-boundaries",
        body: [
          "A clear boundary states what the application owns, what it reads from elsewhere and what it must never become the authority for. Getting this wrong is the most expensive class of mistake in a business system, because two systems that both believe they own a record will diverge.",
          "We record the decision for each data domain: which system is authoritative, how the other learns about changes, and what happens when the connection fails.",
        ],
      },
      {
        heading: "Delivery and handover",
        id: "delivery-and-handover",
        body: [
          "Each delivery stage produces something reviewable: a specification, an interface, tested software, a deployment guide. Handover identifies the repositories, accounts, environments and operating documentation that transfer to you, and the training needed by the people who will administer the system.",
          "Ownership of newly developed work, pre-existing components and third-party licences is set out in the signed agreement, not assumed.",
        ],
      },
    ],
    capabilities: [
      "Domain modelling and role-based permission design",
      "Workflow, approval and assignment logic with a recorded audit trail",
      "Integration with the systems that already hold your data",
      "Data migration with reconciliation against the source",
      "Operational reporting built on consistent underlying records",
      "Operating documentation and administrator training as contracted",
    ],
    deliverables: [
      "Written specification covering functional and non-functional behaviour",
      "User interface designs with interaction states",
      "Source code in a repository you own",
      "Automated tests covering the critical journeys",
      "Deployment guide and environment configuration",
      "Agreed training for administrators and operational staff",
    ],
    architectureDecisions: [
      "Modular monolith versus separate services, decided on team size and operational capacity rather than fashion.",
      "Data ownership per domain, naming the authoritative system and the propagation method for every shared record.",
      "Audit requirements: which changes must be recorded, who may read the record and how long it is retained.",
    ],
    securityNotes: [
      "Least privilege is designed into the role matrix rather than added afterwards: each role receives the narrowest set of permissions that lets it finish its work.",
      "Sensitive fields are identified during discovery so access, logging and retention can be handled explicitly instead of inheriting the defaults applied to ordinary records.",
    ],
    integrations: [
      "Accounting, CRM or ERP systems that remain authoritative for their own records",
      "Identity providers for staff sign-in, so access follows your existing joiner and leaver process",
      "Document storage and notification channels already used by the team",
    ],
    scheduleDrivers: [
      "Access to the existing systems and to the people who understand them",
      "Quality of the data being migrated, which is usually discovered rather than known",
      "Review turnaround on specifications and acceptance criteria",
      "Whether integration partners can supply a sandbox environment",
    ],
    engagementNote:
      "Scope that is well understood at the outset can be delivered against a fixed-scope agreement with milestone acceptance. Where discovery is still open, a discovery sprint followed by time and materials usually produces a more honest plan than a fixed price written before the integrations are known.",
    exampleWorkflow: {
      kind: "workflow",
      caption: "A representative operational flow through a custom business application.",
      label: "Illustrative — not delivered client work",
      steps: ["Enquiry", "Approval", "Job assignment", "Reporting"],
    },
    evidence: [],
    faqs: [
      {
        question: "Should we build or buy?",
        answer:
          "Compare the two before committing. Configuring an existing product is usually cheaper to start and cheaper to run; a build is justified when the workflow is specific to your business or when adopting a product would force changes that cost more than the software. We document the comparison and the reasoning, and recommending a product is a legitimate outcome.",
      },
      {
        question: "What happens when the scope changes?",
        answer:
          "A change request records the description, the reason, the effect on time and cost, and the approval. Work on it begins after approval. Changes are expected in most projects; the point of the procedure is that neither side discovers the effect on the budget after the work has been done.",
      },
      {
        question: "Who owns the source code?",
        answer:
          "Ownership of newly developed work, any pre-existing components and third-party licensed elements is defined in the signed agreement. Raise this before the agreement is signed rather than at handover, because pre-existing tools and open-source licences each carry their own terms.",
      },
      {
        question: "What support is available after launch?",
        answer:
          "The agreement defines handover, any defect period and ongoing maintenance separately. Support scope, coverage and escalation are set out in the maintenance terms rather than assumed, so that a defect, an operational incident and a request for new functionality are handled as different things.",
      },
    ],
    related: [
      { label: "Web Application Development", href: "/services/web-development/" },
      {
        label: "API Development and Integration",
        href: "/services/api-development-integration/",
      },
      { label: "How We Work", href: "/how-we-work/" },
    ],
    cta: { label: "Discuss Your Software Project" },
  },

  {
    slug: "web-development",
    group: "application-engineering",
    h1: "Web Application Development",
    lead: "Create a browser-based product that lets customers or staff complete real tasks. Plan the interface, permissions, business logic and integrations as one system rather than as separate workstreams. An operational web application is not a marketing website: it holds records, enforces authorisation on every request and has to behave predictably when an integration is slow or unavailable.",
    seo: {
      title: "Web Application Development",
      description:
        "Explore web application development for customer portals, dashboards and business workflows, including architecture, testing and deployment.",
    },
    businessProblems: [
      "Customers call or email for status updates that they could read themselves if a secure interface existed.",
      "Staff work in an admin tool that was built for a smaller team and now hides the information people need.",
      "Permissions are enforced in the interface but not on the server, so an authorised request can reach data it should not.",
      "Releases are risky because no one can describe what the application is supposed to do when an integration fails.",
    ],
    goodFit: [
      "People need to complete tasks and see records, not just read published content.",
      "Different roles need genuinely different views over the same underlying data.",
      "The application must integrate with systems that remain authoritative for their own records.",
    ],
    poorFit: [
      "The requirement is a marketing site or a content publication, which needs a different build and a different budget.",
      "The workflow has not been agreed and the real first step is discovery or interface design.",
      "A platform you already license would cover it with configuration alone.",
    ],
    sections: [
      {
        heading: "User journeys",
        id: "user-journeys",
        body: [
          "Start from the tasks people need to complete rather than from a list of screens. A journey describes who is acting, what they need to achieve, what information they need in front of them and what has to be true before the task can be finished.",
          "Journeys written this way make the permissions model and the error states fall out naturally, because each step raises the question of who may do it and what happens when it cannot be completed.",
        ],
        points: [
          "Authenticated applications where every request is checked against the acting user",
          "Role-based dashboards that show each role the records it is responsible for",
          "Customer workspaces with document access and request history",
          "Internal admin tools with bulk actions and confirmation on destructive operations",
        ],
      },
      {
        heading: "Frontend and backend responsibilities",
        id: "frontend-and-backend",
        body: [
          "The division of work between browser and server is an architectural decision with consequences for performance, accessibility and security. Server rendering suits content and record views; client interaction suits editing, filtering and anything that needs to respond without a round trip.",
          "Authorisation belongs on the server without exception. The interface may hide a control the user cannot use, but hiding it is a usability choice, never the access control.",
        ],
      },
      {
        heading: "Integration boundaries",
        id: "integration-boundaries",
        body: [
          "Each external system is treated as an explicit dependency with a contract, a credential owner and a defined behaviour when it is unavailable. Deciding in advance whether an operation retries, queues or fails visibly is what keeps a slow third party from turning into a corrupted record.",
          "Where an integration cannot be reached, the application states what has and has not been saved rather than implying a success it cannot confirm.",
        ],
      },
      {
        heading: "Release readiness",
        id: "release-readiness",
        body: [
          "A release is ready when the critical journeys have test evidence, the acceptance criteria have been checked against the agreed definition, and the rollback path has been rehearsed rather than assumed. Hosting ownership, environment configuration and monitoring are settled before launch, not after the first incident.",
        ],
      },
    ],
    capabilities: [
      "Authenticated applications with server-enforced authorisation on every resource",
      "Role-based dashboards and operational admin interfaces",
      "Customer workspaces covering requests, documents and status",
      "Session management, caching strategy and API boundary design",
      "Accessible interface implementation tested with keyboard and screen reader",
      "Automated test coverage over the journeys that matter commercially",
    ],
    deliverables: [
      "Responsive application tested at the supported viewport range",
      "API contracts describing requests, responses and error envelopes",
      "Automated tests covering critical journeys and failure modes",
      "Deployment configuration and environment documentation",
      "Handover covering repositories, accounts and operating procedures",
    ],
    architectureDecisions: [
      "Server rendering versus client interaction per surface, decided on content type, accessibility and the cost of the first paint.",
      "Session management and token lifetime, including how revocation takes effect on the server rather than only in the interface.",
      "Caching strategy and invalidation: what may be cached, for how long, and what must never be served from a shared cache.",
      "API boundary placement, so that an internal refactor does not become a breaking change for a consumer.",
    ],
    securityNotes: [
      "Authorisation is checked on every resource against the acting user, never inferred from an unguessable identifier or from the fact that the interface did not offer a link.",
      "Cross-site request forgery protection is applied wherever a session cookie can drive a state change, and all user-supplied values are encoded on output rather than sanitised once on input.",
    ],
    integrations: [
      "Identity providers for staff and customer sign-in",
      "Business systems that remain authoritative for their own records",
      "Document storage, notification and payment providers as the workflow requires",
    ],
    scheduleDrivers: [
      "Number of distinct roles and the complexity of the permission matrix",
      "Readiness of the integration partners, particularly sandbox availability",
      "Volume of existing data to migrate and its condition",
      "Review turnaround on designs and acceptance criteria",
    ],
    engagementNote:
      "Web application work usually starts with a scoped first release covering the core journeys, then continues on an evolving backlog. Fixed scope fits a well-defined replacement; time and materials fits a product that will keep changing after the first release.",
    exampleWorkflow: {
      kind: "workflow",
      caption: "A representative request flow through an authenticated web application.",
      label: "Illustrative — not delivered client work",
      steps: ["Account setup", "Task submission", "Staff review", "Status tracking"],
    },
    evidence: [],
    faqs: [
      {
        question: "Does it need to work on mobile browsers?",
        answer:
          "Usually yes, and it is cheaper to plan for it than to retrofit it. We agree the supported viewport range and device classes at the start, then test against them. A responsive web application is not the same as a native app; where device features or offline use are genuinely required, that is a mobile product decision.",
      },
      {
        question: "What about working offline?",
        answer:
          "Browser applications can tolerate brief connection loss, but genuine offline work with later synchronisation introduces conflict resolution, which is a substantial piece of design. If people will regularly work without a connection, treat it as a requirement to be scoped rather than an enhancement to add later.",
      },
      {
        question: "Can it integrate with the systems we already run?",
        answer:
          "That depends on what those systems expose. The first step is an integration assessment: what the API or export supports, what the rate limits and data model allow, who owns the credentials and what happens during an outage. Some integrations turn out to be straightforward and some constrain the design significantly.",
      },
      {
        question: "Who owns the hosting?",
        answer:
          "We recommend that the business owns the domain, the hosting account and the billing relationship, with engineering holding scoped access. That keeps the accounts with you if the supplier relationship changes. Production services placed in a developer's personal account are a handover problem waiting to happen.",
      },
    ],
    related: [
      { label: "UI and UX Design", href: "/services/ui-ux-design/" },
      {
        label: "API Development and Integration",
        href: "/services/api-development-integration/",
      },
      { label: "QA and Software Testing", href: "/services/qa-testing/" },
    ],
    cta: { label: "Discuss Your Web Application" },
  },

  {
    slug: "mobile-app-development",
    group: "application-engineering",
    h1: "Mobile App Development",
    lead: "Design a mobile product around the situations in which people use it. Decide which device features, network conditions and platform requirements matter before selecting an implementation approach. The choice between native and cross-platform development should follow from those requirements and from the capability of the team that will maintain the result, not from a general preference.",
    seo: {
      title: "Mobile App Development",
      description:
        "Plan mobile app development around user journeys, device features, backend integrations, testing and release responsibilities.",
    },
    businessProblems: [
      "Field staff record work on paper because the existing system assumes a desk and a reliable connection.",
      "Customers expect to complete a task on a phone that currently requires a desktop browser.",
      "An existing app was built without a release process, so updates are infrequent and risky.",
      "Push notifications are either absent or so frequent that people have turned them off.",
    ],
    goodFit: [
      "The task genuinely happens away from a desk, or depends on device features like the camera, location or secure storage.",
      "People need to keep working when the connection drops and synchronise afterwards.",
      "Distribution through the app stores is a requirement rather than a preference.",
    ],
    poorFit: [
      "A responsive web application would serve the same journeys without the cost of store releases and device testing.",
      "The product has not been validated and the first task is to test the core assumption more cheaply.",
      "There is no plan or budget for the ongoing platform updates that store distribution requires.",
    ],
    sections: [
      {
        heading: "Mobile journeys",
        id: "mobile-journeys",
        body: [
          "Mobile use happens in specific circumstances: one hand, poor signal, bright sunlight, a few seconds between other tasks. Journeys are designed for those conditions rather than adapted from a desktop screen, because an interface that assumes attention and bandwidth will be abandoned in the field.",
        ],
      },
      {
        heading: "Platform choice",
        id: "platform-choice",
        body: [
          "Native and cross-platform development are compared against the actual requirements and the actual team. Cross-platform shares most of the code and suits products whose device integration is modest; native suits heavy use of platform capabilities or demanding performance.",
          "The comparison includes who will maintain the application, since a stack nobody on the team knows is a long-term cost rather than a saving.",
        ],
      },
      {
        heading: "Device and offline behaviour",
        id: "device-and-offline",
        body: [
          "Offline capability means deciding what can be created without a connection, how it is stored on the device, when it synchronises and what happens when two people have changed the same record. Conflict resolution is a product decision, not a technical detail, because somebody has to decide which version wins.",
        ],
        points: [
          "iOS and Android version range to be supported, agreed at the start",
          "Push notification permissions, with a reason the user will accept",
          "Deep links into specific records from email and messages",
          "Accessibility support using each platform's own assistive technology",
        ],
      },
      {
        heading: "Store release preparation",
        id: "store-release",
        body: [
          "Store submission requires accounts, listing assets, privacy declarations and review time. Approval remains with the platform operator and outside supplier control, so release plans allow for a rejection and a resubmission rather than assuming a date.",
        ],
      },
    ],
    capabilities: [
      "Mobile journey design for intermittent connectivity and one-handed use",
      "Native and cross-platform implementation evaluated against actual requirements",
      "Offline capture with defined synchronisation and conflict resolution",
      "Push notification, deep link and background task handling",
      "Device test matrix execution across the agreed OS range",
      "Store listing preparation and submission support where contracted",
    ],
    deliverables: [
      "Application source in a repository you own",
      "Device test matrix with recorded results",
      "Store listing assets and privacy declarations",
      "Backend integration contracts",
      "Submission support where contracted",
    ],
    architectureDecisions: [
      "Native versus cross-platform, recorded with the device requirements and maintenance capability that drove the decision.",
      "Local storage and synchronisation model, including the conflict resolution rule and who approved it.",
      "Backend dependency boundary: what the app may do while unreachable, and how it recovers.",
    ],
    securityNotes: [
      "Credentials and tokens are held in the platform's secure storage with a defined lifetime and a working revocation path, rather than in general application storage.",
      "Data cached on the device for offline use is treated as a privacy decision: what is held, for how long, and what is removed on sign-out.",
    ],
    integrations: [
      "Backend services the application depends on, with defined behaviour when unreachable",
      "Push notification services for each platform",
      "Identity providers, including platform sign-in options where appropriate",
    ],
    scheduleDrivers: [
      "Breadth of the device and OS matrix to be supported",
      "Whether offline synchronisation is in scope, which changes the design substantially",
      "Store review time, which is outside supplier control",
      "Availability of backend APIs the application depends on",
    ],
    engagementNote:
      "Mobile products usually suit a scoped first release followed by a maintenance agreement, because platform updates force periodic work whether or not the product is changing. Budget for that continuing cost before the first release rather than after it.",
    exampleWorkflow: {
      kind: "workflow",
      caption: "A representative offline capture and synchronisation flow.",
      label: "Illustrative — not delivered client work",
      steps: [
        "Capture task offline",
        "Synchronise",
        "Resolve conflict",
        "Notify assignee",
      ],
    },
    evidence: [],
    faqs: [
      {
        question: "Native or cross-platform?",
        answer:
          "It depends on the device features you need and on who maintains the result. Cross-platform shares most code and suits products with modest device integration; native suits heavy platform use or demanding performance. We compare both against your requirements and record the reasoning rather than applying a default.",
      },
      {
        question: "How should offline behaviour work?",
        answer:
          "Decide what can be created without a connection, how long it is held, and what happens when two people change the same record. That last question is a business decision about which version wins, and it needs an answer before the synchronisation code is written.",
      },
      {
        question: "Who owns the store accounts?",
        answer:
          "The business should own the Apple and Google developer accounts and the billing attached to them, with engineering holding scoped access. Accounts held personally by a developer are difficult to recover and can block an urgent update.",
      },
      {
        question: "How often will it need updating?",
        answer:
          "Both platforms release annually and periodically raise their minimum requirements for submitted apps, so some maintenance is required even when the product is unchanged. Plan for it as a standing cost rather than treating each round as an unexpected project.",
      },
    ],
    related: [
      {
        label: "API Development and Integration",
        href: "/services/api-development-integration/",
      },
      { label: "UI and UX Design", href: "/services/ui-ux-design/" },
      { label: "Software Maintenance", href: "/services/software-maintenance/" },
    ],
    cta: { label: "Plan Your Mobile Product" },
  },

  {
    slug: "saas-development",
    group: "application-engineering",
    h1: "SaaS Development",
    lead: "Build a subscription product with a clear model for accounts, organisations, access and billing. Treat onboarding and daily operations as part of the product rather than as additions after launch. The decisions that are hardest to reverse in a SaaS product — how tenants are isolated, how entitlements are derived and how billing events are handled — are all taken early, so they deserve explicit attention before feature work begins.",
    seo: {
      title: "SaaS Development",
      description:
        "Explore SaaS product development, including tenancy, subscriptions, onboarding, integrations and the operational work needed after launch.",
    },
    businessProblems: [
      "Every new customer requires manual setup, which limits growth to the number of accounts someone can configure by hand.",
      "Plan changes and cancellations are applied inconsistently because entitlements are stored in more than one place.",
      "Support staff cannot see a customer's account without credentials that give them more access than they need.",
      "Billing provider events arrive more than once and the system treats each as a new change.",
    ],
    goodFit: [
      "Multiple organisations will use the same application with their data kept separate.",
      "Access depends on a subscription state that changes over time.",
      "Self-service onboarding matters to the commercial model.",
    ],
    poorFit: [
      "There is one customer, in which case a single-tenant application is simpler and cheaper to operate.",
      "The product proposition has not been validated and a focused MVP would answer the open question first.",
      "Billing requirements are genuinely unusual and need a commercial decision before any technical one.",
    ],
    sections: [
      {
        heading: "Tenant model",
        id: "tenant-model",
        body: [
          "Tenant isolation is the decision that is hardest to change later. Whether tenants share tables with an enforced key, separate schemas or separate databases affects operational cost, the blast radius of a mistake and what you can tell a prospect during a security review.",
          "Whatever model is chosen, every query path is tested with a tenant that should see nothing, because the failure mode is silent and serious.",
        ],
      },
      {
        heading: "Subscription lifecycle",
        id: "subscription-lifecycle",
        body: [
          "The lifecycle covers trial, invitation, plan selection, upgrade, downgrade, failed payment, cancellation and reactivation. Entitlements are derived from subscription state in one place so that the application never disagrees with the billing provider about what a customer may do.",
          "Billing provider webhooks are treated as events that may arrive late, out of order or more than once, and are therefore processed idempotently against a recorded external event identifier.",
        ],
      },
      {
        heading: "Product administration",
        id: "product-administration",
        body: [
          "Operating a SaaS product requires its own interfaces: inviting users, managing roles, exporting data, and letting support staff see enough to help without acquiring unnecessary access to customer records. These are product features with their own design and permission requirements.",
        ],
        points: [
          "Invitations and organisation membership with role assignment",
          "Entitlement changes applied from one authoritative place",
          "Customer-initiated data export",
          "Support access that is scoped, time-limited and recorded",
        ],
      },
      {
        heading: "Operating costs",
        id: "operating-costs",
        body: [
          "Infrastructure, the billing provider's fees, transactional email, storage and monitoring are continuing costs that scale with usage. Estimating them against expected volumes before launch prevents the unpleasant discovery that the pricing model does not cover the cost of serving a customer.",
        ],
      },
    ],
    capabilities: [
      "Tenancy design with isolation verified by tests that assert a tenant sees nothing of another",
      "Subscription state modelling and entitlement derivation",
      "Idempotent billing provider webhook handling",
      "Organisation, invitation and role management",
      "Customer data export and account closure handling",
      "Operator and support tooling with scoped, recorded access",
    ],
    deliverables: [
      "Tenancy architecture decision record",
      "Subscription state model with the transitions enumerated",
      "Application including administration and operator interfaces",
      "Operator guide covering routine and exceptional procedures",
      "Integration tests covering tenant isolation and webhook replay",
    ],
    architectureDecisions: [
      "Tenant isolation strategy, recorded with the operational and commercial consequences of the choice.",
      "Idempotent webhook processing keyed on the provider's external event identifier, with replay handled as a normal case.",
      "Data partitioning and the migration path, so that moving a large tenant later does not require downtime for everyone.",
    ],
    securityNotes: [
      "Tenant-specific access is verified by automated tests that attempt cross-tenant reads and expect them to fail, because an isolation defect is invisible in ordinary use.",
      "Support-user permissions are scoped and time-limited, and every support access to a customer record is recorded with the actor and the reason.",
    ],
    integrations: [
      "Billing and payment providers, with webhook signature verification and replay protection",
      "Transactional email for lifecycle and notification messages",
      "Identity providers, including single sign-on where customers require it",
    ],
    scheduleDrivers: [
      "Complexity of the plan and entitlement model",
      "Whether single sign-on is required at launch or can follow",
      "Billing provider capabilities and the behaviour of its sandbox",
      "Data export and retention obligations that apply to your market",
    ],
    engagementNote:
      "SaaS products are rarely finished at launch. A scoped first release on fixed terms followed by a dedicated team or retainer tends to match the reality better than a single fixed-price engagement covering the whole roadmap.",
    exampleWorkflow: {
      kind: "workflow",
      caption: "A representative subscription lifecycle through a multi-tenant product.",
      label: "Illustrative — not delivered client work",
      steps: [
        "Trial",
        "Invite team",
        "Select plan",
        "Entitlement change",
        "Cancellation",
      ],
    },
    evidence: [],
    faqs: [
      {
        question: "Which billing provider should we use?",
        answer:
          "That is a commercial decision before a technical one: the tax handling, the supported countries, the payment methods your customers use and the fee structure usually matter more than the API. Whichever you choose, the integration should treat its events as potentially duplicated and out of order.",
      },
      {
        question: "Can customers export their data?",
        answer:
          "They should be able to, and in some markets they have a right to. Building export early is easier than retrofitting it, and it is a routine question in enterprise procurement. It also makes your own migrations and support work simpler.",
      },
      {
        question: "How should tenancy work?",
        answer:
          "Shared tables with an enforced tenant key suit most products and are cheapest to operate; separate schemas or databases suit stricter isolation requirements at a higher operational cost. The decision is recorded with its reasoning because reversing it later is expensive.",
      },
      {
        question: "What are the recurring costs?",
        answer:
          "Hosting, database, object storage, transactional email, the billing provider's fees and monitoring, all of which scale with usage. We estimate them against expected volumes before launch so the pricing model can be checked against the cost of serving a customer.",
      },
    ],
    related: [
      { label: "Web Application Development", href: "/services/web-development/" },
      { label: "QA and Software Testing", href: "/services/qa-testing/" },
      { label: "Technology Approach", href: "/technologies/" },
    ],
    cta: { label: "Discuss Your SaaS Product" },
  },

  {
    slug: "mvp-development",
    group: "strategy-and-design",
    h1: "MVP Development",
    lead: "Turn the most important product assumption into a focused first release. Define what users need to accomplish, which evidence will guide the next decision and what can wait. A minimum viable product is a learning instrument with a deliberately narrow scope, which means the decisions about what to leave out matter at least as much as the decisions about what to build.",
    seo: {
      title: "MVP Development",
      description:
        "Define and build a focused MVP with clear user journeys, release boundaries, learning goals and a practical path to the next version.",
    },
    businessProblems: [
      "The product idea is clear but the riskiest assumption behind it has never been tested with a real user.",
      "A backlog has grown to cover every eventuality, and nobody can say which items the first release actually requires.",
      "Investment decisions are waiting on evidence that only a working product in front of users can produce.",
      "An earlier prototype demonstrated the idea but cannot be operated or extended.",
    ],
    goodFit: [
      "There is a specific assumption whose answer would change what you build next.",
      "A small group of real users can be reached to try the result.",
      "The team is prepared to act on an answer they did not want.",
    ],
    poorFit: [
      "The product is already validated and the real need is a production build with proper operational scope.",
      "The scope cannot be reduced because every feature is said to be essential, which usually means the hypothesis is undefined.",
      "Regulatory or safety requirements mean the smallest useful version is not actually small.",
    ],
    sections: [
      {
        heading: "Hypothesis and audience",
        id: "hypothesis-and-audience",
        body: [
          "Begin with the assumption most likely to be wrong and most expensive if it is. Name the people who will test it, how they will be reached, and what result would cause you to change direction. An MVP without a stated hypothesis becomes a small version of the full product rather than an experiment.",
        ],
      },
      {
        heading: "Minimum useful scope",
        id: "minimum-useful-scope",
        body: [
          "The first release covers the smallest set of workflows that lets a real user complete the core task and form a genuine opinion. Everything else is recorded and deferred, including the technical shortcuts taken, so the decision to repay them later is deliberate.",
          "A prototype and a production MVP are different things. A prototype demonstrates an idea and is discarded; an MVP is operated by real users and therefore needs real authentication, real data handling and a real deployment.",
        ],
      },
      {
        heading: "Learning plan",
        id: "learning-plan",
        body: [
          "Decide before launch what you will measure, what counts as a positive result and how long you will observe. Without that agreement in advance, the data gathered after launch tends to be interpreted to support the decision someone already preferred.",
        ],
      },
      {
        heading: "Next release decisions",
        id: "next-release-decisions",
        body: [
          "The MVP ends with a decision: continue, change direction or stop. Each outcome is a successful use of the exercise. The deliverables include the recorded shortcuts and their consequences, so that whichever path is chosen, the next team knows what it inherits.",
        ],
      },
    ],
    capabilities: [
      "Hypothesis definition and prioritisation against commercial risk",
      "Prototype design and user testing before any production build",
      "Scoped production release with real authentication and data handling",
      "Explicit recording of technical shortcuts and their repayment cost",
      "Learning measurement planned before launch rather than after",
    ],
    deliverables: [
      "Prioritised backlog with explicit exclusions",
      "Prototype used for testing",
      "Scoped production release",
      "Learning plan with agreed measures",
      "Record of deferred decisions and technical shortcuts",
    ],
    architectureDecisions: [
      "Which shortcuts are acceptable for a first release and what each would cost to repay, recorded rather than left for the next team to discover.",
      "Whether the MVP codebase is intended to be extended or replaced, because the two imply different standards for the work.",
    ],
    securityNotes: [
      "Security fundamentals cannot be deferred because the product is an MVP: real users mean real credentials and real personal data, so authentication, authorisation and data handling are in scope from the first release even when features are not.",
    ],
    integrations: [
      "Only those integrations the core journey genuinely requires; everything else is deferred by default",
    ],
    scheduleDrivers: [
      "Recruiting real users for testing, which is frequently the slowest step",
      "Stakeholder decisions on what to exclude from the first release",
      "Whether a prototype round precedes the build",
    ],
    engagementNote:
      "A discovery sprint followed by a fixed-scope first release suits most MVPs, because the scope is deliberately bounded. The decision about what comes next should wait for the evidence rather than being committed in the same agreement.",
    exampleWorkflow: {
      kind: "workflow",
      caption: "The core journey a first release has to support end to end.",
      label: "Illustrative — not delivered client work",
      steps: ["Sign up", "Complete core task", "Provide feedback"],
    },
    evidence: [],
    faqs: [
      {
        question: "What is the difference between a prototype and an MVP?",
        answer:
          "A prototype demonstrates an idea to gather reactions and is then discarded; it needs no real data or deployment. An MVP is used by real people to do real work, so it needs authentication, data handling and a deployment that can be operated. Choosing the wrong one wastes either money or credibility.",
      },
      {
        question: "How do we decide what to cut?",
        answer:
          "Work back from the hypothesis. If a feature's absence would not change what a user can tell you about the assumption being tested, it can wait. The difficulty is usually organisational rather than analytical, which is why the exclusions are written down and agreed.",
      },
      {
        question: "Will it need rebuilding later?",
        answer:
          "Sometimes, and that can be the right outcome. What matters is that the shortcuts are recorded with their repayment cost so the choice between extending and replacing is made with information. An MVP whose compromises were never written down is the one that causes trouble.",
      },
      {
        question: "How will we know whether it worked?",
        answer:
          "Agree the measures and the threshold before launch, along with how long you will observe. Deciding afterwards what counts as success is how teams talk themselves into continuing with something the evidence did not support.",
      },
    ],
    related: [
      { label: "UI and UX Design", href: "/services/ui-ux-design/" },
      { label: "SaaS Development", href: "/services/saas-development/" },
      { label: "How We Work", href: "/how-we-work/" },
    ],
    cta: { label: "Plan Your MVP" },
  },

  {
    slug: "api-development-integration",
    group: "ai-and-integration",
    h1: "API Development and Integration",
    lead: "Connect systems through interfaces that are explicit about data, permissions and failure. Define the contract before implementing the exchange. Most integration problems are not coding problems: they are disagreements about which system owns a record, what happens when a message is delivered twice, and who is responsible when the two sides stop agreeing with each other.",
    seo: {
      title: "API Development and Integration",
      description:
        "Plan APIs and integrations with clear data contracts, authentication, versioning, retries and reconciliation between business systems.",
    },
    businessProblems: [
      "The same customer exists in several systems with slightly different details and no agreed authority.",
      "An integration fails quietly, and the discrepancy is found weeks later during a reconciliation.",
      "A third-party rate limit is reached during busy periods and requests are simply lost.",
      "An API version change by a vendor breaks a workflow that nobody had documented as dependent on it.",
    ],
    goodFit: [
      "Two or more systems need to stay consistent and somebody needs to be accountable for that consistency.",
      "You are exposing an interface that other teams or customers will build against.",
      "An existing integration is unreliable and the failure mode is not understood.",
    ],
    poorFit: [
      "A one-off data transfer would do, in which case an export and import is cheaper than an integration.",
      "The source system has no usable interface, which makes the first task a vendor conversation rather than a build.",
      "The business rules the integration would enforce have not been agreed between the departments involved.",
    ],
    sections: [
      {
        heading: "API contracts",
        id: "api-contracts",
        body: [
          "The contract is agreed before implementation: the resources, the fields and their types, the error envelope, the pagination approach and the versioning policy. Writing it first surfaces the disagreements about meaning that otherwise appear during testing, when they are more expensive.",
          "REST and event-driven designs each suit different problems. Synchronous request and response fits a query that needs an immediate answer; events fit a change that several systems need to learn about without the publisher knowing who they are.",
        ],
      },
      {
        heading: "Authentication",
        id: "authentication",
        body: [
          "Every interface states who may call it and how they prove it, with credentials held in a defined place and a rotation procedure that someone owns. Inbound webhooks are signed and checked, and replayed deliveries are recognised rather than processed twice.",
        ],
      },
      {
        heading: "Data mapping",
        id: "data-mapping",
        body: [
          "Mapping is where the real work usually is. The same concept is modelled differently in each system, and the mapping has to state which system is authoritative for each field, what happens to values that have no equivalent, and how conflicts are resolved when both sides have changed.",
        ],
      },
      {
        heading: "Failure and reconciliation",
        id: "failure-and-reconciliation",
        body: [
          "An integration that cannot fail safely will eventually fail unsafely. Operations are made idempotent so a retry is harmless, failures are retried with a bounded schedule, and a reconciliation job compares the two sides and reports the differences rather than assuming they match.",
          "Failed work remains visible with a reference someone can act on, rather than disappearing into a log nobody reads.",
        ],
      },
    ],
    capabilities: [
      "API contract design covering resources, errors, pagination and versioning",
      "REST and event-driven integration patterns applied where each fits",
      "Signed webhook handling with replay protection and idempotency",
      "Data mapping with recorded field-level authority",
      "Retry scheduling, dead-letter handling and reconciliation reporting",
      "Sandbox setup and integration tests against vendor behaviour",
    ],
    deliverables: [
      "OpenAPI contract or equivalent published specification",
      "Integration tests covering success, duplicate delivery and failure",
      "Sandbox environment configuration",
      "Ownership map naming the owner of each credential and endpoint",
      "Reconciliation procedure and its reporting",
    ],
    architectureDecisions: [
      "Synchronous versus event-driven exchange per interface, chosen on whether the caller needs an immediate answer.",
      "Idempotency strategy and the key used, so that a retry after an uncertain response is safe by construction.",
      "Versioning policy and the deprecation period offered to consumers.",
    ],
    securityNotes: [
      "Outbound integrations defend against server-side request forgery: a URL supplied by a user is stored as data and never fetched by the server on the strength of having been submitted.",
      "Inbound webhooks verify the provider's signature and reject replayed deliveries by recording the external event identifier before processing.",
    ],
    integrations: [
      "CRM, ERP, accounting and support platforms",
      "Payment, identity and communication providers",
      "Internal services that need to exchange records reliably",
    ],
    scheduleDrivers: [
      "Vendor sandbox availability and how closely it behaves like production",
      "Quality of the vendor's documentation, which varies widely",
      "Number of fields requiring agreement between the two sides",
      "Rate limits and quotas that constrain the synchronisation design",
    ],
    engagementNote:
      "Integration work suits time and materials more often than fixed scope, because the real complexity is usually discovered in the first contact with the vendor's actual behaviour rather than visible in its documentation.",
    exampleWorkflow: {
      kind: "workflow",
      caption: "A representative event-driven synchronisation with reconciliation.",
      label: "Illustrative — not delivered client work",
      steps: [
        "CRM change",
        "Signed event",
        "Deduplicated update",
        "Reconciliation",
      ],
    },
    evidence: [],
    faqs: [
      {
        question: "What if the vendor's API does not support what we need?",
        answer:
          "That is common and it is better to find out during assessment than during build. The options are usually a different integration point, a scheduled export, a change to the business process, or a conversation with the vendor. Each has a cost, and the assessment states them rather than assuming a way through.",
      },
      {
        question: "How often should systems synchronise?",
        answer:
          "As often as the business decision requires and the rate limits allow. Near-real-time events suit changes someone acts on immediately; a scheduled batch suits reporting. Synchronising more often than anyone uses the data adds cost and failure modes without benefit.",
      },
      {
        question: "How are duplicates prevented?",
        answer:
          "By making the operation idempotent against a stable key, so a retry after an uncertain response updates the same record instead of creating a second one. Deduplicating on a business field such as an email address tends to merge records that should have stayed separate.",
      },
      {
        question: "What happens when the vendor changes its API?",
        answer:
          "Version pinning and a monitored deprecation notice give you warning; integration tests tell you quickly when behaviour has changed anyway. The ownership map matters here, because somebody has to be responsible for reading the vendor's release notes.",
      },
    ],
    related: [
      { label: "Web Application Development", href: "/services/web-development/" },
      { label: "Workflow Automation", href: "/solutions/workflow-automation/" },
      { label: "Technology Approach", href: "/technologies/" },
    ],
    cta: { label: "Discuss Your Integrations" },
  },

  {
    slug: "dedicated-teams",
    group: "application-engineering",
    h1: "Dedicated Development Teams",
    lead: "Add delivery capacity with defined roles, responsibilities and communication. Agree how work is prioritised, reviewed and handed over before a team starts. The arrangements that make additional capacity useful rather than disruptive are organisational rather than technical: who decides what gets built, who reviews the result, and what happens when somebody leaves.",
    seo: {
      title: "Dedicated Development Teams",
      description:
        "Explore dedicated development and staff augmentation models, including role selection, onboarding, communication, billing and continuity.",
    },
    businessProblems: [
      "The roadmap is agreed but the team cannot deliver it in the time available.",
      "A specific skill is needed for a defined period and hiring for it permanently is not justified.",
      "An earlier outsourcing arrangement produced code nobody internally can maintain.",
      "Delivery capacity exists but nobody has agreed who prioritises the work.",
    ],
    goodFit: [
      "There is sustained work for the period of the agreement, not an intermittent set of tasks.",
      "Someone on your side can own prioritisation and answer questions promptly.",
      "Onboarding access can be arranged through your normal process.",
    ],
    poorFit: [
      "The work is a bounded project with a known outcome, which a fixed-scope engagement would serve better.",
      "There is no internal owner for prioritisation, which leaves the team guessing.",
      "The expectation is a fixed output per month, which capacity does not guarantee.",
    ],
    sections: [
      {
        heading: "Role requirements",
        id: "role-requirements",
        body: [
          "Each role is defined by the work it will do, the skills that work genuinely requires and the overlap needed with your team. Only verified skills and actual availability are offered; a profile that overstates either produces a problem in the first fortnight.",
        ],
      },
      {
        heading: "Selection and onboarding",
        id: "selection-and-onboarding",
        body: [
          "You meet the people who will do the work. Onboarding covers access to systems through your own joiner process, an introduction to the codebase and its conventions, and agreement on how questions are asked and answered.",
          "The distinction between a managed dedicated team and staff augmentation is settled before the start. In a dedicated team we manage day-to-day delivery against agreed priorities; in staff augmentation you direct the work and own supervision.",
        ],
      },
      {
        heading: "Delivery governance",
        id: "delivery-governance",
        body: [
          "Prioritisation, review and acceptance are agreed in advance, along with the reporting you receive and its frequency. Capacity provides time; it does not by itself guarantee a fixed quantity of completed work, and an agreement that implies otherwise will disappoint someone.",
        ],
      },
      {
        heading: "Continuity",
        id: "continuity",
        body: [
          "People change. The agreement states notice periods, replacement terms, how handover between people is conducted and how knowledge is documented so it survives the individual. Offboarding removes access through the same process that granted it.",
        ],
      },
    ],
    capabilities: [
      "Role definition matched to the work rather than to a generic profile",
      "Candidate selection with your team involved in the decision",
      "Onboarding to your systems through your own access process",
      "Delivery governance with agreed prioritisation and reporting",
      "Documented handover and offboarding",
    ],
    deliverables: [
      "Staffing plan with named roles and availability",
      "Responsibility matrix covering prioritisation, review and acceptance",
      "Onboarding checklist including access and offboarding",
      "Agreed reporting at an agreed cadence",
    ],
    architectureDecisions: [
      "Whether the team works within your existing conventions and review process or establishes its own, and who arbitrates when the two differ.",
      "How knowledge is documented so that continuity does not depend on one individual remaining available.",
    ],
    securityNotes: [
      "Access is granted through your own joiner process with client approval per system, and offboarding revokes it through the same route rather than relying on an informal request.",
    ],
    integrations: [
      "Your source control, issue tracking and communication tooling, used as your team uses them",
    ],
    scheduleDrivers: [
      "Availability of people with the verified skills required",
      "Speed of your access provisioning and onboarding process",
      "Time-zone overlap needed for the working arrangement",
    ],
    engagementNote:
      "Dedicated teams are billed as a monthly capacity agreement; staff augmentation is billed on time or capacity with you directing the work. Both state availability, replacement terms and the notice period, and neither promises a fixed output per month.",
    exampleWorkflow: {
      kind: "workflow",
      caption: "A representative path from role definition to steady delivery.",
      label: "Illustrative — not delivered client work",
      steps: [
        "Role definition",
        "Selection",
        "Onboarding and access",
        "Prioritised delivery",
        "Reporting and review",
      ],
    },
    evidence: [],
    faqs: [
      {
        question: "Who manages the team day to day?",
        answer:
          "It depends on the model. In a managed dedicated team we handle day-to-day delivery against priorities you set. In staff augmentation you direct the work and own supervision. Agreeing which one applies before the start avoids the common situation where both sides assume the other is managing.",
      },
      {
        question: "How much time-zone overlap is there?",
        answer:
          "That is agreed as part of the arrangement and stated in the agreement rather than left to goodwill. More overlap suits work needing frequent conversation; less can be workable when the interfaces between tasks are clear and questions are batched.",
      },
      {
        question: "What happens if someone has to be replaced?",
        answer:
          "The agreement sets the notice period and the replacement terms, including the handover expected. Documentation requirements exist partly for this reason, so that a change of person is disruptive rather than damaging.",
      },
      {
        question: "Are absences billed?",
        answer:
          "How holiday, sickness and public holidays affect billing is stated in the agreement. Ask for it explicitly rather than inferring it from a monthly rate, since practice varies between suppliers.",
      },
    ],
    related: [
      { label: "Engagement Models", href: "/engagement-models/" },
      { label: "QA and Software Testing", href: "/services/qa-testing/" },
      { label: "How We Work", href: "/how-we-work/" },
    ],
    cta: { label: "Discuss Your Team Requirements" },
  },

  {
    slug: "ui-ux-design",
    group: "strategy-and-design",
    h1: "UI and UX Design",
    lead: "Design the workflows before polishing the screens. Understand users, test key interactions and create interface patterns that development teams can implement consistently. A design that looks finished but has not been tested against a real task tends to produce rework during development, when changing it costs considerably more than it did in a prototype.",
    seo: {
      title: "UI and UX Design",
      description:
        "Explore product UI and UX design, from research and workflows to tested prototypes, accessible components and developer handoff.",
    },
    businessProblems: [
      "An internal tool is disliked and avoided, and nobody has asked the people who use it why.",
      "Each screen was designed separately, so the same action looks and behaves differently in three places.",
      "Development is slowed by interface questions that the designs do not answer.",
      "An accessibility review late in the project has found problems that are structural rather than cosmetic.",
    ],
    goodFit: [
      "There are real users who can be observed or interviewed.",
      "The product has enough surface area that consistency between screens matters.",
      "Accessibility is a requirement rather than an aspiration.",
    ],
    poorFit: [
      "The workflow itself has not been agreed, which makes interface design premature.",
      "Designs are wanted without any access to users, which reduces the work to guesswork.",
      "The real need is a visual refresh of a product whose problems are functional.",
    ],
    sections: [
      {
        heading: "Research",
        id: "research",
        body: [
          "Interviews and observation establish what people are actually trying to do, which is frequently different from what the feature request describes. Research findings are recorded with enough detail that someone who was not present can see what led to a design decision.",
        ],
      },
      {
        heading: "Information architecture",
        id: "information-architecture",
        body: [
          "Task flows and content structure come before layout. Getting the structure right makes the screens easier to design and considerably easier to extend, because new functionality has an obvious place to live.",
        ],
      },
      {
        heading: "Prototyping",
        id: "prototyping",
        body: [
          "Prototypes are tested against real tasks with people who resemble the intended users. Testing produces findings that change the design, which is the point; a prototype that survives testing unchanged usually means the tasks were too easy.",
          "Prototypes use realistic but fabricated data. Production customer records do not belong in a design file.",
        ],
      },
      {
        heading: "Design system and handoff",
        id: "design-system-and-handoff",
        body: [
          "Components are specified with their states — default, hover, focus, pressed, disabled, loading, empty, error — along with the tokens that define colour, spacing and type. Handoff includes annotated acceptance criteria so a developer can tell whether an implementation is correct without asking.",
        ],
        points: [
          "Design tokens for colour, typography, spacing, radius and elevation",
          "Component specifications with every interaction state",
          "Accessibility annotations covering focus order, labels and contrast",
          "Acceptance criteria written against observable behaviour",
        ],
      },
    ],
    capabilities: [
      "User interviews and task observation",
      "Task flow and information architecture design",
      "Wireframing and interactive prototyping",
      "Usability testing with findings recorded and actioned",
      "Design token and component system definition",
      "Accessibility annotation and contrast verification",
    ],
    deliverables: [
      "Design files with the agreed screens and flows",
      "Design tokens in a form developers can consume",
      "Component specifications covering interaction states",
      "Annotated acceptance criteria",
      "Usability findings with the resulting decisions",
    ],
    architectureDecisions: [
      "Which patterns become shared components and which remain specific to one screen, since over-generalising a component early is as costly as duplicating it.",
      "How design tokens are expressed so they can be consumed directly by the implementation rather than transcribed by hand.",
    ],
    securityNotes: [
      "Prototypes use realistic fabricated data rather than production customer records, because design files are shared more widely and retained longer than the systems the data came from.",
    ],
    integrations: [
      "The implementation's component library, so that tokens and specifications are consumed rather than re-entered",
    ],
    scheduleDrivers: [
      "Access to users for research and testing, usually the longest lead time",
      "Number of distinct roles and journeys in scope",
      "Review and decision turnaround on each round",
    ],
    engagementNote:
      "Design work is often scoped as a discovery sprint producing a tested prototype and a component specification, after which the build is scoped with far better information than it would otherwise have had.",
    exampleWorkflow: {
      kind: "workflow",
      caption: "A representative design cycle from research to specification.",
      label: "Illustrative — not delivered client work",
      steps: [
        "Research",
        "Task map",
        "Prototype",
        "Test",
        "Revision",
        "Component specification",
      ],
    },
    evidence: [],
    faqs: [
      {
        question: "What if we cannot give you access to users?",
        answer:
          "Then we say so and work with proxies — support tickets, internal staff who speak to customers, analytics where it exists — while being explicit that the findings are weaker. Designing without any contact with the people who will use the result is possible, but the risk should be acknowledged rather than hidden.",
      },
      {
        question: "Can you do design without the build?",
        answer:
          "Yes. Handoff is built for it: tokens, component specifications with states, and annotated acceptance criteria that another team can implement. It helps if their developers join the final review so that questions surface before the designs are considered final.",
      },
      {
        question: "How is accessibility handled?",
        answer:
          "It is designed in rather than audited afterwards: contrast checked against the actual surfaces, focus order defined, labels specified, and no interaction that depends on dragging or on colour alone. Retrofitting accessibility onto a finished design is the expensive route.",
      },
      {
        question: "What do developers receive?",
        answer:
          "Design files, tokens in a consumable format, component specifications covering each interaction state, and acceptance criteria written against observable behaviour. The aim is that an implementer can tell whether a screen is correct without needing to ask the designer.",
      },
    ],
    related: [
      { label: "MVP Development", href: "/services/mvp-development/" },
      { label: "Web Application Development", href: "/services/web-development/" },
      { label: "QA and Software Testing", href: "/services/qa-testing/" },
    ],
    cta: { label: "Plan Product Design" },
  },

  {
    slug: "qa-testing",
    group: "quality-and-support",
    h1: "QA and Software Testing",
    lead: "Make release confidence depend on evidence rather than on hope. Define the important user journeys, failure modes and non-functional requirements, then test them against agreed acceptance criteria. Testing everything equally is neither possible nor useful, so the plan starts from business risk and concentrates effort where a defect would actually cost something, leaving the rest explicitly uncovered rather than quietly so.",
    seo: {
      title: "QA and Software Testing",
      description:
        "Plan software testing around business risk, critical journeys, regression coverage and clear evidence for release decisions.",
    },
    businessProblems: [
      "Releases are followed by a period of firefighting because nobody knows what the change affected.",
      "A test suite exists but it is slow, unreliable and routinely ignored.",
      "Defects are found by customers rather than before release.",
      "Nobody can state what evidence a release decision was based on.",
    ],
    goodFit: [
      "The application has journeys whose failure has a real commercial or operational cost.",
      "There is an intention to act on the findings rather than to collect a report.",
      "Release decisions need to be defensible to someone outside the team.",
    ],
    poorFit: [
      "The requirement is a security penetration test, which is a specialist engagement with different skills.",
      "The application is a throwaway prototype whose defects carry no consequence.",
      "Automated coverage is wanted as a percentage target rather than as risk reduction.",
    ],
    sections: [
      {
        heading: "Risk-based test plan",
        id: "risk-based-test-plan",
        body: [
          "The plan ranks journeys and failure modes by the cost of getting them wrong, then allocates effort accordingly. A checkout path, a permission boundary and a data migration deserve more attention than a settings screen, and saying so explicitly is more honest than implying uniform coverage.",
        ],
      },
      {
        heading: "Automation",
        id: "automation",
        body: [
          "Automation is applied where it repays its maintenance cost: regression paths that are run often and checks that are tedious and error-prone by hand. Tests that merely assert static content equals itself add maintenance without adding confidence, and are not written.",
        ],
      },
      {
        heading: "Cross-platform coverage",
        id: "cross-platform-coverage",
        body: [
          "The supported browser, device and assistive-technology matrix is agreed rather than assumed, and testing covers it. Accessibility testing combines automated scanning with keyboard and screen-reader journeys, because the automated portion finds only a fraction of real barriers.",
        ],
        points: [
          "Functional and integration coverage over the ranked journeys",
          "Regression coverage maintained as the product changes",
          "Accessibility testing by keyboard and screen reader, not scanning alone",
          "Performance testing against stated budgets under representative load",
        ],
      },
      {
        heading: "Release evidence",
        id: "release-evidence",
        body: [
          "A release report states what was tested, what passed, what remains open and what risk is being accepted. That makes the release decision a decision rather than a hope, and gives whoever approves it something to approve.",
        ],
      },
    ],
    capabilities: [
      "Risk-based test planning against business impact",
      "Functional, integration and regression test design",
      "Test automation where it repays its maintenance cost",
      "Accessibility testing combining automated scans with manual journeys",
      "Performance testing against agreed budgets",
      "Release evidence and residual-risk reporting",
    ],
    deliverables: [
      "Test strategy covering scope, approach and exclusions",
      "Test cases traceable to requirements",
      "Automated suites where appropriate, with their maintenance owner",
      "Defect reports with reproduction steps",
      "Residual-risk report supporting the release decision",
    ],
    architectureDecisions: [
      "Where each check belongs in the pyramid, so the suite stays fast enough that people keep running it.",
      "Which environments tests run against, and how test data is produced without using production customer records.",
    ],
    securityNotes: [
      "Test environments and fixtures use synthetic data; production customer records are not copied into them. Specialist penetration testing is named explicitly as in or out of scope rather than implied by the phrase security testing.",
    ],
    integrations: [
      "Continuous integration pipelines, so results gate merges rather than arriving afterwards",
      "Issue tracking, so defects carry reproduction steps and an owner",
    ],
    scheduleDrivers: [
      "Breadth of the supported platform matrix",
      "Stability of the environment under test",
      "Availability of representative test data",
      "Whether existing automated coverage can be built on or needs replacing",
    ],
    engagementNote:
      "QA fits either as part of a delivery engagement or as a separate assessment of an existing product. An assessment is typically a bounded piece of work producing a strategy, initial coverage and a residual-risk report.",
    exampleWorkflow: {
      kind: "workflow",
      caption: "A representative path from requirement to verified release.",
      label: "Illustrative — not delivered client work",
      steps: [
        "Requirement",
        "Test",
        "Execution",
        "Defect",
        "Fix verification",
        "Release report",
      ],
    },
    evidence: [],
    faqs: [
      {
        question: "How much should be automated?",
        answer:
          "Enough that the regression paths people rely on are checked on every change, and no more than the team can maintain. A large suite that is slow or flaky gets ignored, which is worse than a smaller suite that is trusted. Coverage percentage is a poor target on its own.",
      },
      {
        question: "Can you work with an existing codebase?",
        answer:
          "Yes. The first step is an assessment of what coverage exists and whether it is trustworthy, because inherited suites frequently contain tests that pass regardless of the behaviour they claim to check. It is sometimes faster to replace a suite than to repair it.",
      },
      {
        question: "Does this include security testing?",
        answer:
          "We cover security-relevant functional behaviour such as authorisation boundaries and input validation. Specialist penetration testing is a different engagement with different skills, and we will say so rather than implying coverage we are not providing.",
      },
      {
        question: "Who decides whether to release?",
        answer:
          "You do. QA supplies the evidence and the residual-risk report; the release decision belongs to the accountable owner. Testing that pretends to make the decision tends to be either over-cautious or quietly overruled.",
      },
    ],
    related: [
      { label: "Web Application Development", href: "/services/web-development/" },
      { label: "Software Maintenance", href: "/services/software-maintenance/" },
      { label: "Technology Approach", href: "/technologies/" },
    ],
    cta: { label: "Discuss Software Quality" },
  },

  {
    slug: "software-maintenance",
    group: "quality-and-support",
    h1: "Software Maintenance",
    lead: "Keep an existing application understandable and operable after release. Define responsibility for defects, dependencies, infrastructure and changes rather than treating every request as the same type of support. The distinction between a defect, an operational incident and a request for new functionality decides who pays, how quickly it is handled and who approves the work.",
    seo: {
      title: "Software Maintenance",
      description:
        "Explore software maintenance for existing applications, including assessment, defect handling, dependency updates and agreed support coverage.",
    },
    businessProblems: [
      "The original developers are gone and nobody is confident changing the application.",
      "Dependencies have not been updated for long enough that updating them is now a project.",
      "Every request is treated as urgent because there is no agreed way to classify them.",
      "Nobody can say whether the backups work, because a restore has never been attempted.",
    ],
    goodFit: [
      "The application is in use and expected to remain so.",
      "There is a budget for continuing operation rather than only for new features.",
      "Access to the code, the infrastructure and the accounts can be arranged.",
    ],
    poorFit: [
      "The application is being retired shortly, which makes stabilisation cheaper than maintenance.",
      "The real requirement is substantial new functionality, which is a development engagement.",
      "Access to the source or the hosting cannot be obtained, which makes responsible maintenance impossible.",
    ],
    sections: [
      {
        heading: "Takeover assessment",
        id: "takeover-assessment",
        body: [
          "Taking over an unfamiliar application starts with an assessment: what it does, what it depends on, how it is deployed, what is monitored and what is undocumented. The assessment produces a service inventory and an honest statement of what is not yet understood.",
          "Restoring from a backup into an isolated environment is part of this, because a backup that has never been restored is an assumption rather than a control.",
        ],
      },
      {
        heading: "Maintenance scope",
        id: "maintenance-scope",
        body: [
          "The agreement states what is covered: defect correction, dependency updates, infrastructure operation, backups, monitoring and a contracted allowance for small changes. Anything outside that is quoted separately, which is fairer to both sides than an open-ended commitment nobody can price.",
        ],
      },
      {
        heading: "Triage",
        id: "triage",
        body: [
          "Incoming requests are classified before they are worked on. A defect is behaviour that differs from what was agreed; an incident is a loss of service; an enhancement is new functionality. Each has a different route, a different urgency and a different approval.",
        ],
      },
      {
        heading: "Planned upgrades",
        id: "planned-upgrades",
        body: [
          "Dependency and platform updates are scheduled rather than deferred until they become urgent. A regular small update is routine; three years of deferred updates applied at once is a migration project with its own risk.",
        ],
      },
    ],
    capabilities: [
      "Takeover assessment of an unfamiliar application",
      "Defect triage, correction and verification",
      "Scheduled dependency and platform updates",
      "Infrastructure operation, backups and tested restoration",
      "Logging and monitoring with defined alert ownership",
      "Contracted small changes within an agreed allowance",
    ],
    deliverables: [
      "Service inventory covering components, dependencies and accounts",
      "Runbook for routine and exceptional operations",
      "Maintained backlog with classified items",
      "Support terms stating coverage, exclusions and escalation",
      "Periodic reporting on defects, updates and incidents",
    ],
    architectureDecisions: [
      "Which parts of an inherited system are stabilised as they are and which are changed, decided against the remaining life of the application.",
      "Update cadence per dependency class, balancing the risk of changing against the risk of falling behind.",
    ],
    securityNotes: [
      "Unsupported dependencies are identified during assessment and given an explicit plan, since a component no longer receiving security updates is a standing risk rather than a technical-debt item.",
      "Historical access is reviewed at takeover: credentials belonging to people who have left are a common finding and are revoked as part of the handover rather than later.",
    ],
    integrations: [
      "Your issue tracking, so classification and status are visible to you",
      "Monitoring and alerting, with a named primary and backup owner",
    ],
    scheduleDrivers: [
      "Condition and documentation of the inherited application",
      "How far behind the dependencies are at takeover",
      "Access provisioning to code, infrastructure and vendor accounts",
      "Whether third-party components are still supported",
    ],
    engagementNote:
      "Maintenance is contracted as an agreed coverage fee stating the service inventory, included hours, priorities, exclusions, escalation and renewal terms. Response and resolution commitments appear only where staffing and the contract actually support them.",
    exampleWorkflow: {
      kind: "workflow",
      caption: "A representative path from report to verified release.",
      label: "Illustrative — not delivered client work",
      steps: [
        "Ticket",
        "Classification",
        "Assessment",
        "Approval",
        "Fix",
        "Verification",
        "Release",
      ],
    },
    evidence: [],
    faqs: [
      {
        question: "Can you maintain an application you did not build?",
        answer:
          "Yes, starting with a takeover assessment covering what it does, what it depends on and what is undocumented. The assessment states what is not yet understood rather than implying full command of an unfamiliar system from the first week.",
      },
      {
        question: "What counts as a defect rather than an enhancement?",
        answer:
          "A defect is behaviour that differs from what was agreed; an enhancement is new or changed behaviour. The boundary is occasionally genuinely unclear, which is why the agreement names who decides and what happens when the two sides disagree.",
      },
      {
        question: "What are the coverage hours?",
        answer:
          "Stated in the agreement, including the timezone and any escalation route outside them. We do not publish response commitments the staffing does not support; a maintenance arrangement that promises round-the-clock cover it cannot deliver helps nobody.",
      },
      {
        question: "What happens when a third party has an outage?",
        answer:
          "We confirm the cause, communicate the effect and apply whatever mitigation the application supports. We cannot resolve a vendor's outage, and the agreement separates our responsibilities from theirs so expectations are clear before one happens.",
      },
    ],
    related: [
      { label: "Support", href: "/support/" },
      { label: "QA and Software Testing", href: "/services/qa-testing/" },
      { label: "Technology Approach", href: "/technologies/" },
    ],
    cta: { label: "Discuss Maintenance" },
  },
];

/** Validated at module load — an invalid record fails the build, not a review. */
export const serviceRecords: Service[] = records.map((record) =>
  serviceSchema.parse(record),
);

/** Section 13 module 6 / section 26 — the five service groups, in hub order. */
export const serviceGroups = [
  {
    id: "strategy-and-design",
    title: "Strategy and design",
    summary: "Translate user needs into a prioritised product plan.",
  },
  {
    id: "application-engineering",
    title: "Application engineering",
    summary: "Build the interfaces, services and data model.",
  },
  {
    id: "ai-and-integration",
    title: "AI and integration",
    summary: "Connect systems and introduce evaluated automation.",
  },
  {
    id: "cloud-and-modernization",
    title: "Cloud and modernization",
    summary: "Plan releases, infrastructure and system change.",
  },
  {
    id: "quality-and-support",
    title: "Quality and support",
    summary: "Test, maintain and extend the software.",
  },
] as const;
