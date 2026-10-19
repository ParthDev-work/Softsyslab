"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useState } from "react";
import { useHasMounted } from "@/components/motion/useHasMounted";
import { useRevealGate } from "@/components/motion/useRevealGate";
import { REVEAL_EASE } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";

type ApproachPhase = {
  title: string;
  hint: string;
  body: string;
};

export function EditorialStatementPanel({
  statement,
  support,
  phases,
}: {
  statement: string;
  support: string;
  phases: readonly ApproachPhase[];
}) {
  const [active, setActive] = useState(0);
  const { ref, hidden } = useRevealGate<HTMLElement>();
  const mounted = useHasMounted();
  const shouldReduceMotion = useReducedMotion();
  const motionOn = mounted && !shouldReduceMotion;

  const current = phases[active];

  const go = useCallback(
    (index: number) => {
      const next = (index + phases.length) % phases.length;
      setActive(next);
    },
    [phases.length],
  );

  return (
    <section
      ref={ref}
      aria-label="How we approach delivery"
      className="py-[clamp(2rem,5vw,3.5rem)]"
    >
      <div className="container-page">
        <motion.div
          className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand to-brand-hover text-white shadow-[0_40px_80px_-40px_var(--color-brand)]"
          initial={false}
          animate={{
            opacity: hidden ? 0 : 1,
            y: hidden ? 24 : 0,
          }}
          transition={{ duration: 0.55, ease: REVEAL_EASE }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-white/10 blur-3xl motion-reduce:hidden"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-16 left-1/4 size-56 rounded-full bg-accent/25 blur-3xl motion-reduce:hidden"
          />

          <div className="relative border-b border-white/15 px-6 py-5 md:px-10 md:py-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <p className="type-eyebrow m-0 text-white/90">Our approach</p>
              <p className="font-mono text-xs text-white/80">
                Step {String(active + 1).padStart(2, "0")} /{" "}
                {String(phases.length).padStart(2, "0")}
              </p>
            </div>
          </div>

          <div className="grid gap-10 p-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:gap-12 md:p-10 lg:p-14">
            <div className="flex min-h-0 flex-col justify-between gap-10">
              <div>
                <p className="max-w-xl text-[clamp(1.5rem,3vw,2.35rem)] font-semibold leading-tight tracking-[-0.04em] text-balance text-white">
                  {statement}
                </p>
                <p className="mt-5 max-w-lg text-small leading-relaxed text-white/90">
                  {support}
                </p>
              </div>

              <div
                className="rounded-card border border-hairline bg-canvas p-5 text-anchor shadow-soft md:p-6"
                role="tabpanel"
                id="approach-detail-panel"
                aria-labelledby={`approach-tab-${active}`}
              >
                <div className="relative min-h-[10.5rem] sm:min-h-[9.5rem]">
                  <AnimatePresence initial={false}>
                    <motion.div
                      key={current.title}
                      className="absolute inset-0"
                      initial={motionOn ? { opacity: 0 } : false}
                      animate={{ opacity: 1 }}
                      exit={motionOn ? { opacity: 0 } : undefined}
                      transition={{ duration: 0.18, ease: REVEAL_EASE }}
                    >
                      <p className="font-mono text-xs uppercase tracking-[0.14em] text-dim">
                        {current.hint}
                      </p>
                      <h3 className="mt-2 text-h3 font-semibold tracking-[-0.03em] text-anchor">
                        {current.title}
                      </h3>
                      <p className="mt-3 text-small leading-relaxed text-muted">
                        {current.body}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-hairline pt-5">
                  <button
                    type="button"
                    className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-control border border-line bg-surface text-anchor text-sm font-medium transition-colors hover:border-anchor hover:bg-tint motion-reduce:transition-none"
                    onClick={() => go(active - 1)}
                    aria-label="Previous step"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-control border border-line bg-surface text-anchor text-sm font-medium transition-colors hover:border-anchor hover:bg-tint motion-reduce:transition-none"
                    onClick={() => go(active + 1)}
                    aria-label="Next step"
                  >
                    →
                  </button>
                  <span className="text-xs text-dim">
                    Or select a phase on the right
                  </span>
                </div>
              </div>
            </div>

            <div
              className="grid grid-cols-2 gap-3 sm:gap-4"
              role="tablist"
              aria-label="Delivery phases"
            >
              {phases.map((phase, index) => {
                const isActive = index === active;
                return (
                  <motion.button
                    key={phase.title}
                    type="button"
                    role="tab"
                    id={`approach-tab-${index}`}
                    aria-selected={isActive}
                    aria-controls="approach-detail-panel"
                    tabIndex={isActive ? 0 : -1}
                    className={cn(
                      "group relative flex min-h-[7.5rem] flex-col justify-between rounded-card border p-4 text-left transition-colors motion-reduce:transition-none sm:min-h-36 sm:p-5",
                      isActive
                        ? "border-white bg-white text-anchor shadow-raised"
                        : "border-white/30 bg-white/10 text-white hover:border-white/50 hover:bg-white/15",
                    )}
                    onClick={() => setActive(index)}
                    onKeyDown={(event) => {
                      if (
                        event.key === "ArrowRight" ||
                        event.key === "ArrowDown"
                      ) {
                        event.preventDefault();
                        go(index + 1);
                      }
                      if (
                        event.key === "ArrowLeft" ||
                        event.key === "ArrowUp"
                      ) {
                        event.preventDefault();
                        go(index - 1);
                      }
                    }}
                    whileHover={motionOn && !isActive ? { y: -3 } : undefined}
                    whileTap={motionOn ? { scale: 0.98 } : undefined}
                  >
                    <span
                      className={cn(
                        "font-mono text-xs",
                        isActive ? "text-dim" : "text-white/75",
                      )}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={cn(
                        "text-base font-semibold tracking-[-0.02em] sm:text-lg",
                        isActive ? "text-anchor" : "text-white",
                      )}
                    >
                      {phase.title}
                    </span>
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute bottom-4 right-4 text-lg transition-transform duration-300 motion-reduce:transition-none",
                        isActive
                          ? "translate-x-0 text-brand opacity-100"
                          : "translate-x-[-4px] text-white opacity-0 group-hover:translate-x-0 group-hover:opacity-80",
                      )}
                    >
                      →
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
