import type { Section } from "@/lib/content/schemas";
import { SectionHeading } from "@/components/ui/Layout";

/**
 * Renders the body sections shared by service, solution and corporate pages.
 *
 * Body text is plain text, never HTML — section 34 disallows arbitrary markup
 * from the editorial side, and keeping the content model free of HTML means a
 * future CMS cannot introduce a script through a rich-text field.
 *
 * Headings carry stable anchor ids so the sticky contents list on the service
 * template links to them, and section 32's scroll-margin keeps a focused anchor
 * clear of the sticky header.
 */
export function ContentSections({ sections }: { sections: Section[] }) {
  return (
    <div className="space-y-12 lg:space-y-16">
      {sections.map((section) => (
        <section key={section.id} aria-labelledby={section.id}>
          <SectionHeading id={section.id} className="mb-6 lg:mb-8">
            {section.heading}
          </SectionHeading>
          <div className="max-w-prose space-y-4">
            {section.body.map((paragraph) => (
              <p key={paragraph} className="text-body-lg text-muted">
                {paragraph}
              </p>
            ))}
          </div>
          {section.points && section.points.length > 0 ? (
            <ul className="mt-6 max-w-prose space-y-3">
              {section.points.map((point) => (
                <li key={point} className="flex gap-3 text-body text-text">
                  <span
                    aria-hidden="true"
                    className="mt-2.5 size-1.5 shrink-0 rounded-full bg-brand"
                  />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}
    </div>
  );
}

/** Sticky contents list for the service template (section 54, ~260px wide). */
export function ContentsList({
  sections,
  extra = [],
}: {
  sections: Section[];
  extra?: Array<{ id: string; heading: string }>;
}) {
  const entries = [...sections.map((s) => ({ id: s.id, heading: s.heading })), ...extra];

  return (
    <nav aria-label="On this page" className="lg:sticky lg:top-36">
      {/* Mobile: a disclosure above the body, per the section 54 wireframe. */}
      <details className="rounded-card border border-line bg-surface p-4 lg:hidden">
        <summary className="cursor-pointer list-none font-semibold text-anchor marker:content-none">
          On this page
        </summary>
        <ContentsLinks entries={entries} className="mt-3" />
      </details>

      <div className="hidden lg:block">
        <p className="mb-3 text-small font-semibold uppercase tracking-wide text-muted">
          On this page
        </p>
        <ContentsLinks entries={entries} />
      </div>
    </nav>
  );
}

function ContentsLinks({
  entries,
  className,
}: {
  entries: Array<{ id: string; heading: string }>;
  className?: string;
}) {
  return (
    <ul className={className}>
      {entries.map((entry) => (
        <li key={entry.id}>
          <a
            href={`#${entry.id}`}
            className="block py-2 text-body text-muted underline-offset-4 hover:text-brand hover:underline"
          >
            {entry.heading}
          </a>
        </li>
      ))}
    </ul>
  );
}

/** A labelled list block used for deliverables, capabilities and similar. */
export function ListBlock({
  id,
  heading,
  items,
  columns = 1,
}: {
  id: string;
  heading: string;
  items: readonly string[];
  columns?: 1 | 2;
}) {
  if (items.length === 0) return null;

  return (
    <section aria-labelledby={id}>
      <SectionHeading id={id} className="mb-6">
        {heading}
      </SectionHeading>
      <ul
        className={
          columns === 2
            ? "grid gap-3 sm:grid-cols-2"
            : "max-w-prose space-y-3"
        }
      >
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-body text-text">
            <span
              aria-hidden="true"
              className="mt-2.5 size-1.5 shrink-0 rounded-full bg-brand"
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
