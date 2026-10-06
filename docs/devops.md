# CI/CD, secrets and monitoring

What exists today, what it needs to do something, and where each secret goes.
Nothing here runs against a real deployment yet — the pipeline is wired and
inert until the Vercel and monitoring accounts behind it exist.

## Pipeline — `.github/workflows/ci.yml`

PRD section 48: build artifact → staging deployment → smoke tests →
production release.

| Job | Runs when | Needs |
| --- | --- | --- |
| `verify` | every push and PR | nothing — `npm run verify` + `npm run build` |
| `lighthouse` | every push and PR | nothing — reports against `lighthouserc.json`, never fails the build (see below) |
| `deploy-staging` | PR, only if `vars.VERCEL_DEPLOY_ENABLED == 'true'` | `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` repo secrets |
| `smoke-test` | after a successful staging deploy | nothing beyond the staging URL — curls `/api/health`, fails the pipeline if it doesn't answer 200 |
| `deploy-production` | push to `main`, only if `vars.VERCEL_DEPLOY_ENABLED == 'true'` | same three secrets, plus a `production` GitHub Environment |

`verify` and `lighthouse` already run with zero setup. The three deploy-related
jobs are gated behind a repository **variable** (not secret)
`VERCEL_DEPLOY_ENABLED` so the workflow doesn't fail on every PR before
there's a Vercel project to deploy to — it just skips those jobs. Once you've
linked the project:

1. Create the Vercel project (or re-link the one that already exists) and
   grab a token from vercel.com/account/tokens, plus the org/project ids from
   the project's Settings → General.
2. Add `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` as **repo
   secrets** (Settings → Secrets and variables → Actions → Secrets).
3. Add `VERCEL_DEPLOY_ENABLED=true` as a **repo variable** (same page →
   Variables tab).
4. Create a `production` Environment (Settings → Environments) and add
   yourself as a required reviewer if you want the manual-approval gate the
   PRD implies for a release step — without that, `deploy-production` runs
   unattended on every push to `main`.

## Branch protection

PRD: protected `main`, short-lived feature branches. This is a GitHub repo
setting, not code — once the repo exists on GitHub, set under Settings →
Branches → add a rule for `main` requiring the `verify` check to pass before
merging. Nothing in this repo can configure that from the outside.

## Where each secret lives

Three different places, by who reads it and when:

- **`.env.local`** (gitignored) — secrets the Next.js app itself reads at
  request time in local dev. See `.env.example` for the full list.
- **Vercel project settings** (Environment Variables, per environment:
  Production / Preview / Development) — the same variables, for the deployed
  app. Never commit these; set them in the Vercel dashboard.
- **GitHub repo secrets** (Settings → Secrets and variables → Actions) —
  read only by the CI pipeline itself (`VERCEL_TOKEN` etc.), never by the
  running app. Listed in `.env.example`'s "CI/CD secrets" block for
  discoverability, but they are never meant to go in an `.env` file.

## Monitoring

- **Errors** — `SENTRY_DSN` / `SENTRY_AUTH_TOKEN` are placeholders in
  `.env.example`. Nothing reads them yet; wiring the SDK is separate work
  from this pass.
- **Uptime / synthetic checks (2+ regions, PRD section 50)** — a third-party
  dashboard (Better Stack, UptimeRobot, Checkly, etc.), configured entirely on
  the vendor's side to poll `GET /api/health`. No app secret needed for this
  — the endpoint is public and intentionally cheap (no database round-trip).
- **Database health, email queue status, certificate expiry** — all depend
  on capabilities (the Postgres connection, the email provider, the domain's
  TLS setup) that are being wired separately; this doc will grow a row per
  check as each one lands.
