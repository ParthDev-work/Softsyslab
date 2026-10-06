# SoftSysLab Corporate Website — Implementation Plan

## Context

`C:\Users\LENOVO\Desktop\Career\Internship\Web3task\softsyslab` currently contains one file: `Software_Development_Company_Website_PRD.pdf` (68 pages, v1.0). This is a greenfield build.

The PRD specifies a corporate website for a custom software development company: 79 planned routes, a managed headless CMS, a PostgreSQL operational database, an outbox worker, transactional email, CRM sync, file uploads with malware scanning, a staff admin console with RBAC, and a P2 client portal. Its central thesis, repeated in §2, §11, §26, §63 and the final audit, is that **a visually complete site with fabricated content or a broken intake process fails the product objective** — publication depends on verified capabilities and approved facts, not a page count.

The company name is **SoftSysLab**. Everything the PRD writes as `[BRAND]` resolves to that; everything it writes as `[LEGAL COMPANY NAME]`, `[JURISDICTION]`, addresses, emails and phone numbers remains unverified and is handled per the decision below.

**Scope decisions made with the user:**

| Decision | Choice |
|---|---|
| Build scope | Frontend only — pages, design system, components. Contact form validates client- and server-side; persistence is a stubbed adapter. No admin console, CRM, uploads, newsletter, or portal. |
| Content source | Typed local TypeScript content modules behind a `lib/content` adapter interface |
| Route scope | P0 set only (~28 routes), no dangling links to unbuilt pages |
| Company facts | Single `siteSettings` module + visible unverified-facts banner; nothing fabricated is presented as real |
| Stack | Next.js App Router + React + TypeScript + Tailwind, hand-built components against the PRD's tokens |

Intended outcome: a server-rendered, accessible, token-driven site covering the verified-capability P0 routes, where the PRD's publication-truth rule is enforced by the build rather than by a review checklist — and where the CMS, database and intake persistence the PRD wants later each slot in behind an interface that already exists.

---

## Two scope conflicts in the PRD, and how this plan resolves them

These need stating up front because they change the route list.

**1. Navigation promises destinations that cannot be published.** PRD §12 lists Industries, Resources and Work in the main navigation row, but §11 marks every industry page P1 pending sector review, gates Resources/blog listings on three approved articles, and gates case studies on real approved work. §12 also says *"never place an unavailable destination in the menu"*, and AC01 requires the Work link be *"omitted or replaced by Process, not routed to an empty gallery."*

Resolution: build navigation from the published-route registry, not a hardcoded list. Industries, Resources and Work are therefore absent from this build's nav; the hero's secondary CTA is **"Explore Our Process"**, not "View Our Work" (§13 module 3). Adding real sector or article content later makes the links appear with no nav code change.

**2. The Solutions hub is P0 but every solution page is P1.** A hub linking nothing violates §10's *"Every published page must have a useful onward path."*

Resolution: promote four solution pages into this build so the hub has real children — **Customer Portals, Internal Business Tools, Startup Product Development, Workflow Automation** — chosen because each maps onto a P0 service already being built, so no new capability is implied. The Technologies hub needs no such promotion: §17 gives it substantive standalone content (selection criteria, application layers, operations, integration boundaries), so it stands alone with its P1 category pages absent.

---

## Route inventory for this build

Reconciled against the §11 sitemap. 28 published routes.

| Routes | PRD IDs | Notes |
|---|---|---|
| `/` | 01 | §13: 19 modules, ~14 published (see below) |
| `/services/` | 02 | §26 hub copy |
| `/services/{custom-software-development, web-development, mobile-app-development, saas-development, mvp-development}/` | 03–07 | §14 shared service contract |
| `/services/{api-development-integration, dedicated-teams, ui-ux-design, qa-testing, software-maintenance}/` | 13–17 | §14 shared service contract |
| `/solutions/` | 22 | §15 hub |
| `/solutions/{customer-portals, internal-tools, startup-products, workflow-automation}/` | 23, 26, 27, 34 | P1 promoted — see conflict 2 |
| `/technologies/` | 49 | §17 hub only; categories P1, omitted |
| `/how-we-work/`, `/engagement-models/`, `/support/`, `/company/`, `/company/business-information/` | 61–65 | §19 |
| `/contact/` | 66 | §20, REQ-LEAD-01 |
| `/careers/` | 71 | §23 truthful empty state: "There are no open roles listed at the moment." No speculative CV collection. |
| `/security/` | 74 | §24 |
| `/privacy/`, `/terms/`, `/cookies/`, `/accessibility/` | 75–78 | §25 — content specification only, flagged as requiring counsel review |

