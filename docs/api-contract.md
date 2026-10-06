# API contract

Reference for every endpoint in PRD section 43 — what this build implements, and
what the remaining endpoints must look like when they are built.

One endpoint is live: `POST /api/contact/`. Everything else in section 43 is
specified below but **not implemented**, because it depends on the database, CMS,
object storage, upload scanning or staff authentication that this build
deliberately does not have. Each is listed with its contract so that building it
later is an implementation task rather than a design task.

---

## Conventions that apply to every endpoint

These come from section 43 and hold for anything added later.

**Transport.** HTTPS only. Public mutation requests accept `application/json`
only; anything else answers `415`.

**Bounded payloads.** Every endpoint declares a maximum body size and enforces it
against the actual bytes received, not only against `Content-Length`. Over the
limit answers `413`.

**Strict schemas.** Unknown fields are rejected or stripped — never accepted and
stored. Validation uses the same schema module the client imports, so the two
cannot drift.

**No outbound fetch of submitted URLs.** No endpoint accepts an arbitrary
external URL and retrieves it. A submitted website or product address is stored
as text. This is the SSRF defence and it is a property of the code, not a
setting.

**Response envelope.** Exactly two shapes.

```jsonc
// success
{ "ok": true, "data": { /* endpoint-specific */ }, "requestId": "<uuid>" }

// failure
{
  "ok": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Please check the highlighted fields.",
    "fields": { "email": "Enter a valid email address." }   // optional
  },
  "requestId": "<uuid>"
}
```

`requestId` is a fresh UUID per request, safe to quote in a support conversation.
No stack trace and no provider detail ever appears in `message`.

**Status codes.**

| Code | Meaning |
|---|---|
| `200` | Identical idempotent replay — the original result, returned again |
| `201` | A new durable record was created |
| `202` | Queued: a newsletter request or a scan not yet complete |
| `400` | Malformed payload, or a missing required header |
| `401` | Unauthenticated |
| `403` | Authenticated but not permitted, or a disallowed origin |
| `404` | Unknown public record |
| `405` | Method not allowed on this path |
| `409` | Idempotency conflict, version conflict, or a closed job |
| `413` | Oversized payload |
| `415` | Unsupported content type |
| `422` | Valid JSON with invalid field values |
| `429` | Rate limited; carries `Retry-After` |
| `503` | A dependency failure that prevented a durable write |

**Caching.** Every mutation and every authenticated response sends
`Cache-Control: no-store`.

**Rate limits.** The figures below are section 43's proposed starting settings,
tuned for shared networks. Section 43 is explicit that they are not security
guarantees, and the note under `POST /api/contact/` explains why the current
implementation is weaker still.

---

## `POST /api/contact/` — implemented

The enquiry intake. REQ-LEAD-01, acceptance criteria AC06–AC10.

### Request

```
POST /api/contact/
Content-Type: application/json
Idempotency-Key: <opaque string, 1-128 chars>
```

Maximum body: **64 KB**. Rate limit: **5 attempts per 15 minutes per address**.

```jsonc
{
  "services": ["web-development", "api-development-integration"],
  "budgetCode": "25k-75k",
  "timelineCode": "1-3-months",
  "summary": "At least 30 characters describing the problem…",
  "productUrl": "https://example.invalid/app",   // optional, https only
  "firstName": "Ada",
  "lastName": "Lovelace",
  "email": "ada@example.invalid",
  "phone": "+44 20 7946 0000",                   // optional unless preferred
  "company": "Pre-launch",
  "country": "United Kingdom",
  "website": "https://example.invalid",          // or "" with noWebsite true
  "noWebsite": false,
  "preferredContact": "email",                   // "email" | "phone"
  "privacyAcknowledged": true,
  "noticeVersion": "2026-10-06.1",
  "formVersion": "contact.v1",
  "source": {                                    // optional, allowlisted
    "utmSource": "newsletter",
    "utmMedium": "email",
    "utmCampaign": "q4",
    "landingPath": "/services/web-development/"
  }
}
```

