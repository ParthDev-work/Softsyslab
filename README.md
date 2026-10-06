# SoftSysLab corporate website

A server-rendered marketing site built against `Software_Development_Company_Website_PRD.pdf`
(v1.0, 68 pages) and the scope decisions in [`buildplan.md`](./buildplan.md).

**This build is frontend-only.** Thirty routes, a complete design system and a
working enquiry endpoint — with no database, no email, no CMS, no uploads and no
admin console behind it. Every one of those gaps is deliberate, recorded in
[`LAUNCH-BLOCKERS.md`](./LAUNCH-BLOCKERS.md), and sits behind an interface that
already exists so the real implementation drops in without touching page code.

The PRD's central claim, repeated in sections 2, 11, 26 and 63, is that *a
visually complete site with fabricated content fails the product objective*.
That is why this site publishes no client work, no testimonial, no technology
capability list, no team, no address and no legal policy text — and says so on
the pages where each would normally appear, rather than leaving a gap the
reader has to interpret.

---

## Quick start

```bash
npm install
cp .env.example .env.local     # already present in a fresh checkout
npm run dev                    # http://localhost:3000
```

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Runs the content gate, then builds |
| `npm start` | Serves the production build |
| `npm run verify` | Content gate + typecheck + lint — run before pushing |
| `npm run validate:content` | The publication gate on its own |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |

## Stack

Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS v4 ·
Zod. No UI component library — the primitives are hand-built against the PRD's
own tokens, because section 29 requires specific states that a generic library
would have to be audited for anyway.

Fonts are Schibsted Grotesk and IBM Plex Mono (both SIL OFL), downloaded at
build time by `next/font` and served from this origin. No request reaches a
font CDN at runtime, which matters for section 45 as much as for section 46.

## Layout

```
src/
  app/
    (marketing)/        public routes, Server Components throughout
    api/contact/        the enquiry endpoint
    layout.tsx          root layout — stays a Server Component
    sitemap.ts          built from the published-route registry
    robots.ts
    not-found.tsx       real 404, copy from section 58
    error.tsx           500 state, copy from section 58
  components/
    ui/                 Button, Field, Card, Layout, Notice, Breadcrumb
    blocks/             FaqList, Figure, CtaBanner, ContactForm, page templates
    layout/             Header, Footer, Logo, NavDisclosure, ConsentControls,
                        UnverifiedFactsBanner
  content/              typed content modules — the CMS stand-in
  lib/
    content/            ContentSource adapter, zod schemas, route registry
    validation/         the contact schema, shared by client and server
    server/             lead store, rate limit, idempotency, API envelopes
    analytics/          consent gate and event vocabulary (no vendor wired)
    seo/                metadata and JSON-LD builders
    settings/           siteSettings — the single source of company identity
scripts/
  validate-content.ts   the publication gate; runs in prebuild and CI
docs/
  api-contract.md       every endpoint in section 43
```

---

## The four ideas worth knowing before you change anything

### 1. The route registry is the single source of navigation truth

`src/lib/content/routes.ts` lists every published route. Navigation, the
footer, the sitemap, the 404 page and the content validator all read it, and
nothing else maintains a parallel list.

This is how section 12's *"never place an unavailable destination in the menu"*
and REQ-NAV-01 are enforced structurally rather than by review. Industries,
Resources and Work are absent from the navigation because they are absent from
the registry; adding real content publishes the route, and the link appears
with no change to the header.

The same mechanism withholds case studies. `src/content/case-studies.ts` is an
empty array, so the registry contributes no `/case-studies/` path, the route
calls `notFound()`, the sitemap excludes it and the hero's secondary CTA reads
"Explore Our Process" instead of "View Our Work" (AC01). Adding one approved
record reverses all of that at once.

### 2. The content adapter is the CMS seam

Pages read through `src/lib/content/index.ts`, never from `src/content/*`
directly. Replacing the local modules with a managed headless CMS means
implementing `ContentSource` once — page components do not change.

```ts
interface ContentSource {
  listServices(): Promise<Service[]>;
  getService(slug: string): Promise<Service | null>;
  // …solutions, corporate pages, policies, case studies, jobs
}
```

The interface is async even though the local implementation is synchronous,
precisely so a network-backed source can be substituted without touching call
sites.

**Authoring a record.** Each collection is a typed array validated by a Zod
schema at module load, so an incomplete record fails the build rather than
publishing a thin page. `serviceSchema` encodes section 14's shared contract as
required fields: a service without poor-fit cases, architecture decisions, a
security note, an example workflow or four to six FAQs will not compile.

### 3. The publication gate is real

`scripts/validate-content.ts` runs in `prebuild` and exits non-zero on any
finding, so a placeholder cannot reach a deployed page. It checks what the type
system cannot:

- placeholder markers (`[BRACKETED]`, `ADD`, `VERIFIED`, `INSERT`, `TODO`,
  lorem ipsum, dummy counters, `example.com`) in customer-visible text
- section 14's 50–90 word lead bound
- every internal link resolving to a published route
- no unverified technology record named anywhere in rendered copy