**Built but deliberately withheld:** `/case-studies/` and `/case-studies/[slug]/` templates (IDs 59–60) ship as code with an empty collection; the routes call `notFound()` while empty, per §18 *"No approved work means the public listing and inbound links are withheld, not a fake project gallery."* `/careers/[slug]/` ships the same way.

**Out of scope this pass:** `/industries/*` (35–48), `/technologies/*` categories (50–58), `/request-a-quote/` (67, P1), `/resources/`, `/blog/*` (68–70, gated), `/trust/` (73, P1), `/data-processing/` (79, P1).

**Utility surfaces:** `not-found.tsx`, `error.tsx` with the §58 copy, plus permanent redirects `/company/about/ → /company/` and `/company/careers/ → /careers/` (§11).

---

## Architecture

Directory structure follows PRD §40's suggested layout:

```
app/(marketing)/…            public routes, Server Components
app/api/contact/route.ts     intake handler
components/ui/               primitives: Button, Input, Textarea, Select, Checkbox,
                             Disclosure, Dialog, Breadcrumb, Card, Chip, Pagination
components/blocks/           editorial sections: Hero, SplitSection, CardGrid,
                             ProcessTimeline, FaqList, CtaBanner, ComparisonTable
components/layout/           Header, MegaMenu, MobileMenu, Footer, SkipLink,
                             AnnouncementBar, UnverifiedFactsBanner, ConsentControls
content/                     typed content modules (services, solutions, faqs, …)
lib/content/                 adapter: getService, listServices, getSolution, …
lib/validation/              zod schemas shared by client and server
lib/analytics/               consent-gated event gate (no vendor wired)
lib/seo/                     metadata + JSON-LD builders
lib/settings/                siteSettings — single source of company identity
scripts/validate-content.ts  publication gate, runs in CI and prebuild
```

**Rendering.** Server Components render all content and metadata (§40). Client Components are confined to: mobile/mega menu, consent controls, the contact form, and FAQ disclosures. The root layout stays a Server Component. Static rendering for all marketing routes; the intake route handler is dynamic. Core reading and navigation work with client JavaScript blocked (§40, §53).

**Content adapter is the CMS seam.** Every page reads through `lib/content`, never from `content/` directly. Each collection is a typed module array validated by a zod schema at module load, so a service page missing its poor-fit section or FAQs fails the build rather than shipping thin. Swapping in Sanity or Payload later means implementing the `ContentSource` interface — page components do not change. This is the §34 instruction *"Do not maintain two editable copies of the same content"* honored structurally.

**Single-source identity.** `lib/settings/siteSettings.ts` holds legal name, trading name, jurisdiction, registered address, separately-labelled operating address, business email, support email, phone, social URLs, and a `verified: false` flag with `lastVerifiedAt: null`. Footer, contact page, business-information page and Organization JSON-LD all read from it — satisfying AC05 in one place. Social URLs that are empty are omitted rather than rendered dead (§39).

---

## Implementation phases

### Phase 1 — Foundation and design system

Scaffold Next.js (App Router, TypeScript, Tailwind), ESLint, Prettier, strict `tsconfig`.

Translate §29's token table literally into CSS custom properties on `:root`, then map them into the Tailwind theme so components reference tokens, never raw hex:

- Brand `#1D4ED8`, hover `#1E40AF`, dark anchor `#0F172A`, secondary teal `#0F766E`
- Canvas `#FFFFFF`, alternate `#F8FAFC`, text `#0F172A`, secondary text `#475569`, decorative border `#CBD5E1`, input boundary `#64748B`
- Semantic states with their paired backgrounds, each always accompanied by text or an icon — never color alone
- Spacing scale 4/8/12/16/24/32/48/64/88/112; max width 1200px; reading width 720px
- Radii: controls 8px, cards 12px; elevation flat-border default, `0 8px 24px rgba(15,23,42,.08)` on raised hover
- Controls: 44×44px minimum target, buttons 48px, inputs 48–52px, textarea ≥144px
- Focus: visible 2px high-contrast outline at 3px offset, verified against every surface it lands on
- Motion: 120–180ms hover/focus, ≤240ms disclosure, transform/opacity only; `prefers-reduced-motion` strips non-essential transitions