### Field rules

From section 20's field table. Every required field that a prospect may
genuinely not know has an explicit escape — section 20: *"Do not silently turn
every unknown into a guessed value."*

| Field | Required | Rules |
|---|---|---|
| `services` | yes | 1–5 published service ids, or `not-sure` (exclusive) |
| `budgetCode` | yes | A configured code, or `need-guidance` |
| `timelineCode` | yes | A configured code, or `flexible` |
| `summary` | yes | 30–5,000 code points; line breaks preserved as plain text |
| `productUrl` | no | `https:` only, ≤2,048 chars. Stored, never fetched |
| `firstName` / `lastName` | yes | 1–100 **Unicode** code points each. No Latin-only regex |
| `email` | yes | ≤254 chars. Personal domains accepted |
| `phone` | conditional | ≤32 chars. Required only when `preferredContact` is `phone` |
| `company` | yes | 1–160 chars. `"Pre-launch"` is a valid answer |
| `country` | yes | One of the configured list. No eligibility is inferred |
| `website` | conditional | `https:` URL, **or** `noWebsite: true` |
| `preferredContact` | yes | `email` or `phone` |
| `privacyAcknowledged` | yes | Must be `true`. Starts unchecked |
| `noticeVersion` | yes | The privacy notice version shown at submission |

No attachment field exists. REQ-UPLOAD-01 says to remove the attachment
interface where scanning is not implemented, rather than offer one that
discards the file.

### Responses

**`201` — new durable record**

```jsonc
{
  "ok": true,
  "data": { "reference": "ENQ-K3M9-QX72", "status": "received" },
  "requestId": "8f14e45f-ceea-467a-9f8a-1c2d3e4f5a6b"
}
```

The reference is opaque. Section 43: it must not encode an email or a company
name.

**`200` — idempotent replay.** Same `Idempotency-Key` and an identical body:
the original `data` is returned and nothing is written a second time.

**`409` — idempotency conflict.** Same key, different body. Keys expire after 24
hours, after which the same key starts fresh.

**`422` — validation failure.** `error.fields` carries one message per invalid
field, keyed by field name. The client renders them beside each control and in a
focused error summary (AC07).

**`429` — rate limited.** Carries `Retry-After` in seconds.

**`503` — storage unavailable.** Section 41: *"Database unavailable means return
a retryable error, not a success screen or an email-only lead."* The client keeps
every answer and offers a retry; the same `Idempotency-Key` is reused, so the
retry cannot create a second lead.

**`403` / `415` / `413` / `400` / `405`** as described under conventions.

### What this endpoint does *not* do yet

Honest limits, each one a gap against the PRD rather than a design choice:

- **Persistence is not durable.** The lead store appends to a local JSONL file.
  On Vercel the filesystem is ephemeral, so a saved enquiry does not outlive the
  instance. The contact page tells the visitor this rather than implying their
  enquiry has been filed.
- **Nothing is sent to anyone.** No confirmation email, no internal alert, no CRM
  sync. The outbox described in section 36 does not exist.
- **Rate limiting and idempotency are per-instance.** Both use in-memory maps, so
  a serverless deployment enforces them per cold instance. They raise the cost of
  casual abuse; they are not the distributed controls section 43 describes.
- **No bot prevention.** Section 39 lists adaptive controls with an accessible
  fallback as P0. The hook is unbuilt and no token is checked.

### Replacing the lead store

`src/lib/server/leadStore.ts` defines the seam. Implement `LeadStore` against
PostgreSQL to get the PRD's behaviour, and change the one line in `selectStore`.
No call site changes.

```ts
interface LeadStore {
  readonly name: string;
  readonly durable: boolean;
  save(input: ContactInput, meta: SaveMeta): Promise<StoredLead>;
}
```

The Postgres implementation must write the submission, the lead and the outbox
events **in one transaction** (section 41), and reject rather than resolve if any
part fails. The route turns a rejection into `503`, so correctness at the
boundary is already handled.

---

