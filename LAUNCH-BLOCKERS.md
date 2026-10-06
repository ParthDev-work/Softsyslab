# Launch blockers

What must be supplied or built before this site can be treated as published.
Derived from PRD section 64 (content required from the business owner),
section 63 (due-diligence readiness) and the scope decisions in `buildplan.md`.

Nothing here is a surprise or an oversight. Each item is either a fact nobody
has confirmed or a capability this build deliberately did not implement, and in
both cases the site currently says so on the page where it would appear rather
than filling the space with something plausible.

---

## A. Facts the business owner must supply

Until these arrive, `siteSettings.verified` stays `false`, the unverified-facts
banner renders on every page, and the Organization structured data is withheld.

| # | Item | Where it surfaces | Status |
|---|---|---|---|
| A1 | Registered legal name | Footer, business information, JSON-LD | Missing |
| A2 | Jurisdiction of incorporation | Business information | Missing |
| A3 | Company registration number | Business information | Missing |
| A4 | Registered address | Business information, footer | Missing |
| A5 | Operating address, labelled separately | Business information | Missing |
| A6 | Monitored business email | Footer, contact, error page | Missing |
| A7 | Monitored support email | Footer, support page | Missing |
| A8 | Monitored security email | Security page disclosure section | Missing |
| A9 | Answered business telephone | Footer, contact sidebar | Missing |
| A10 | Production domain | `NEXT_PUBLIC_SITE_ORIGIN`, canonicals, sitemap | Missing |
| A11 | Active social profile URLs | Footer (omitted entirely while empty) | Missing |

Section 19 is specific that a registered address must be shown as registered
and not as a staffed office, which is why A4 and A5 are separate fields.

## B. Claims that need an accountable reviewer

Each needs a named internal owner, an evidence reference and a review date
before it can be published. Section 26: an unverified claim is withheld, not
published with a caveat.

| # | Item | Current state |
|---|---|---|
| B1 | Exact list of services actually offered | Ten service pages published on the assumption they are all offered — **confirm or remove** |
| B2 | Technology capabilities (20 candidate records) | All `unverified`; no list renders anywhere |
| B3 | Mission, vision and values | Section 19 supplies proposed wording; owner approval not given, so not published |
| B4 | Company history and timeline | Not published — needs verified dates |
| B5 | Team members, roles, photographs | Not published — needs real people and approved biographies |
| B6 | Office locations | Not published |
| B7 | Security practices (14 areas from section 24) | Not published as claims; the page lists the areas as outstanding |
| B8 | Support hours, timezone, escalation, defect period | Not published; support page says so |
| B9 | Client work for case studies | Collection empty; listing and Work navigation withheld |
| B10 | Client testimonials with written permission | Homepage module 15 omitted entirely |
| B11 | Three approved articles | Homepage module 16 and the Resources section omitted |
| B12 | Billing, IP and ownership position | Engagement models page states terms are unpublished |
| B13 | Open roles, with hiring owner and retention policy | Careers shows section 23's truthful empty state |

Any certification claim (SOC 2, ISO 27001, HIPAA, PCI DSS) requires the
corresponding report and a stated scope. The security page currently says none
is held, which is the only honest position without evidence.

## C. Legal review

All four policy pages publish their required structure and inputs, under a
standing notice that they are not in force. Section 25 supplies a content
specification and explicitly instructs appointing qualified counsel for the
applicable jurisdictions before publication.

| # | Page | Needs |
|---|---|---|
| C1 | Privacy Policy | Controller identity, lawful bases, processors, transfers, retention, rights |
| C2 | Website Terms | Operator, permitted use, disclaimers, liability, governing law |
| C3 | Cookie Policy | Inventory wording; the current inventory is accurate (one necessary cookie) |
| C4 | Accessibility Statement | Testing dates, combinations tested, known limitations |
| C5 | Contact form privacy wording | Section 20 warns against mislabelling all processing as consent |