Typography: self-host Inter (SIL OFL — licensing clears §29's "if licensed/self-hosted" condition), subset Latin, weights 400/500/600/700 only. Body 18/28 desktop and 16/26 mobile; H1 56/64 → 36/42; H2 40/48 → 28/36; H3 24/32 → 22/30.

Build `components/ui` primitives with every state the PRD names explicitly — default, hover, focus, pressed, disabled, loading for buttons; empty, filled, focus, invalid, disabled, read-only for inputs. Loading buttons keep their label and show progress, never a bare spinner (§29). Error text sits beside its field, linked by `aria-describedby`.

Header/MegaMenu/MobileMenu: click and keyboard activation as the contract, hover as enhancement; Escape closes and restores focus; Tab follows document order; **no application-menu ARIA roles on site navigation** (§12). The menu button announces expanded state.

### Phase 2 — Content model, content, and the publication gate

Define zod schemas and TypeScript types for `Service`, `Solution`, `TechnologyHub`, `CorporatePage`, `Faq`, `CaseStudy`, `Job`, `Evidence`. The `Service` schema encodes §14's shared contract as required fields, so the compiler enforces it.

Author the content modules from the PRD's own copy: §13 homepage modules, §14's per-service specifications (opening, sections, architecture decisions, security notes, deliverables, FAQs, related services, CTA, meta description), §15's four promoted solutions, §17's technology hub, §19's company/process/engagement/support pages, §20's contact copy, §23's careers empty state, §24's security sections, §25's policy section skeletons.

Two rules while authoring, both from §13 and §26:
- Technology names, capability lists and practice statements are marked `verified: false` and are **withheld from render** until confirmed — not published with a caveat.
- Illustrative diagrams carry a visible "Illustrative — not delivered client work" label; no stock photography stands in for staff, offices or products.

`scripts/validate-content.ts` is the frontend equivalent of REQ-CONTENT-01 / AC02. It runs in `prebuild` and CI and **fails the build** when a customer-visible field contains `ADD`, `VERIFIED`, `INSERT`, `TODO`, bracketed placeholders, lorem ipsum, or a dummy counter; when a record claims a metric without an `Evidence` reference carrying owner, method and permission; when a `related` link points at an unpublished route; or when an unverified claim is reachable from rendered output. This is a genuine gate, not CSS hiding (§26).

### Phase 3 — Pages

Homepage (§13), 1200px container, 24px desktop / 16px mobile gutters, 88/64/48px section padding, 24px card gaps. Modules 4–7 and 9–14 and 17–19 publish. **Omitted entirely, not stubbed:** module 8 Featured projects (no approved work), module 15 Testimonials (no permission), module 16 Insights (fewer than three approved articles). Module 1 Announcement bar is optional and carries only the §13 process line — no fabricated launch or availability notice. Hero is a 7/5 split, heading ~18 characters per line, 620px text width, original static visual, mobile copy-first, and the hero image is not lazy-loaded when it is the LCP candidate.

Service template (§54 wireframe): breadcrumb → 7/5 hero → 8/4 body with a ~260px sticky anchor list (Problems, Scope, Delivery, Architecture, Engagement, Questions) → alternating capability/process blocks → evidence → FAQ → CTA. Primary CTA in hero, after scope, and at end; no sticky obstructive overlay. Mobile: hero stacks, contents becomes a disclosure, capabilities become single-column cards.

Remaining templates per §54: solutions, technologies hub, corporate pages, contact (8-column form + 4-column next-steps sidebar, legal notice beside submission, never a map before the form), careers, security (anchor list beside factual sections, no decorative shields), policies.

FAQ uses native-semantics accessible disclosure; multiple items may stay open with no forced auto-close; **all answer text is present in rendered HTML** (§13 module 17).

### Phase 4 — Contact intake (frontend-only boundary)

`POST /api/contact` implements the §43 contract fully and the §42 durability contract behind an interface:

- Bounded body parse, origin check, in-memory sliding-window rate limit at 5 attempts / 15 min / IP
- Shared zod schema from `lib/validation` — the same module the client imports, so rules cannot drift
- §20's field table exactly: names 1–100 **Unicode** characters (no Latin-only regex), email ≤254 accepting personal domains, company accepting "Pre-launch", website requiring an HTTPS URL *or* an explicit "No website yet" checkbox, service multi-select capped at 5 with "Not sure", budget with currency and "Need guidance", timeline with "Flexible", summary 30–5000 characters preserving line breaks as plain text
- A submitted URL is **stored as a string and never fetched server-side** (§20, §43, §57)
- Idempotency: `scope + key` map; same key and payload returns the original receipt, same key with a different payload returns 409 (AC08)
- Response envelopes exactly as §43 specifies, with opaque `ENQ-…` references that encode no email or company name
- Status codes per §43: 201, 200 replay, 400, 413, 415, 422, 429 with `Retry-After`, 503

Persistence goes through a `LeadStore` interface whose only implementation in this build appends to a gitignored local JSONL file and logs a safe summary — no PII in logs. The success screen is shown **only** after that write resolves; a store failure returns 503 and the form offers safe retry with inputs preserved (AC09). Swapping in Postgres plus an outbox means implementing `LeadStore`.

Attachments are **not** built. Per REQ-UPLOAD-01, *"otherwise remove attachment UI"* — so no file input appears at all, rather than one that silently discards.

Form behavior: state flow idle → validating → submitting → success/recoverable-error; repeat submission disabled while pending; values preserved on error; an error summary above the form receives focus after invalid submit, each entry linking to its field; errors never depend on color alone (AC07). Success replaces the form with the reference and the three §20 next steps. No response-time target is stated anywhere.

### Phase 5 — Consent, SEO, accessibility, performance

**Consent (§45).** Necessary-only until a choice is saved. Accept all / Reject non-essential / Manage preferences are equally discoverable, with no prechecked optional category. A versioned receipt persists in a first-party necessary cookie, withdrawable from the footer. `lib/analytics` exposes a consent gate that currently fans out to nothing — no vendor is wired in this build — which makes AC15 pass by construction and leaves the gate in place for later.

**SEO (§47).** `generateMetadata` per route from published records; absolute self-canonical on one canonical HTTPS host; lowercase hyphenated routes with one trailing-slash policy. `sitemap.ts` built from the published-route registry only, so withheld routes are structurally excluded. `robots.ts` points to it. JSON-LD: Organization from `siteSettings` and BreadcrumbList on canonical hierarchy. **Deliberately absent:** `FAQPage` (§27 — Google retired FAQ rich results on 7 May 2026 and removed the documentation in June; §47 confirms it is not an objective), `AggregateRating`, review stars, and `Person`/`JobPosting` while no real people or roles are approved. A non-production env flag applies noindex, and a build check fails deployment on accidental global noindex, a broken canonical hostname, a malformed sitemap, or placeholder company schema (AC22).

**Accessibility (§32, REQ-A11Y-01).** WCAG 2.2 AA target: landmarks, skip link, one logical H1 per page, ordered headings, visible labels, meaningful link names, keyboard access throughout. Contrast ≥4.5:1 normal text, 3:1 large text and meaningful UI boundaries. Focus never obscured by the sticky header. No drag-only interaction. Restrained live announcements for submission status. No accessibility overlay. The Accessibility Statement records evaluated scope, testing date and known limitations and **claims no conformance** — the launch target is not a certification (§32).

**Responsive (§31).** Verified at 320, 375, 390, 430, 768, 1024, 1440 and 1920. No fixed card heights. 200% text zoom and reflow at 320 CSS pixels. Default is **no sticky bottom CTA**. Horizontal scroll only for genuine wide data, labelled and keyboard-reachable. No substantive content hidden on mobile to shorten the page.

**Performance (§46).** Budgets: initial compressed JS ≤180KB per key page, initial transfer ≤1.2MB, hero ≤250KB desktop and ≤120KB mobile, no autoplay video. Responsive AVIF/WebP with fallback, explicit dimensions, below-fold lazy loading, preload only genuinely critical resources, subset self-hosted fonts.

### Phase 6 — Truthfulness surfaces and documentation

`UnverifiedFactsBanner` renders while `siteSettings.verified === false`, stating plainly that company identity and contact details are unconfirmed and the site is not published. It is a single component controlled by one flag — removing it is a deliberate act tied to supplying real facts.

`README.md` per §62: purpose, structure, commands, local setup, the content model and how to author a record, the publication gate and how to satisfy it, environment variable names and purposes with no values, the `LeadStore` / `ContentSource` seams and what replacing them involves, and known limitations.

`LAUNCH-BLOCKERS.md` reproduces §64's business-owner checklist as the live register of what is still missing — legal name, jurisdiction, registration number, registered vs. operating address, monitored emails and phone, exact services offered, verified technology capabilities with an accountable reviewer per item, billing and IP position, support coverage, privacy owner and vendors, counsel review of all four policy pages — plus the explicitly deferred items: no durable database, no transactional email, no CRM, no uploads, no admin console, no monitoring, no backups.

---

## Verification

Run in order; each step has a concrete pass condition.

1. **Build integrity** — `tsc --noEmit`, `eslint`, `next build` all clean. The content validator runs in `prebuild`; confirm it genuinely fails by temporarily inserting `[ADD REAL CASE STUDY]` into a service lead and seeing the build stop.
2. **Route crawl** — every one of the 28 published routes returns 200 with a unique title, unique meta description, exactly one H1, and an absolute self-canonical. `/case-studies/` and `/careers/{slug}/` return a real 404 while their collections are empty. An unknown path returns a real 404, not a soft-404 200.
3. **No-JavaScript pass** — with client JS blocked, primary content, metadata and navigation links are present and usable (§40, AC21).
4. **Navigation** — keyboard-only traversal of desktop and mobile navigation: every displayed link resolves, Escape dismisses, focus returns predictably, no Industries/Resources/Work entry appears, and the hero secondary CTA reads "Explore Our Process" (AC01).
5. **Contact intake** — exercise with `curl` and in-browser: valid submission returns 201 with an opaque reference and a durable store write; invalid submission saves nothing and moves focus to a linked error summary (AC07); same key + same payload replays the original receipt with no second write, same key + different payload returns 409 (AC08); 6 attempts in 15 minutes returns 429 with `Retry-After`; a forced store failure returns 503 with inputs preserved and no false success (AC09); confirm no file input exists anywhere.
6. **Consent** — with DevTools network and storage panels open: on first load and after Reject non-essential, no optional request fires and no marketing identifier is stored; reading and submission still work; withdrawal from the footer clears the relevant first-party identifiers (AC15, AC16).
7. **Accessibility** — axe or Lighthouse a11y scan clean on homepage, a service page, contact and careers; then manual keyboard and screen-reader journeys (NVDA/Firefox and VoiceOver/Safari) over navigation, consent, form validation and successful enquiry. Record tested combinations and any unresolved limitation in the Accessibility Statement (§32, §52).
8. **Responsive and zoom** — all eight widths from §31, plus 200% text zoom and 320px reflow, with long-content and missing-media variants. Nothing essential clipped or obscured (AC17).
9. **SEO output** — inspect rendered HTML: Organization and BreadcrumbList JSON-LD validate against `siteSettings`; grep the built output to confirm `FAQPage`, `AggregateRating` and `JobPosting` are absent; `sitemap.xml` contains only the 28 published routes; `robots.txt` references it; the noindex build check fails when forced.
10. **Performance** — Lighthouse mobile under a recorded throttling configuration on homepage, a service page and contact. Compare measured JS and transfer against the §46 budgets and document any exception with its owner.
11. **Design-system review** — every interactive component screenshotted in default, hover, focus, pressed, disabled, loading, empty and error states; focus ring contrast checked against each actual surface it appears on.
12. **Truth audit** — grep the entire build output for `[`-bracketed placeholders, `lorem`, `ADD `, `VERIFIED`, `INSERT`; confirm every illustrative visual carries its label; confirm the unverified-facts banner renders; confirm no testimonial, client logo, metric, award or certification appears anywhere (§63).

---

## Explicitly not built, and why

Each of these is a PRD requirement left undone by the frontend-only scope, recorded here so nothing looks accidentally forgotten. All are listed in `LAUNCH-BLOCKERS.md`.

- **Durable intake** (REQ-LEAD-01, REQ-CRM-01, §42) — Postgres schema, transactional submission + lead + outbox write, reconciliation. The `LeadStore` seam exists; the implementation does not.
- **Email** (REQ-EMAIL-01, §37) — provider, SPF/DKIM/DMARC, the six templates, retry ladder, bounce handling.
- **Uploads** (REQ-UPLOAD-01, §44) — attachment UI removed as the PRD directs, rather than built unsafely.
- **CMS** (REQ-CMS-01, §34) — roles, drafts, preview, publication webhooks. The `ContentSource` seam exists; the compiler-enforced content contract and build-time publication gate substitute for the editorial workflow in the meantime.
- **Admin console** (§35), **CRM sync** (§36), **analytics vendor** (§38), **monitoring** (§50), **backups** (§51), **client portal** (REQ-PORTAL-01, P2).
- **Policy text** (§25) — section skeletons and required-input lists only. All four pages are marked as requiring counsel review before they can be treated as published; the PRD is explicit that it supplies a content specification, not a legal opinion.