To see it work, put `[ADD REAL CASE STUDY]` into any service lead and run
`npm run build`. It caught a genuine 48-word lead during development, which is
the only reason that service page is not slightly thin today.

Section 26 is explicit that regex detection is a helper and not the whole
review. This catches the mechanical failures so a human review can spend its
attention elsewhere.

### 4. Company identity lives in exactly one record

`src/lib/settings/siteSettings.ts` holds the legal name, jurisdiction,
addresses, emails, phone and social URLs. The footer, the contact page, the
business-information page and the Organization JSON-LD all read it, so they
cannot disagree (AC05).

Every field is currently `null` except the trading name, and `verified` is
`false`. While that flag is false:

- a banner on every page says company facts are unverified
- the business-information page lists each field as "Not published"
- the Organization structured data is withheld entirely, because publishing a
  machine-readable claim about an unconfirmed legal entity is the hardest kind
  of error to retract once indexed

Supplying the real values and setting `verified: true` removes all of that at
once. There is no second place to update.

---

## The enquiry endpoint

`POST /api/contact/` — full contract in [`docs/api-contract.md`](./docs/api-contract.md).

Implements section 41's write sequence: bounded body parse → origin and content
type check → rate limit → schema validation → persist → respond. Section 43's
envelope and status codes, including `200` for an idempotent replay and `409`
for the same key with a different payload (AC08).

**Persistence is a stub.** `src/lib/server/leadStore.ts` defines `LeadStore` and
the only implementation appends JSON lines to a gitignored local file. On Vercel
the filesystem is ephemeral, so a saved enquiry does not outlive the instance.
The contact page and the success screen both say so, because section 20's
"success only follows durable database commit" cannot honestly be claimed yet.

Swapping in Postgres means implementing `LeadStore` — writing the submission,
the lead and the outbox events in one transaction — and changing one line in
`selectStore`. The route already turns a store rejection into `503` with the
visitor's answers preserved (AC09), so correctness at the boundary is handled.

Rate limiting and idempotency use in-memory maps and are therefore
per-instance. They raise the cost of casual abuse; they are not the distributed
controls section 43 describes.

**There is no file input anywhere.** REQ-UPLOAD-01 says to remove the
attachment interface where scanning is not implemented, rather than offer one
that silently discards the file.

---

## Consent and analytics

No analytics script, tag manager or third-party tracker is loaded, before or
after a consent choice. `src/lib/analytics/` holds the consent gate and section
38's event vocabulary; `track()` checks consent and then fans out to nothing.

That makes AC15 true by construction rather than by configuration, and it means
adding a vendor later is a change inside one function rather than at every call
site. The consent control still records and can withdraw a versioned choice,
because withdrawal has to work before there is anything to withdraw.

## SEO

One canonical host from `NEXT_PUBLIC_SITE_ORIGIN`, one trailing-slash policy,
an absolute self-canonical and unique metadata per route. The sitemap is built
from the route registry, so a withheld route cannot appear in it.

Indexing requires `NEXT_PUBLIC_ALLOW_INDEXING=true` **and** an HTTPS canonical
origin. Anything else serves `noindex` and an empty sitemap, so a preview
deployment cannot be indexed.

Structured data is BreadcrumbList only. `FAQPage` is deliberately absent —
sections 27 and 47 both exclude it, Google having retired FAQ rich results. So
are `AggregateRating`, review stars, `Person` and `JobPosting`, each of which
needs something real behind it that does not exist here.

## Accessibility

WCAG 2.2 AA is the development target, not a claimed conformance. The
accessibility statement says so and records the evaluated scope.

Landmarks, a skip link, one H1 per page, visible labels, keyboard access
throughout. Primary controls are at least 44×44 CSS pixels, above the AA
minimum. FAQs use native `details`/`summary`, so every answer is in the
rendered HTML and works with JavaScript blocked. Form errors appear in text
with an icon, are linked by `aria-describedby`, and an invalid submit moves
focus to a summary that links to each field.

Only four things are Client Components: the mobile and Company menus, the
consent control and the contact form. Reading and navigation work with client
JavaScript disabled.

## Environment

See [`.env.example`](./.env.example) — it carries both the variables this build
reads and placeholders for the services it does not have yet, each with the PRD
section that specifies it. No secret is in a `NEXT_PUBLIC_` variable and no
environment file but the example is committed.

Required before production: `NEXT_PUBLIC_SITE_ORIGIN`,
`NEXT_PUBLIC_ALLOW_INDEXING`.

---

## Known limitations

Beyond the capability gaps in `LAUNCH-BLOCKERS.md`:

- The four policy pages publish their required structure and inputs, not legal
  text. Section 25 supplies a content specification and instructs appointing
  counsel; importing policy wording from elsewhere would produce a document
  that reads convincingly and describes someone else's business.
- Rate limiting and idempotency do not survive a serverless cold start.
- No automated test suite. `npm run verify` covers the content gate, types and
  lint; the behavioural checks in `buildplan.md` were run by hand.
- `npm audit` reports a `braces` advisory reachable only through the ESLint
  dependency chain. It is not in the production bundle.
- The build plan says 28 published routes; its own route table lists 30, which
  is what is built.