## D. Capabilities not built

Each has a seam in the codebase. None has an implementation.

| # | Capability | PRD | Seam |
|---|---|---|---|
| D1 | Managed PostgreSQL and the durable intake transaction | §41, §42, REQ-LEAD-01 | `LeadStore` in `src/lib/server/leadStore.ts` |
| D2 | Outbox worker and reconciliation job | §36, §41 | Not started — depends on D1 |
| D3 | Transactional email, SPF/DKIM/DMARC, six templates | §37, REQ-EMAIL-01 | Not started |
| D4 | CRM sync with submission UUID as idempotency key | §36, REQ-CRM-01 | Not started |
| D5 | Managed headless CMS with roles, drafts, preview, webhooks | §34, REQ-CMS-01 | `ContentSource` in `src/lib/content/index.ts` |
| D6 | Object storage with malware scanning | §39, REQ-UPLOAD-01 | Not started — no file input exists, per the PRD's instruction |
| D7 | Staff admin console with RBAC and audit | §35 | Not started |
| D8 | Bot prevention with accessible fallback | §39 | Not started |
| D9 | Consent-gated analytics vendor | §38 | Gate exists in `src/lib/analytics/`, fans out to nothing |
| D10 | Error and uptime monitoring | §50 | Not started |
| D11 | Backups, PITR, monthly restore rehearsal | §51 | Not started |
| D12 | Quote and estimation flow | §21 | Not started (P1) |
| D13 | Resource centre and blog | §22 | Not started, gated on B11 |
| D14 | Industry pages | §16 | Not started, pending sector review |
| D15 | Technology category pages | §17 | Not started (P1) |
| D16 | Client portal | REQ-PORTAL-01 | Not started (P2) |

### Consequences while D1–D4 are outstanding

The contact form validates, rate-limits and records an enquiry on the running
instance. It does not store it durably, send a confirmation, alert anyone
internally or reach a CRM. The contact page and the success screen both say so.
**The site should not be advertised as a route for real enquiries until D1 and
D3 are done.**

## E. Infrastructure and operations

| # | Item | Status |
|---|---|---|
| E1 | Production domain with apex/www canonical routing | Not configured |
| E2 | `NEXT_PUBLIC_ALLOW_INDEXING=true` on production only | Currently false everywhere |
| E3 | HSTS after a subdomain readiness review | Behind `ENABLE_HSTS`, off |
| E4 | Vendor accounts owned by the business, not an individual | Section 49: do not place production services in a developer's personal account |
| E5 | Preview deployment access protection | Vercel preview protection not enabled |
| E6 | Automated test suite | None. `npm run verify` covers content, types and lint only |

## F. Verification still to run

The checks in `buildplan.md` that were performed are recorded in the handover
notes. These were not:

| # | Check | Why |
|---|---|---|
| F1 | Screen-reader journeys (NVDA/Firefox, VoiceOver/Safari) | Needs the assistive technology and a person |
| F2 | Manual verification at all eight viewport widths plus 200% zoom | Needs real devices or a browser matrix |
| F3 | Lighthouse under a recorded throttling configuration | Should run against the deployed URL, not localhost |
| F4 | Design-system state screenshots for every component | Not produced |
| F5 | Restore rehearsal | Nothing to restore until D1 and D11 exist |

---

## Suggested order

1. **A1–A11** — the facts. They cost nothing to supply and they remove the
   banner, publish the footer identity and enable the Organization JSON-LD.
2. **D1 + D3** — database and email, so the contact form stops being a
   demonstration.
3. **C1–C5** — counsel review, needed before any real traffic.
4. **B1–B2** — confirm the service list and verify enough technology records
   that the capability section can publish.
5. **E1–E2** — domain and indexing, which is the actual moment of launch.

Everything after that is incremental: case studies and testimonials as they are
approved, then the CMS, then the admin console.
