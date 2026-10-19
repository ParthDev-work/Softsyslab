import { EditorialShell } from "@/components/blocks/editorial/EditorialShell";

export function EditorialStageGrid({
  heading,
  intro,
  stages,
}: {
  heading: string;
  intro: string;
  stages: ReadonlyArray<{ name: string; artifact: string }>;
}) {
  return (
    <section aria-labelledby="stage-grid-h" className="bg-ink text-surface">
      <EditorialShell className="py-24 md:py-32">
        <div className="mb-12 max-w-3xl">
          <h2
            id="stage-grid-h"
            className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-semibold tracking-[-0.04em]"
          >
            {heading}
          </h2>
          <p className="mt-4 text-body-lg text-ink-line text-pretty">{intro}</p>
        </div>
        <div className="grid gap-px bg-ink-border md:grid-cols-2 lg:grid-cols-3">
          {stages.map((stage, index) => (
            <article
              key={stage.name}
              className="flex min-h-80 flex-col justify-between bg-ink p-7"
            >
              <div className="flex justify-between gap-4">
                <span className="font-mono text-xs text-brand">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-[0.625rem] uppercase tracking-[0.15em] text-faint">
                  Stage
                </span>
              </div>
              <div>
                <h3 className="text-h3 font-semibold tracking-[-0.03em]">
                  {stage.name}
                </h3>
                <p className="mt-4 text-small leading-relaxed text-ink-line">
                  <span className="text-faint">Artifact — </span>
                  {stage.artifact}
                </p>
              </div>
            </article>
          ))}
        </div>
      </EditorialShell>
    </section>
  );
}
