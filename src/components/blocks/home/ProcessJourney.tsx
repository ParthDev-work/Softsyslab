"use client";

import {
  AnimatePresence,
  MotionConfig,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useHasMounted } from "@/components/motion/useHasMounted";
import { REVEAL_EASE } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";

type Stage = { name: string; artifact: string };

const STEP_MS = 4200;

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function DocIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn("size-4", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    >
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M14 3v4h4M9 12h6M9 16h4" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Module 7 — replaces the scroll-driven orbit. Nine stages sit on a single
 * rail grouped into three phases. Selecting a stage (click, arrow keys, or
 * the gentle autoplay while the section is in view) shows the artifact that
 * stage hands over, and files it into a "project folder" that fills up as
 * the rail advances — the point of the module is that every stage leaves
 * something you can review.
 *
 * Autoplay pauses on hover or focus, stops for good after the first manual
 * selection, and has a visible pause control (WCAG 2.2.2). It never runs
 * under reduced motion. Nothing is scroll-jacked: the section scrolls like
 * any other, and on narrow screens the rail scrolls sideways on its own.
 */
export function ProcessJourney({
  stages,
  phases,
}: {
  stages: readonly Stage[];
  phases: readonly string[];
}) {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hovering, setHovering] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const inView = useInView(sectionRef, { amount: 0.35 });
  const mounted = useHasMounted();
  const shouldReduceMotion = useReducedMotion();

  const autoplay = mounted && !shouldReduceMotion && playing;
  const ticking = autoplay && inView && !hovering;
  const perPhase = Math.ceil(stages.length / phases.length);
  const stage = stages[active];
  const progress = stages.length > 1 ? active / (stages.length - 1) : 1;
  /* The line runs centre-of-first-node to centre-of-last-node. */
  const railInset = `${50 / stages.length}%`;

  useEffect(() => {
    if (!ticking) return;
    const id = window.setTimeout(
      () => setActive((current) => (current + 1) % stages.length),
      STEP_MS,
    );
    return () => window.clearTimeout(id);
  }, [active, ticking, stages.length]);

  /* Keep the active node centred inside the rail without moving the page. */
  useEffect(() => {
    const rail = railRef.current;
    const node = nodeRefs.current[active];
    if (!rail || !node || rail.scrollWidth <= rail.clientWidth) return;
    rail.scrollTo({
      left: node.offsetLeft - rail.clientWidth / 2 + node.clientWidth / 2,
      behavior: shouldReduceMotion ? "auto" : "smooth",
    });
  }, [active, shouldReduceMotion]);

  function select(index: number, focus = false) {
    const next = (index + stages.length) % stages.length;
    setActive(next);
    setPlaying(false);
    if (focus) nodeRefs.current[next]?.focus();
  }

  function handleKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const keys: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowDown: index + 1,
      ArrowLeft: index - 1,
      ArrowUp: index - 1,
      Home: 0,
      End: stages.length - 1,
    };
    if (event.key in keys) {
      event.preventDefault();
      select(keys[event.key], true);
    }
  }

  return (
    <MotionConfig reducedMotion="user">
      <div
        ref={sectionRef}
        onPointerEnter={() => setHovering(true)}
        onPointerLeave={() => setHovering(false)}
        onFocus={() => setHovering(true)}
        onBlur={() => setHovering(false)}
        className="rounded-[1.75rem] border border-hairline bg-canvas p-3 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.3)] sm:p-4"
      >
        {/* Rail */}
        <div
          ref={railRef}
          className="relative overflow-x-auto rounded-[1.25rem] bg-surface [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div
            className="grid min-w-[60rem] px-4 pb-6 pt-5"
            style={{
              gridTemplateColumns: `repeat(${stages.length}, minmax(0, 1fr))`,
            }}
          >
            {phases.map((phase, phaseIndex) => {
              const start = phaseIndex * perPhase;
              const current = active >= start && active < start + perPhase;
              return (
                <p
                  key={phase}
                  className={cn(
                    "m-0 mx-2 mb-5 flex items-center gap-2 border-b pb-2 font-mono text-[0.6875rem] uppercase tracking-[0.1em] transition-colors duration-300 motion-reduce:transition-none",
                    current
                      ? "border-brand text-brand"
                      : "border-line text-faint",
                  )}
                  style={{ gridColumn: `span ${perPhase} / span ${perPhase}` }}
                >
                  <span aria-hidden="true">{pad(phaseIndex + 1)}</span>
                  {phase}
                </p>
              );
            })}

            <div
              role="tablist"
              aria-label="Delivery stages"
              aria-orientation="horizontal"
              className="relative col-span-full grid"
              style={{
                gridTemplateColumns: `repeat(${stages.length}, minmax(0, 1fr))`,
              }}
            >
              <span
                aria-hidden="true"
                className="absolute top-5 h-0.5 rounded-full bg-line"
                style={{ left: railInset, right: railInset }}
              />
              <motion.span
                aria-hidden="true"
                className="absolute top-5 h-0.5 origin-left rounded-full bg-gradient-to-r from-brand to-accent"
                style={{ left: railInset, right: railInset }}
                initial={false}
                animate={{ scaleX: progress }}
                transition={{ duration: 0.6, ease: REVEAL_EASE }}
              />

              {stages.map((item, index) => {
                const isActive = index === active;
                const done = index < active;
                return (
                  <button
                    key={item.name}
                    ref={(node) => {
                      nodeRefs.current[index] = node;
                    }}
                    type="button"
                    role="tab"
                    id={`stage-tab-${index}`}
                    aria-selected={isActive}
                    aria-controls="stage-panel"
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => select(index)}
                    onKeyDown={(event) => handleKey(event, index)}
                    className="group relative flex flex-col items-center gap-3 rounded-card px-1 pb-1 text-center focus-visible:outline-offset-0"
                  >
                    <span className="relative grid size-10 place-items-center">
                      {isActive ? (
                        <motion.span
                          layoutId="stage-halo"
                          aria-hidden="true"
                          className="absolute -inset-1.5 rounded-full bg-brand/15"
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 30,
                          }}
                        />
                      ) : null}
                      <span
                        className={cn(
                          "relative grid size-10 place-items-center rounded-full border-2 font-mono text-xs font-medium transition-[background-color,border-color,color,transform] duration-300 motion-reduce:transition-none",
                          isActive &&
                            "scale-110 border-brand bg-brand text-white",
                          done && "border-brand bg-canvas text-brand",
                          !isActive &&
                            !done &&
                            "border-line bg-canvas text-dim group-hover:border-field group-hover:text-anchor",
                        )}
                      >
                        {done ? (
                          <svg
                            viewBox="0 0 16 16"
                            aria-hidden="true"
                            className="size-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M3.5 8.5 6.5 11.5 12.5 4.5" />
                          </svg>
                        ) : (
                          pad(index + 1)
                        )}
                      </span>
                    </span>
                    <span
                      className={cn(
                        "text-small font-semibold leading-tight transition-colors duration-200 motion-reduce:transition-none",
                        isActive
                          ? "text-anchor"
                          : "text-dim group-hover:text-anchor",
                      )}
                    >
                      {item.name}
                    </span>
                    <span
                      aria-hidden="true"
                      className="h-0.5 w-10 overflow-hidden rounded-full bg-transparent"
                    >
                      {isActive && autoplay ? (
                        <span
                          key={`${active}-${ticking}`}
                          className={cn(
                            "block h-full bg-brand",
                            ticking ? "progress-fill" : "w-0",
                          )}
                          style={{
                            ["--progress-duration" as string]: `${STEP_MS}ms`,
                          }}
                        />
                      ) : null}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Detail */}
        <div className="grid gap-4 pt-4 lg:grid-cols-[1.15fr_0.85fr]">
          <div
            id="stage-panel"
            role="tabpanel"
            aria-labelledby={`stage-tab-${active}`}
            className="relative flex flex-col overflow-hidden rounded-[1.25rem] bg-ink p-6 text-white sm:p-8"
          >
            <div
              aria-hidden="true"
              className="dot-grid-light absolute inset-0 opacity-40"
            />
            <div
              aria-hidden="true"
              className="aurora absolute -right-24 -top-24 size-72 rounded-full bg-brand/40 blur-3xl"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-10 right-4 select-none font-serif text-[10rem] italic leading-none text-white/[0.06]"
            >
              {pad(active + 1)}
            </span>

            <div className="relative mb-8 grid gap-8 sm:grid-cols-[1fr_auto] sm:items-start">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={stage.name}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.32, ease: REVEAL_EASE }}
                >
                  <p className="font-mono text-xs uppercase tracking-[0.12em] text-white/55">
                    Stage {pad(active + 1)} of {pad(stages.length)} ·{" "}
                    {phases[Math.floor(active / perPhase)]}
                  </p>
                  <h3 className="mt-3 text-[clamp(1.75rem,3.2vw,2.5rem)] font-semibold leading-tight tracking-[-0.04em] text-white">
                    {stage.name}
                  </h3>
                  <p className="mt-6 text-xs uppercase tracking-[0.12em] text-white/50">
                    You receive
                  </p>
                  <p className="mt-2 max-w-[30ch] text-body-lg text-white/90">
                    {stage.artifact}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* The artifact itself, as a small document that drops in. */}
              <div className="[perspective:900px]">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={stage.artifact}
                    aria-hidden="true"
                    className="relative w-44 rounded-card bg-canvas p-4 text-anchor shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)]"
                    initial={{ opacity: 0, rotateX: -35, y: -24 }}
                    animate={{ opacity: 1, rotateX: 0, y: 0 }}
                    exit={{ opacity: 0, rotateX: 20, y: 20 }}
                    transition={{ type: "spring", stiffness: 240, damping: 22 }}
                    style={{ transformOrigin: "top center" }}
                  >
                    <div className="flex items-center gap-2 text-brand">
                      <DocIcon />
                      <span className="font-mono text-[0.625rem] uppercase tracking-[0.1em]">
                        Artifact {pad(active + 1)}
                      </span>
                    </div>
                    <p className="mt-3 text-xs font-semibold leading-snug">
                      {stage.artifact}
                    </p>
                    <div className="mt-3 grid gap-1.5">
                      <span className="h-1.5 w-full rounded-full bg-tint" />
                      <span className="h-1.5 w-4/5 rounded-full bg-tint" />
                      <span className="h-1.5 w-3/5 rounded-full bg-tint" />
                    </div>
                    <motion.span
                      className="mt-4 inline-flex -rotate-6 items-center gap-1 rounded-chip border-2 border-success px-2 py-0.5 font-mono text-[0.5625rem] font-medium uppercase tracking-[0.1em] text-success"
                      initial={{ opacity: 0, scale: 1.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        delay: 0.35,
                        type: "spring",
                        stiffness: 500,
                        damping: 20,
                      }}
                    >
                      Ready for review
                    </motion.span>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="relative mt-auto flex flex-wrap items-center gap-3 border-t border-white/10 pt-5">
              <button
                type="button"
                onClick={() => select(active - 1)}
                aria-label="Previous stage"
                className="grid size-11 place-items-center rounded-full border border-white/20 text-white transition-colors hover:border-white hover:bg-white/10 motion-reduce:transition-none"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => select(active + 1)}
                aria-label="Next stage"
                className="grid size-11 place-items-center rounded-full bg-white text-anchor transition-transform hover:scale-105 motion-reduce:transition-none"
              >
                →
              </button>
              {mounted && !shouldReduceMotion ? (
                <button
                  type="button"
                  onClick={() => setPlaying((value) => !value)}
                  aria-pressed={!playing}
                  className="ml-auto inline-flex min-h-11 items-center gap-2 rounded-full px-3 font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-white/70 transition-colors hover:text-white motion-reduce:transition-none"
                >
                  <span aria-hidden="true">{playing ? "❚❚" : "▶"}</span>
                  {playing ? "Pause tour" : "Play tour"}
                </button>
              ) : null}
            </div>
          </div>

          {/* Project folder: one slot per stage, filling as the rail advances. */}
          <div className="rounded-[1.25rem] border border-hairline bg-paper p-5 sm:p-6">
            <div className="flex items-baseline justify-between gap-3">
              <p className="m-0 text-small font-semibold text-anchor">
                Your project folder
              </p>
              <p className="m-0 font-mono text-xs text-dim" aria-live="polite">
                {active + 1} / {stages.length} artifacts
              </p>
            </div>
            <ul className="m-0 mt-5 grid list-none grid-cols-3 gap-2.5 p-0">
              {stages.map((item, index) => {
                const filed = index <= active;
                const isActive = index === active;
                return (
                  <li key={item.name}>
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => select(index)}
                      aria-label={`${item.name}: ${item.artifact}`}
                      className={cn(
                        "relative flex aspect-[4/3] w-full flex-col justify-between overflow-hidden rounded-control border p-2.5 text-left transition-[border-color,background-color,box-shadow] duration-300 motion-reduce:transition-none",
                        filed
                          ? "border-hairline bg-canvas shadow-soft"
                          : "border-dashed border-line bg-transparent hover:border-field",
                        isActive && "border-brand ring-2 ring-brand/20",
                      )}
                    >
                      <span
                        className={cn(
                          "font-mono text-[0.625rem]",
                          filed ? "text-brand" : "text-faint",
                        )}
                      >
                        {pad(index + 1)}
                      </span>
                      <AnimatePresence initial={false}>
                        {filed ? (
                          <motion.span
                            key="doc"
                            className="flex items-center gap-1.5 text-[0.6875rem] font-medium leading-tight text-anchor"
                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 6 }}
                            transition={{
                              type: "spring",
                              stiffness: 380,
                              damping: 24,
                            }}
                          >
                            <DocIcon className="size-3.5 shrink-0 text-dim" />
                            <span className="truncate">{item.name}</span>
                          </motion.span>
                        ) : (
                          <motion.span
                            key="empty"
                            className="text-[0.6875rem] text-faint"
                          >
                            {item.name}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </button>
                  </li>
                );
              })}
            </ul>
            <p className="m-0 mt-5 text-xs leading-relaxed text-dim">
              Each stage should leave something reviewable behind. Select a slot
              to jump to its stage.
            </p>
          </div>
        </div>
      </div>
    </MotionConfig>
  );
}
