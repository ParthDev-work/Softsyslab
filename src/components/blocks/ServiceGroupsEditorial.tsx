import Link from "next/link";
import { EditorialShell } from "@/components/blocks/editorial/EditorialShell";
import { SpotlightCard } from "@/components/motion/SpotlightCard";

export type EditorialServiceGroup = {
  id: string;
  title: string;
  summary: string;
  items: ReadonlyArray<{ label: string; href: string }>;
};

/**
 * Services hub body: numbered rows with a narrative column and a ruled
 * link list — matches the Figma Make /services structure, brand tokens.
 */
export function ServiceGroupsEditorial({
  groups,
}: {
  groups: ReadonlyArray<EditorialServiceGroup>;
}) {
  return (
    <section aria-label="Service groups" className="pb-[clamp(4rem,9vw,7rem)]">
      <EditorialShell>
        <div className="divide-y divide-line border-t border-anchor">
          {groups.map((group, index) => (
            <SpotlightCard key={group.id} radius={320}>
              <article
                id={group.id}
                aria-labelledby={`${group.id}-h`}
                className="grid gap-8 py-10 lg:grid-cols-[4.5rem_minmax(0,1fr)_minmax(0,1fr)] lg:gap-x-10 lg:py-14"
              >
                <span
                  aria-hidden="true"
                  className="font-mono text-xs font-medium text-dim"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <h2
                    id={`${group.id}-h`}
                    className="max-w-xl text-[clamp(1.65rem,2.8vw,2.65rem)] font-semibold leading-[1.08] tracking-[-0.04em]"
                  >
                    {group.title}
                  </h2>
                  <p className="mt-5 max-w-lg text-body text-muted text-pretty">
                    {group.summary}
                  </p>
                </div>
                <ul className="m-0 list-none border-t border-line p-0 lg:min-w-0">
                  {group.items.map((item) => (
                    <li
                      key={item.href}
                      className="border-b border-line last:border-b-0"
                    >
                      <Link
                        href={item.href}
                        className="group flex items-center justify-between gap-4 py-4 text-[1.0625rem] font-medium text-anchor transition-colors duration-150 hover:text-brand motion-reduce:transition-none"
                      >
                        <span>{item.label}</span>
                        <span
                          aria-hidden="true"
                          className="text-faint transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
                        >
                          ↗
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </article>
            </SpotlightCard>
          ))}
        </div>
      </EditorialShell>
    </section>
  );
}
