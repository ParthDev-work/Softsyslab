import { EditorialShell } from "@/components/blocks/editorial/EditorialShell";

const patternColors = [
  "var(--color-brand)",
  "var(--color-accent)",
  "var(--color-anchor)",
] as const;

export function EditorialWorkGrid({
  heading,
  note,
  cards,
}: {
  heading: string;
  note?: string;
  cards: ReadonlyArray<{ title: string; body: string }>;
}) {
  return (
    <section aria-labelledby="work-grid-h" className="pb-28 pt-8">
      <EditorialShell>
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4 border-b border-anchor pb-5">
          <h2
            id="work-grid-h"
            className="text-[clamp(1.75rem,3vw,2.75rem)] font-semibold leading-tight tracking-[-0.04em]"
          >
            {heading}
          </h2>
          {note ? (
            <span className="type-meta text-dim">{note}</span>
          ) : null}
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {cards.map((card, index) => (
            <article key={card.title} className="border border-line">
              <div
                className="aspect-[16/10] p-6"
                style={{
                  backgroundColor: patternColors[index % patternColors.length],
                }}
              >
                <div className="grid h-full grid-cols-3 gap-2 border border-white/40 p-3">
                  <div className="border border-white/40" />
                  <div className="col-span-2 flex flex-col gap-2">
                    <div className="h-1/3 border border-white/40" />
                    <div className="flex-1 border border-white/40" />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <span className="font-mono text-xs font-medium text-dim">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-10 text-h3 font-semibold tracking-[-0.03em]">
                  {card.title}
                </h3>
                <p className="mt-4 text-small leading-relaxed text-muted">
                  {card.body}
                </p>
              </div>
            </article>
          ))}
        </div>
      </EditorialShell>
    </section>
  );
}
