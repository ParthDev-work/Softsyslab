import { solutionSchema, type Solution } from "@/lib/content/schemas";

/**
 * Solution records — PRD section 15.
 *
 * Section 11 marks every solution page P1, but the Solutions hub is P0 and
 * section 10 requires every published page to have a useful onward path. The
 * four solutions below are therefore promoted into this build, each chosen
 * because it maps onto a P0 service that is already published, so no new
 * capability is implied by their presence.
 *
 * Section 15: "No results or industry experience are implied by illustrative
 * use cases." Each sample flow carries the illustrative label.
 */

const records: Solution[] = [
  {
    slug: "customer-portals",
    h1: "Customer Portals",
    lead: "Give customers a clear place to submit requests, review progress and access the information they are authorised to see. A portal replaces the status email and the chased phone call with a record each side can read, which reduces support load only if the authorisation model is right and the notifications are worth receiving.",
    seo: {
      title: "Customer Portals",
      description:
        "Plan a customer portal covering journeys, account permissions, document access, notifications and the handoff into your support process.",
    },
    currentState: [
      "Customers email or call for status updates, and staff spend much of the day answering questions the system could answer.",
      "Documents are sent as attachments, so neither side is certain which version is current.",
      "Requests arrive through several channels and are tracked in whichever one the recipient prefers.",
      "There is no reliable record of what a customer was told, or when.",
    ],
    sections: [
      {
        heading: "Customer journeys",
        id: "customer-journeys",
        body: [
          "A portal earns its place when it lets a customer finish something: submit a request, check progress, download a document, approve a step. Journeys are designed around those completions rather than around a dashboard of information nobody asked for.",
          "The first question is what a customer most often contacts you about. If the portal answers that, it will be used; if it answers something else, it becomes another system to maintain.",
        ],
      },
      {
        heading: "Account permissions",
        id: "account-permissions",
        body: [
          "Customer organisations have several people with different entitlements, and the invitation model has to reflect that. Who may invite a colleague, who may approve, and what a departing employee loses access to are decisions made at design time rather than discovered after a complaint.",
          "Every request is authorised against the acting user and their organisation. An identifier that is hard to guess is not an access control.",
        ],
      },
      {
        heading: "Documents and requests",
        id: "documents-and-requests",
        body: [
          "Document access is scoped per organisation and recorded, with downloads issued through short-lived links rather than public URLs. Requests carry a status history so both sides can see what happened and when, which is what removes the chasing email.",
        ],
      },
      {
        heading: "Support handoff",
        id: "support-handoff",
        body: [
          "A portal does not replace your support process; it feeds it. The handoff states which requests route to which team, what information travels with them, and how a customer is told that something has moved. Without that, the portal becomes a place where requests are filed and forgotten.",
        ],
      },
    ],
    roles: [
      {
        role: "Customer administrator",
        scope: "Invites colleagues, manages their access and sees everything belonging to their organisation.",
      },
      {
        role: "Customer user",
        scope: "Submits and tracks their own requests and reads the documents shared with their organisation.",
      },
      {
        role: "Staff reviewer",
        scope: "Works the request queue, changes status and records notes against an audit trail.",
      },
      {
        role: "Operations administrator",
        scope: "Manages organisations, entitlements and routing rules, with changes recorded.",
      },
    ],
    modules: [
      "Invitation and organisation membership management",
      "Request submission with status history",
      "Scoped document access with short-lived download links",
      "Notification preferences per user",
      "Staff queue with assignment and audit trail",
    ],
    integrations: [
      "Identity provider for customer sign-in, including single sign-on where a customer requires it",
      "Your existing support or ticketing system, so the portal feeds it rather than competing with it",
      "Document storage, with access scoped per organisation",
    ],
    dataAndSecurity: [
      "Customer data isolation is enforced on every query path and verified by tests that attempt a cross-organisation read and expect it to fail.",
      "Document downloads are issued as short-lived signed links after an authorisation check, never as public URLs whose only protection is obscurity.",
      "Notification content carries a protected link rather than the record itself, so an email forwarded outside the organisation discloses nothing.",
    ],
    rollout: [
      "Start with the single request type that generates the most contact, and measure whether contact falls.",
      "Onboard a small set of customer organisations before opening it generally, so the invitation flow is exercised by real people.",
      "Keep the existing channel open during the transition, and retire it only once the portal is genuinely answering the question.",
    ],
    sampleFlow: {
      kind: "workflow",
      caption: "A representative request journey through a customer portal.",
      label: "Illustrative — not delivered client work",
      steps: [
        "Invitation accepted",
        "Request submitted",
        "Staff review",
        "Document shared",
        "Status closed",
      ],
    },
    faqs: [
      {
        question: "How should customers sign in?",
        answer:
          "Email and password with multi-factor authentication suits most portals; larger customers frequently ask for single sign-on against their own identity provider. Decide early whether single sign-on is needed at launch, because it affects the account model rather than being a setting.",
      },
      {
        question: "How is one customer's data kept from another?",
        answer:
          "By enforcing the organisation boundary on every query rather than relying on the interface not offering a link. That boundary is verified by automated tests that attempt a cross-organisation read, because this class of defect is invisible in ordinary use and serious when found.",
      },
      {
        question: "Will it reduce support contact?",
        answer:
          "Only if it answers the question people actually contact you about. That is worth establishing from your support records before the build, because a portal built around the wrong journey adds a system to maintain without removing the calls.",
      },
    ],
    related: [
      { label: "Web Application Development", href: "/services/web-development/" },
      { label: "UI and UX Design", href: "/services/ui-ux-design/" },
      { label: "Security Practices", href: "/security/" },
    ],
    cta: { label: "Plan a Customer Portal" },
  },

  {
    slug: "internal-tools",
    h1: "Internal Business Tools",
    lead: "Replace a fragmented operational workflow with a tool built around the people responsible for the work. Internal tools are judged by whether they make a job faster and less error-prone, which means the people who do that job have to be involved in the design rather than consulted once the screens are finished.",
    seo: {
      title: "Internal Business Tools",
      description:
        "Plan an internal operations tool around staff tasks, role permissions, validated data entry, reporting and the training needed to adopt it.",
    },
    currentState: [
      "The process runs across several spreadsheets, and the authoritative copy is whichever one was edited last.",
      "The same information is re-entered into more than one system, which guarantees that the two will disagree.",
      "Nobody can see the current state of a job without asking the person responsible for it.",
      "Reporting is assembled by hand each month from sources that do not reconcile.",
    ],
    sections: [
      {
        heading: "Staff tasks",
        id: "staff-tasks",
        body: [
          "Design starts from what each person does in a day and where the current process costs them time. Watching the work is more informative than asking about it, because the workarounds people have built are usually invisible to the person who commissioned the tool.",
          "Speed matters more in an internal tool than in most software. If a task that took two minutes in a spreadsheet takes three in the new system, it will be worked around.",
        ],
      },
      {
        heading: "Role permissions",
        id: "role-permissions",
        body: [
          "A role matrix states who may read, create, change and approve each record type. Internal tools frequently hold the whole operational picture, so broad access is convenient and risky in equal measure; the matrix makes the trade-off explicit rather than accidental.",
        ],
      },
      {
        heading: "Data entry and validation",
        id: "data-entry-and-validation",
        body: [
          "Validation catches the mistakes that matter without obstructing legitimate exceptions, which real operations always have. Bulk actions carry a confirmation that states what is about to happen, and destructive operations are recoverable where the data permits.",
          "Accessibility is part of this: an operational tool used all day by staff has to work with a keyboard and with assistive technology, which is both a legal consideration and a usability one.",
        ],
        points: [
          "Field validation that prevents errors without blocking genuine exceptions",
          "Bulk actions with an explicit confirmation of scope",
          "Soft deletion where recovery is useful and permitted",
          "Export permissioned separately from read access",
        ],
      },
      {
        heading: "Reporting and training",
        id: "reporting-and-training",
        body: [
          "Reports are built on consistent underlying records, with their definitions visible so two people reading the same number agree on what it means. Training and operating documentation accompany release, because an internal tool that nobody has been shown how to use will be judged a failure for reasons that have nothing to do with the software.",
        ],
      },
    ],
    roles: [
      {
        role: "Operational user",
        scope: "Works the queue, creates and updates records and completes the day-to-day tasks.",
      },
      {
        role: "Supervisor",
        scope: "Assigns work, approves exceptions and sees the state of the team's workload.",
      },
      {
        role: "Administrator",
        scope: "Manages users, roles and reference data, with every change recorded.",
      },
    ],
    modules: [
      "Record management with validation and audit history",
      "Queue, assignment and approval workflow",
      "Bulk actions with confirmation and recoverable deletion",
      "Permissioned export",
      "Operational reporting with visible metric definitions",
    ],
    integrations: [
      "Identity provider, so access follows your existing joiner and leaver process",
      "The systems that remain authoritative for their own records, read rather than duplicated",
      "Notification channels the team already uses",
    ],
    dataAndSecurity: [
      "Export is permissioned separately from read access and is recorded, because an operational tool usually holds enough in one place to matter if it leaves.",
      "Exported files are protected against spreadsheet formula injection, since a value beginning with an equals sign in a downloaded report is executable in most spreadsheet applications.",
      "Audit records capture the actor, the action and a safe summary of the change, without logging the full contents of sensitive records.",
    ],
    rollout: [
      "Migrate one workflow rather than all of them, and keep the spreadsheet available read-only until the replacement is trusted.",
      "Run both in parallel for a defined period with a named owner deciding when to switch.",
      "Train the supervisors first so there is someone in the room who can answer questions.",
    ],
    sampleFlow: {
      kind: "workflow",
      caption: "A representative operational path through an internal tool.",
      label: "Illustrative — not delivered client work",
      steps: [
        "Record created",
        "Validation",
        "Assignment",
        "Approval",
        "Reported",
      ],
    },
    faqs: [
      {
        question: "Can our spreadsheets be migrated?",
        answer:
          "Usually, but the migration is rarely the hard part. The hard part is that spreadsheets tolerate inconsistency a database will not, so the exercise surfaces contradictions that have to be resolved by someone who knows the business. Budget time for those decisions rather than only for the import.",
      },
      {
        question: "Who administers it afterwards?",
        answer:
          "Name that person before launch. Internal tools need someone who can add users, adjust reference data and answer questions, and a tool without an owner degrades quickly. The administrator interface is designed for them rather than for a developer.",
      },
      {
        question: "What if the process changes?",
        answer:
          "Operational processes always do. Reference data, routing rules and validation thresholds are built to be changed by an administrator rather than by a release, so the common kinds of change do not require development work.",
      },
    ],
    related: [
      {
        label: "Custom Software Development",
        href: "/services/custom-software-development/",
      },
      { label: "Workflow Automation", href: "/solutions/workflow-automation/" },
      { label: "QA and Software Testing", href: "/services/qa-testing/" },
    ],
    cta: { label: "Discuss an Internal Tool" },
  },

  {
    slug: "startup-products",
    h1: "Startup Product Development",
    lead: "Turn a product idea into a sequence of decisions, prototypes and releases that can be evaluated by real users. The useful question at the start is not what the product should eventually do, but which single assumption would most change the plan if it turned out to be wrong, and what the cheapest honest test of it would be.",
    seo: {
      title: "Startup Product Development",
      description:
        "Turn a product idea into decisions, prototypes and releases real users can evaluate, with clear learning criteria at each step.",
    },
    currentState: [
      "The idea is well articulated but has never been put in front of someone who would have to pay for it.",
      "A plan exists for a full product, and the first release is defined by what can be afforded rather than by what needs testing.",
      "Investor or board conversations need evidence that only real usage can supply.",
      "The founding team disagrees about who the first customer is, and the disagreement has not been made explicit.",
    ],
    sections: [
      {
        heading: "Identify the first user",
        id: "identify-the-first-user",
        body: [
          "A product for everyone is a product for nobody at this stage. Naming the first user specifically — their role, their current workaround, what it costs them — makes every later decision easier, because there is someone concrete to decide on behalf of.",
          "Where the founding team disagrees about this, surfacing the disagreement early is worth more than any amount of design work built on an unstated assumption.",
        ],
      },
      {
        heading: "Decide the first release",
        id: "decide-the-first-release",
        body: [
          "The first release covers the smallest set of workflows that lets the named user complete the core task and form a real opinion. Everything else is written down and deferred, including the technical shortcuts, so the choice to repay them later is made deliberately.",
        ],
      },
      {
        heading: "Test the core journey",
        id: "test-the-core-journey",
        body: [
          "The core journey is tested with real people before it is built, as a prototype, and again after release, as a product. What counts as a positive result is agreed beforehand, because the alternative is interpreting whatever happens as confirmation of the plan.",
        ],
      },
      {
        heading: "Plan the next investment",
        id: "plan-the-next-investment",
        body: [
          "The exercise ends in a decision: continue, change direction or stop. Each is a legitimate result. What makes the decision possible is having agreed in advance what evidence would support each one.",
        ],
      },
    ],
    roles: [
      {
        role: "Founder or product owner",
        scope: "Owns the hypothesis, decides what is excluded and supplies the domain knowledge.",
      },
      {
        role: "Delivery team",
        scope: "Designs, builds and releases the scoped first version and records the shortcuts taken.",
      },
      {
        role: "Test participants",
        scope: "Real prospective users who attempt the core journey and report what happened.",
      },
    ],
    modules: [
      "Hypothesis and first-user definition",
      "Prototype covering the core journey",
      "Scoped first release with real authentication and data handling",
      "Feedback capture with the agreed measures",
      "Record of deferred decisions and technical shortcuts",
    ],
    integrations: [
      "Only those the core journey genuinely requires; everything else is deferred by default",
    ],
    dataAndSecurity: [
      "A first release used by real people handles real credentials and real personal data, so authentication, authorisation and data handling are in scope from the start even where features deliberately are not.",
    ],
    rollout: [
      "Prototype and test before building, because a finding at that stage costs a conversation rather than a sprint.",
      "Release to a small named group who have agreed to give feedback, not to an open launch.",
      "Review against the agreed measures at a date set in advance, and make the continue-or-change decision then.",
    ],
    sampleFlow: {
      kind: "workflow",
      caption: "A representative path from hypothesis to a funded decision.",
      label: "Illustrative — not delivered client work",
      steps: [
        "Name the first user",
        "Prototype the core journey",
        "Test with real users",
        "Scoped release",
        "Decide the next investment",
      ],
    },
    faqs: [
      {
        question: "What should we validate first?",
        answer:
          "The assumption that is most likely to be wrong and most expensive if it is. That is often whether anyone has the problem badly enough to change what they currently do, which can sometimes be tested with conversations before any software is built.",
      },
      {
        question: "Who supplies the content?",
        answer:
          "You do, and it is worth planning for. Product copy, onboarding text and any domain-specific material usually need someone who knows the subject, and a first release frequently waits on content rather than on code.",
      },
      {
        question: "What if the test is negative?",
        answer:
          "Then it has done its job at a fraction of the cost of finding out later. A negative result that changes direction is the most valuable outcome this kind of work produces, provided the criteria were agreed before the result was known.",
      },
    ],
    related: [
      { label: "MVP Development", href: "/services/mvp-development/" },
      { label: "UI and UX Design", href: "/services/ui-ux-design/" },
      { label: "Engagement Models", href: "/engagement-models/" },
    ],
    cta: { label: "Plan Your First Release" },
  },

  {
    slug: "workflow-automation",
    h1: "Workflow Automation",
    lead: "Make one recurring workflow repeatable, observable and recoverable. Automation is worth doing when the steps are well understood and the exceptions are handled explicitly; automating a process nobody has described tends to produce a faster version of the existing confusion, with the added difficulty that the logic is now hidden in code.",
    seo: {
      title: "Workflow Automation",
      description:
        "Automate a recurring workflow with defined triggers, approval rules, explicit exception handling, audit records and recovery.",
    },
    currentState: [
      "A recurring process depends on somebody remembering to do a step, and occasionally that person is on holiday.",
      "Work is handed between departments by email, so there is no reliable record of where a request currently sits.",
      "When a step fails, nobody finds out until someone downstream notices the absence.",
      "Exceptions are handled informally, which means the real process is not the documented one.",
    ],
    sections: [
      {
        heading: "Trigger and inputs",
        id: "trigger-and-inputs",
        body: [
          "Automation begins with a defined trigger and a defined set of inputs. A workflow that can be started in three different ways, each supplying slightly different information, is the usual reason an automation behaves inconsistently.",
        ],
      },
      {
        heading: "Rules and approvals",
        id: "rules-and-approvals",
        body: [
          "The rules that route and approve work are stated explicitly and, where they change often, made configurable rather than embedded in code. Approvals record who approved what and when, because that record is frequently the reason the automation was wanted.",
        ],
      },
      {
        heading: "Exceptions",
        id: "exceptions",
        body: [
          "The point of automating is not to pretend exceptions do not occur. Each known exception gets a defined route — a person, a queue, a timeout — and anything unrecognised surfaces visibly rather than being absorbed. An automation that silently drops the cases it was not designed for is worse than the manual process it replaced.",
        ],
      },
      {
        heading: "Audit and recovery",
        id: "audit-and-recovery",
        body: [
          "Every run is recorded with its inputs, its decisions and its outcome. Steps are made idempotent so a retry is safe, duplicates are recognised rather than processed twice, and cancellation has a defined effect on work already in progress.",
          "Failed runs stay visible with a reference someone can act on, and a person can override the automation when the situation requires it.",
        ],
        points: [
          "Idempotent steps so that a retry after an uncertain result is harmless",
          "Duplicate detection against a stable key rather than against a business field",
          "Defined cancellation behaviour for work already in flight",
          "Failed runs visible in a queue with a safe retry action",
        ],
      },
    ],
    roles: [
      {
        role: "Requester",
        scope: "Starts the workflow and can see where their request currently sits.",
      },
      {
        role: "Approver",
        scope: "Reviews items routed to them, with the decision and timestamp recorded.",
      },
      {
        role: "Process owner",
        scope: "Owns the rules, handles exceptions that reach the queue and monitors failures.",
      },
    ],
    modules: [
      "Trigger and input capture with validation",
      "Configurable routing and approval rules",
      "Exception queue with a named owner",
      "Run history with inputs, decisions and outcomes",
      "Retry, duplicate detection and cancellation handling",
    ],
    integrations: [
      "The systems the workflow reads from and writes to, each with defined behaviour when unavailable",
      "Notification channels for approvals and for failures",
    ],
    dataAndSecurity: [
      "Run records capture the decisions and a safe summary of the data rather than the full payload, so an audit trail does not become a second copy of sensitive information.",
      "Permission to approve, to override and to retry are separate, because the ability to rerun a failed step is not the same as the authority to approve the work.",
    ],
    rollout: [
      "Automate one workflow end to end rather than part of several, so the benefit is measurable.",
      "Run it alongside the manual process for a defined period and compare the outcomes before switching.",
      "Name the process owner before go-live; an automation with an exception queue and no owner fails quietly.",
    ],
    sampleFlow: {
      kind: "workflow",
      caption: "A representative automated approval path, including the exception route.",
      label: "Illustrative — not delivered client work",
      steps: [
        "Request received",
        "Rules applied",
        "Approval",
        "Action executed",
        "Exception queue where a rule does not match",
      ],
    },
    faqs: [
      {
        question: "What happens when a step fails?",
        answer:
          "It is retried on a bounded schedule if the failure looks temporary, and otherwise moved to a visible queue with a reference. Failures do not disappear into a log: somebody owns the queue and the system tells them when it is not empty.",
      },
      {
        question: "Can a person override the automation?",
        answer:
          "Yes, and they should be able to. Override is a permitted action with its own permission and its own audit record, because real operations produce situations the rules were not written for and the alternative is people working around the system entirely.",
      },
      {
        question: "What if the same request arrives twice?",
        answer:
          "Duplicate detection works against a stable key supplied with the request rather than against a business field such as an email address, so a genuine second request from the same person is processed and a retry of the first is not.",
      },
    ],
    related: [
      {
        label: "API Development and Integration",
        href: "/services/api-development-integration/",
      },
      { label: "Internal Business Tools", href: "/solutions/internal-tools/" },
      { label: "Software Maintenance", href: "/services/software-maintenance/" },
    ],
    cta: { label: "Map Your Workflow" },
  },
];

/** Validated at module load — an invalid record fails the build, not a review. */
export const solutionRecords: Solution[] = records.map((record) =>
  solutionSchema.parse(record),
);