## Specified but not implemented

Each entry gives the contract from section 43 and the dependency that blocks it.

### `POST /api/quote`

Versioned complete quote schema; returns a reference. Public; 5 per 15 min per
address; same idempotency semantics as `/api/contact/`. Section 21 requires that
no abandoned contact draft is stored — only a completed flow is persisted.

*Blocked on:* the quote flow itself (section 21, P1) and durable storage.

### `GET /api/services`

Published list with an optional allowed category and cursor. 60 per minute per
address, cached.

*Not needed:* section 43 says to omit this when the frontend reads the CMS
server-side. This build reads typed local content in Server Components, so
there is no reason for the endpoint to exist. Adding it would publish a second
copy of content that already renders — section 34's "do not maintain two
editable copies" applied to read paths.

### `GET /api/case-studies`

Published filters and cursor, maximum 24 results, cached. Must expose no
unpublished evidence and no client-private field.

*Blocked on:* approved client work. The collection is empty and section 18
withholds the listing entirely rather than serving an empty gallery.

### `GET /api/blog`

Published category, tag, query and cursor. Cached, with a bounded query length
and no expensive wildcard search.

*Blocked on:* section 22's gate of three approved articles.

### `GET /api/jobs`

Active public jobs only, cached with expiry-aware invalidation so a role past
its `valid_through` date disappears without a deploy.

*Blocked on:* real approved roles. None exist.

### `POST /api/jobs/{id}/apply`

Active-job check, candidate schema, clean CV token. 5 per hour per address plus
job and email abuse controls. A closed job returns `409`.

*Blocked on:* object storage with malware scanning, and an approved CV retention
policy. Section 23 forbids collecting speculative CVs without one, which is why
the careers page has no form.

### `POST /api/support`

Request plus a contact reference. Enabled only if support intake exists, and
must verify authorisation before returning any private project detail.

*Blocked on:* a monitored support channel and staff authentication. Section 19's
support fields are all unverified.

### `POST /api/webhooks/cms`

Signed event id, timestamp, record id and action. Signature verification **plus**
replay protection; queues cache invalidation for the affected page, hub, sitemap
and search index.

*Blocked on:* CMS selection. Section 34 requires procurement to verify roles,
revisions, draft preview, auditability, export, data region and webhook support
before a vendor is chosen.

### `POST /api/webhooks/email`

Signed delivery event with provider verification and a unique external event id,
recorded before processing so a replayed delivery is recognised.

*Blocked on:* the transactional email provider.

### `GET /api/admin/leads`

Paginated authorised lead list. Staff authentication, sales permission,
`no-store`.

### `PATCH /api/admin/leads/{id}`

Allowed status and assignment changes with a version for optimistic concurrency.
Permission checked, every transition audited with actor, action, target and
timestamp.

### `GET /api/admin/uploads/{id}/download`

Authorised access to a clean object. Short-lived signed download issued only
after a scope check; never publicly cacheable.

*All three blocked on:* the admin console (section 35), managed identity with
MFA, and the RBAC model. None exists in this build.

---

## Testing the live endpoint

```bash
# Happy path — expect 201 and a reference
curl -sS -X POST http://localhost:3000/api/contact/ \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: demo-key-1' \
  -d @docs/examples/contact-valid.json | jq

# Replay the same key and body — expect 200 and the same reference
curl -sS -X POST http://localhost:3000/api/contact/ \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: demo-key-1' \
  -d @docs/examples/contact-valid.json | jq

# Same key, different body — expect 409
curl -sS -o /dev/null -w '%{http_code}\n' -X POST http://localhost:3000/api/contact/ \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: demo-key-1' \
  -d '{"services":["mvp-development"]}'

# Invalid payload — expect 422 with error.fields
curl -sS -X POST http://localhost:3000/api/contact/ \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: demo-key-2' \
  -d '{"services":[],"summary":"too short"}' | jq

# Forced store failure — expect 503, nothing written
LEAD_STORE=none npm run dev   # then POST a valid payload
```
