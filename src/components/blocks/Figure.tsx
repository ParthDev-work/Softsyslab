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
 * The hero figure (three curves tracing how an engagement narrows from an
 * open question to one operable release) and the dark security module's
 * responsibility-boundary figure both live in `HeroFigures.tsx` instead of
 * here — they're the only two figures used on the homepage, so moving them
 * out is what lets this file, and the service/solution detail pages that
 * import `WorkflowFigure` from it, stay plain server components rather than
 * pulling in Motion for a page that never animates.
 */
