import type { CSSProperties } from "react";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { TiltCard } from "@/components/motion/TiltCard";

type WorkflowCard = { title: string; body: string; flow: readonly string[] };

const flowColors = [
  "var(--color-brand)",
  "var(--color-accent)",
  "var(--color-info)",
] as const;

/*
 * Node highlight delays line up with the token's stops in `flow-token`
 * (the token reaches each node at 0s, ~1.7s and ~3.6s of the 4.5s loop).
 */
const nodeDelays = ["0s", "1.7s", "3.6s"];

/**
 * Module 10 — each workflow shape as a card whose three-step flow animates:
 * a token travels the track and lights each node as it passes. Pure CSS, so
 * it renders server-side and stops under reduced motion.
 */
export function WorkflowShowcase({
  cards,
}: {
  cards: readonly WorkflowCard[];
}) {
  return (
    <Stagger
      as="ul"
      stagger={0.1}
      className="m-0 grid list-none gap-4 p-0 md:grid-cols-3"
    >
      {cards.map((card, index) => {
        const color = flowColors[index % flowColors.length];
        return (
          <StaggerItem as="li" key={card.title} className="min-w-0">
            <TiltCard glow={color} max={5} className="h-full rounded-[1.5rem]">
              <article className="flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-hairline bg-canvas">
                <div className="relative overflow-hidden bg-surface px-6 pb-8 pt-10">
                  <div
                    aria-hidden="true"
                    className="dot-grid fade-mask absolute inset-0"
                  />
                  <div className="relative">
                    <div
                      aria-hidden="true"
                      className="absolute inset-x-10 top-1/2"
                    >
                      <div className="absolute inset-x-0 h-0.5 -translate-y-1/2 rounded-full bg-line" />
                      <span
                        className="flow-token absolute top-0 z-10 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-4 ring-surface"
                        style={{
                          backgroundColor: color,
                          animationDelay: `${index * -0.6}s`,
                        }}
                      />
                    </div>
                    <ol className="relative m-0 flex list-none justify-between gap-2 p-0">
                      {card.flow.map((step, stepIndex) => (
                        <li
                          key={step}
                          className="flow-node relative z-20 rounded-full border px-3 py-1.5 text-[0.75rem] font-medium shadow-soft"
                          style={
                            {
                              "--flow-color": color,
                              "--flow-delay": `calc(${nodeDelays[stepIndex] ?? "0s"} + ${index * -0.6}s)`,
                            } as CSSProperties
                          }
                        >
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <span className="font-mono text-xs text-dim">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 text-h3 font-semibold tracking-[-0.03em]">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-small leading-relaxed text-muted">
                    {card.body}
                  </p>
                </div>
              </article>
            </TiltCard>
          </StaggerItem>
        );
      })}
    </Stagger>
  );
}
