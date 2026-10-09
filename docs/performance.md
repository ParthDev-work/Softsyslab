# Performance budget — target, not yet a gate

PRD performance targets, and how `lighthouserc.json` maps to each one. The
`lighthouse` job in `.github/workflows/ci.yml` runs this on every push and PR
and reports the numbers in the job log; every assertion is severity `"warn"`,
so a budget miss is visible but never fails the build.

| PRD target | `lighthouserc.json` assertion | Note |
| --- | --- | --- |
| LCP ≤ 2.5s (75th percentile) | `largest-contentful-paint` ≤ 2500ms | Lab measurement from 3 runs, not real 75th-percentile field data — field data needs real-user monitoring (CrUX or an RUM vendor), not wired yet |
| INP ≤ 200ms | `total-blocking-time` ≤ 200ms | Lighthouse (lab) has no INP audit; TBT is the closest lab proxy. Real INP again needs field data |
| CLS ≤ 0.1 | `cumulative-layout-shift` ≤ 0.1 | Direct match, lab and field usually agree closely on CLS |
| JS ≤ 180KB initial | `resource-summary:script:size` ≤ 184320 bytes | Aggregate script transfer size on the page |
| Page transfer ≤ 1.2MB | `resource-summary:total:size` ≤ 1258291 bytes | Aggregate transfer size, all resource types |
| Image ≤ 250KB desktop / 120KB mobile | `resource-summary:image:size` ≤ 256000 bytes | **Proxy, not exact**: this is a total across every image on the page, not a per-image ceiling. A page with two 150KB images passes this check but would fail the PRD's per-image budget. Enforcing per-image size needs a custom Lighthouse audit or an image-pipeline check (e.g. at build time) — not built yet. |

Pages checked: `/`, `/services/`, `/contact/` — the three most representative
of a typical visit (home, a listing page, the form). Add more to `collect.url`
in `lighthouserc.json` as needed.

## Turning this into a gate later

Change any assertion's severity from `"warn"` to `"error"` in
`lighthouserc.json` and the same CI job starts failing the pipeline on a
miss — no other change required. Do this once the budgets have been live
long enough to know they're realistic; gating on day one against numbers
nobody has seen hit in practice just makes the pipeline red for the wrong
reason.
