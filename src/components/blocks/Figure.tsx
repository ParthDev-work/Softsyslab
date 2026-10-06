import type { Illustration } from "@/lib/content/schemas";

/**
 * PRD section 13 and section 26: original diagrams, labelled illustrative, and
 * never presented as delivered work. No stock photography and no fabricated
 * product screenshot appears anywhere on this site.
 *
 * Every figure here is built from text and borders rather than from an image.
 * That gives each one a real reading order for assistive technology, reflow at
 * 320px, survival at 200% text zoom, and zero bytes against the section 46
 * page-weight budget. It is also the honest form for this content: a diagram
 * drawn from the words is clearly a diagram, where a rendered mockup invites
 * the reader to believe it is a product.
 */

export function WorkflowFigure({
  illustration,
  className,
}: {
  illustration: Illustration;
  className?: string;
}) {
  return (
    <figure className={className}>
      <ol className="flex list-none flex-wrap items-center gap-2 p-0">
        {illustration.steps.map((step, index) => (
          <li key={step} className="flex items-center gap-2">
            {index > 0 ? (
              <span aria-hidden="true" className="text-faint">
                →
              </span>
            ) : null}
            <span className="rounded-chip border border-line px-2.5 py-1.5 text-xs text-text">
              {step}
            </span>
          </li>
        ))}
      </ol>
      <figcaption className="mt-3.5 space-y-1">
        <p className="text-xs text-muted">{illustration.caption}</p>
        <p className="font-mono text-xs text-dim">{illustration.label}</p>
      </figcaption>
    </figure>
  );
}

/**
 * The hero figure: a project brief rendered as a document, not as an
 * application screenshot. It shows the artifact the first stage of an
 * engagement actually produces — including an open decision left unresolved,
 * which is the point the surrounding copy makes.
 */
export function ProjectBriefFigure() {
  return (
    <figure className="m-0 min-w-0 flex-5 basis-95">
      <div className="relative pb-4.5 pl-4.5">
        {/* Offset backing plate — depth without a drop shadow doing the work. */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 right-4.5 top-4.5 rounded-card border border-line bg-surface"
        />
        <div className="relative overflow-hidden rounded-card border border-line bg-canvas shadow-soft">
          <div className="flex items-center justify-between gap-3 border-b border-hairline px-5 py-3.5 font-mono text-xs text-muted">
            <span>project-brief.md</span>
            <span className="rounded border border-line px-2 py-0.5">
              v0.3 · draft
            </span>
          </div>

          <div className="grid gap-5 px-5 pb-6 pt-5.5">
            <div>
              <p className="mb-2.5 font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-dim">
                Users
              </p>
              <ul className="flex flex-wrap gap-1.5 p-0">
                {["Operations staff", "Customers", "Administrators"].map(
                  (user) => (
                    <li
                      key={user}
                      className="rounded-chip bg-tint px-2.5 py-1 text-xs"
                    >
                      {user}
                    </li>
                  ),
                )}
              </ul>
            </div>

            <div>
              <p className="mb-2.5 font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-dim">
                First workflow
              </p>
              <ol className="flex list-none flex-wrap items-center gap-1.5 p-0 text-xs">
                <li className="rounded-chip border border-line px-2.5 py-1.5">
                  Enquiry
                </li>
                <li aria-hidden="true" className="text-faint">
                  →
                </li>
                <li className="rounded-chip border border-line px-2.5 py-1.5">
                  Approval
                </li>
                <li aria-hidden="true" className="text-faint">
                  →
                </li>
                <li className="rounded-chip border border-brand px-2.5 py-1.5 text-brand">
                  Assignment
                </li>
                <li aria-hidden="true" className="text-faint">
                  →
                </li>
                <li className="rounded-chip border border-dashed border-line px-2.5 py-1.5 text-dim">
                  Reporting
                </li>
              </ol>
            </div>

            <div>
              <p className="mb-2.5 font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-dim">
                Acceptance criteria
              </p>
              <ul className="grid gap-2 p-0 text-xs">
                <AcceptanceRow done>
                  Staff can approve or return an enquiry with a reason
                </AcceptanceRow>
                <AcceptanceRow done>
                  Assignment respects role permissions
                </AcceptanceRow>
                <AcceptanceRow done={false}>
                  Report export format — open decision
                </AcceptanceRow>
              </ul>
            </div>

            <div className="flex flex-wrap justify-between gap-3 border-t border-hairline pt-4 text-xs text-muted">
              <span>2 integrations · 1 open decision</span>
              <span className="text-accent">Ready for review</span>
            </div>
          </div>
        </div>
      </div>
      <figcaption className="mt-3.5 font-mono text-xs text-dim">
        Illustrative — not delivered client work
      </figcaption>
    </figure>
  );
}

function AcceptanceRow({
  done,
  children,
}: {
  done: boolean;
  children: React.ReactNode;
}) {
  return (
    <li className="flex gap-2.5">
      {done ? (
        <span
          aria-hidden="true"
          className="mt-0.5 grid size-4 flex-none place-items-center rounded bg-anchor text-[0.6875rem] text-white"
        >
          ✓
        </span>
      ) : (
        <span
          aria-hidden="true"
          className="mt-0.5 size-4 flex-none rounded border-[1.5px] border-faint"
        />
      )}
      <span className={done ? undefined : "text-muted"}>
        <span className="sr-only">{done ? "Agreed: " : "Open: "}</span>
        {children}
      </span>
    </li>
  );
}

/**
 * The responsibility-boundary figure on the dark security module. It shows
 * where a delivery agreement usually draws the line, which is a statement
 * about how scoping works rather than a claim about controls in place.
 */
export function SecurityBoundaryFigure({ caption }: { caption: string }) {
  return (
    <figure className="m-0 min-w-0 flex-1 basis-105">
      <div className="rounded-card border border-ink-border p-6 font-mono text-xs leading-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-chip border border-ink-line px-3 py-2 text-hairline">
            Users
          </span>
          <span
            aria-hidden="true"
            className="min-w-6 flex-1 border-t border-dashed border-ink-line"
          />
          <span className="text-faint">authenticated · least privilege</span>
        </div>

        <div className="relative mt-4 rounded-[10px] border border-dashed border-dim px-4 pb-4 pt-5">
          <span className="absolute -top-2.5 left-3.5 bg-ink px-2 font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-faint">
            Application boundary
          </span>
          <ul className="grid gap-2.5 p-0 sm:grid-cols-3">
            {[
              { name: "Web app", note: "output encoding" },
              { name: "API", note: "authz per resource" },
              { name: "Data store", note: "encrypted · backed up" },
            ].map((node) => (
              <li
                key={node.name}
                className="rounded-chip bg-ink-raised p-3 text-surface"
              >
                {node.name}
                <span className="mt-1 block text-[0.6875rem] text-faint">
                  {node.note}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 flex flex-wrap justify-between gap-2 rounded-chip border border-ink-border px-3 py-2.5 text-faint">
            <span>Logs &amp; monitoring</span>
            <span>dependency review</span>
          </p>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className="text-faint">scoped credentials</span>
          <span
            aria-hidden="true"
            className="min-w-6 flex-1 border-t border-dashed border-ink-line"
          />
          <span className="rounded-chip border border-ink-line px-3 py-2 text-hairline">
            External services
          </span>
        </div>
      </div>
      <figcaption className="mt-3.5 font-mono text-xs text-faint">
        {caption}
      </figcaption>
    </figure>
  );
}
