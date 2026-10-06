import Link from "next/link";

/**
 * PRD section 30: breadcrumbs follow the canonical hierarchy. The current page
 * is the last entry, is not a link, and carries aria-current="page".
 *
 * The same trail feeds the BreadcrumbList structured data, so the markup and the
 * JSON-LD cannot disagree.
 */

export type Crumb = { label: string; href: string };

export function Breadcrumb({ trail }: { trail: Crumb[] }) {
  if (trail.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="py-4">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-small text-muted">
        {trail.map((crumb, index) => {
          const isCurrent = index === trail.length - 1;
          return (
            <li key={crumb.href} className="flex items-center gap-2">
              {index > 0 ? (
                <span aria-hidden="true" className="text-line">
                  /
                </span>
              ) : null}
              {isCurrent ? (
                <span aria-current="page" className="font-medium text-text">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="underline underline-offset-4 hover:text-brand"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
