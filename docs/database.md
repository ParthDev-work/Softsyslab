# Database

The operational database the PRD specifies (section 42), implemented with
Prisma against managed PostgreSQL on Supabase.

## Where things live

- `prisma/schema.prisma` — the full schema: users/roles/permissions, leads
  and submissions, quote requests, status history and notes, uploads and
  applications, newsletter subscribers, consent receipts, the outbox,
  idempotency keys, integration events, audit logs, settings and retention
  jobs. Table and column names are snake_case in Postgres, camelCase in the
  generated client.
- `src/lib/server/db.ts` — the Prisma client singleton, cached on
  `globalThis` in development so a hot reload does not open a second
  connection pool.
- `src/lib/server/leadStore.ts` — `PostgresLeadStore`, the `LeadStore`
  implementation this schema backs. One transaction per `POST /api/contact`
  write: find-or-attach a lead, insert the submission, insert the outbox
  events, commit.

## Two connection strings, one reason

Supabase's pooled connections come in two modes, and this app needs both:

- `DATABASE_URL` — the transaction pooler (port 6543). What the app uses at
  runtime, because a serverless invocation opens a short-lived connection
  and the transaction pooler is built for exactly that. Requires
  `?pgbouncer=true&connection_limit=1` — pgbouncer's transaction mode does
  not support prepared statements, and that flag tells Prisma not to use
  them.
- `DATABASE_DIRECT_URL` — the session pooler (port 5432). What
  `prisma migrate` needs: a session-scoped connection with prepared
  statement support, which the transaction pooler cannot give it.

Both are read from `.env.local`; see `.env.example` for the full connection
string shapes.

## First-time setup

Once `DATABASE_URL` and `DATABASE_DIRECT_URL` are set in `.env.local`:

```bash
npm run db:migrate -- --name init   # creates prisma/migrations/ and applies it
npm run db:generate                 # regenerates the Prisma client (also runs on npm install)
```

After that, `src/lib/server/leadStore.ts`'s `selectStore()` picks the
Postgres-backed store automatically, because `DATABASE_URL` is now set.
Nothing else changes — the route handler and the `LeadStore` interface stay
the same either way.

`LEAD_STORE=file` or `LEAD_STORE=none` in the environment, if set, still
override this and always win — useful for forcing the old JSONL behaviour
or a hard failure during testing, even with a database configured.

## What's still missing

The outbox table fills (`send_confirmation_email`, `notify_internal`,
`crm_sync` rows per submission) but nothing drains it. The PRD describes
that consumer as a separate worker process, deliberately out of scope here.
Until it exists, every lead is durably stored and nothing is actually sent.
