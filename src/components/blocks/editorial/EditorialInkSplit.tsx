import type { ReactNode } from "react";
import { EditorialShell } from "@/components/blocks/editorial/EditorialShell";

export function EditorialInkSplit({
  eyebrow,
  headingId,
  heading,
  body,
  rows,
  aside,
}: {
  eyebrow: string;
  headingId: string;
  heading: string;
  body: string;
  rows?: ReadonlyArray<string>;
  aside?: ReactNode;
}) {
  return (
    <section
      aria-labelledby={headingId}
      className="bg-ink py-24 text-surface md:py-32"
    >
      <EditorialShell className="grid gap-16 lg:grid-cols-2">
        <div>
          <p className="type-eyebrow mb-7 text-brand">{eyebrow}</p>
          <h2
            id={headingId}
            className="max-w-[16ch] text-[clamp(2.25rem,5vw,4rem)] font-semibold leading-[0.95] tracking-[-0.05em] text-balance text-surface"
          >
            {heading}
          </h2>
        </div>
        <div className="self-end text-ink-line">
          <p className="mb-10 max-w-lg leading-relaxed text-pretty">{body}</p>
          {rows?.map((label, index) => (
            <div
              key={label}
              className="flex items-center gap-5 border-t border-ink-border py-5"
            >
              <span className="font-mono text-xs text-faint">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-xl font-medium text-surface">{label}</span>
            </div>
          ))}
          {aside}
        </div>
      </EditorialShell>
    </section>
  );
}
