"use client";

import {
  AnimatePresence,
  MotionConfig,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { LinkButton } from "@/components/ui/Button";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { useHasMounted } from "@/components/motion/useHasMounted";
import { REVEAL_EASE } from "@/components/ui/Reveal";
import { Pill } from "@/components/blocks/home/HomeSectionHeader";
import { cn } from "@/lib/cn";

type Cta = { label: string; href: string };

const CYCLE_MS = 3800;

/* The three beats the old hero curve illustrated, now as console tabs. */
const consoleTabs = [
  { key: "understand", label: "Understand", note: "The work as it is" },
  { key: "decide", label: "Decide", note: "The system it needs" },
  { key: "release", label: "Release", note: "Software people can operate" },
] as const;

const workflowNodes = ["Request", "Review", "Approve", "Notify"] as const;

const backlog = [
  { label: "Role-based access", state: "in" },
  { label: "Approval workflow", state: "in" },
  { label: "Bulk data import", state: "deferred" },
  { label: "Reporting dashboard", state: "in" },
] as const;

const releaseChecks = [
  "Acceptance tests pass",
  "Rollback rehearsed",
  "Alert owner named",
] as const;

function Check({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className={cn("size-3.5", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3.5 8.5 6.5 11.5 12.5 4.5" />
    </svg>
  );
}

function UnderstandPanel() {
  return (
    <div className="grid h-full content-center gap-5">
      <p className="type-meta text-dim">Workflow map · current state</p>
      <div className="relative grid grid-cols-4 items-center gap-2">
        <svg
          aria-hidden="true"
          className="absolute inset-x-[12%] top-1/2 h-px w-[76%] -translate-y-1/2 overflow-visible"
          preserveAspectRatio="none"
          viewBox="0 0 100 1"
        >
          <motion.line
            x1="0"
            y1="0.5"
            x2="100"
            y2="0.5"
            className="stroke-line"
            strokeWidth="2"
            strokeDasharray="3 3"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.9, ease: REVEAL_EASE }}
          />
        </svg>
        {workflowNodes.map((node, index) => (
          <motion.div
            key={node}
            className={cn(
              "relative z-10 grid place-items-center rounded-control border px-1 py-3 text-center text-[0.75rem] font-medium",
              index === 1
                ? "border-warning-line bg-warning-bg text-warning"
                : "border-hairline bg-canvas text-anchor",
            )}
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              delay: 0.12 * index,
              type: "spring",
              stiffness: 300,
              damping: 22,
            }}
          >
            {node}
          </motion.div>
        ))}
      </div>
      <motion.div
        className="flex items-start gap-2.5 rounded-control border border-warning-line bg-warning-bg/60 p-3 text-xs text-warning"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4, ease: REVEAL_EASE }}
      >
        <span
          aria-hidden="true"
          className="mt-1 size-1.5 shrink-0 rounded-full bg-warning"
        />
        Manual review step found — two days of waiting per request.
      </motion.div>
    </div>
  );
}

function DecidePanel() {
  return (
    <div className="grid h-full content-center gap-3">
      <p className="type-meta text-dim">First release · scope</p>
      <ul className="m-0 grid list-none gap-2 p-0">
        {backlog.map((item, index) => {
          const deferred = item.state === "deferred";
          return (
            <motion.li
              key={item.label}
              className="flex items-center justify-between gap-3 rounded-control border border-hairline bg-canvas px-3 py-2.5 text-[0.8125rem]"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.09 * index,
                duration: 0.4,
                ease: REVEAL_EASE,
              }}
            >
              <span className="flex items-center gap-2.5">
                <motion.span
                  className={cn(
                    "grid size-5 place-items-center rounded-full",
                    deferred ? "bg-tint text-faint" : "bg-brand text-white",
                  )}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: 0.25 + 0.09 * index,
                    type: "spring",
                    stiffness: 420,
                    damping: 18,
                  }}
                >
                  {deferred ? (
                    <span
                      aria-hidden="true"
                      className="h-0.5 w-2 rounded bg-current"
                    />
                  ) : (
                    <Check className="size-3" />
                  )}
                </motion.span>
                <span
                  className={cn(
                    deferred ? "text-dim line-through" : "text-anchor",
                  )}
                >
                  {item.label}
                </span>
              </span>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 font-mono text-[0.625rem] uppercase tracking-[0.08em]",
                  deferred ? "bg-tint text-dim" : "bg-info-bg text-info",
                )}
              >
                {deferred ? "Deferred" : "Release 1"}
              </span>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}

function ReleasePanel() {
  return (
    <div className="grid h-full content-center gap-4">
      <div className="flex items-center justify-between">
        <p className="type-meta text-dim">Release candidate</p>
        <motion.span
          className="inline-flex items-center gap-1.5 rounded-full bg-success-bg px-2.5 py-1 font-mono text-[0.625rem] uppercase tracking-[0.08em] text-success"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: 1.1,
            type: "spring",
            stiffness: 300,
            damping: 18,
          }}
        >
          <span className="relative flex size-1.5">
            <span className="ping-soft absolute inline-flex size-full rounded-full bg-success" />
            <span className="relative inline-flex size-1.5 rounded-full bg-success" />
          </span>
          Ready
        </motion.span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-tint">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-brand to-accent"
          initial={{ width: "8%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.1, ease: REVEAL_EASE }}
        />
      </div>
      <ul className="m-0 grid list-none gap-2 p-0">
        {releaseChecks.map((check, index) => (
          <motion.li
            key={check}
            className="flex items-center gap-2.5 text-[0.8125rem] text-anchor"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 + 0.2 * index, duration: 0.35 }}
          >
            <span className="grid size-5 place-items-center rounded-full bg-success-bg text-success">
              <Check className="size-3" />
            </span>
            {check}
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

const panels = {
  understand: UnderstandPanel,
  decide: DecidePanel,
  release: ReleasePanel,
} as const;

/**
 * The hero's illustration: a small product console that cycles through the
 * three beats of a project. Tabs are real buttons — clicking one takes over
 * from the auto-cycle — and the whole window tilts toward the pointer.
 */
function BuildConsole() {
  const mounted = useHasMounted();
  const shouldReduceMotion = useReducedMotion();
  const motionOn = mounted && !shouldReduceMotion;
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 160, damping: 20 };
  const rotateX = useSpring(useTransform(py, [0, 1], [7, -7]), spring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-9, 9]), spring);

  const cycling = motionOn && auto;

  useEffect(() => {
    if (!cycling) return;
    const id = window.setTimeout(
      () => setActive((current) => (current + 1) % consoleTabs.length),
      CYCLE_MS,
    );
    return () => window.clearTimeout(id);
  }, [active, cycling]);

  function handleMove(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((event.clientX - rect.left) / rect.width);
    py.set((event.clientY - rect.top) / rect.height);
  }

  const tab = consoleTabs[active];
  const Panel = panels[tab.key];

  return (
    <MotionConfig reducedMotion="user">
      <figure className="relative m-0 min-w-0 flex-5 basis-100 [perspective:1200px]">
        <div
          aria-hidden="true"
          className="aurora pointer-events-none absolute -inset-10 -z-10 rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--color-brand)_22%,transparent),transparent)] blur-2xl"
        />
        <motion.div
          ref={ref}
          onPointerMove={handleMove}
          onPointerLeave={() => {
            px.set(0.5);
            py.set(0.5);
          }}
          style={motionOn ? { rotateX, rotateY } : undefined}
          className="relative rounded-[1.25rem] border border-hairline bg-canvas/90 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.35)] backdrop-blur"
        >
          <div className="flex items-center gap-3 border-b border-hairline px-4 py-3">
            <span aria-hidden="true" className="flex gap-1.5">
              <span className="size-2.5 rounded-full bg-danger-line" />
              <span className="size-2.5 rounded-full bg-warning-line" />
              <span className="size-2.5 rounded-full bg-success-line" />
            </span>
            <span className="flex-1 truncate rounded-chip bg-surface px-3 py-1 text-center font-mono text-[0.6875rem] text-dim">
              project / {tab.key}
            </span>
          </div>

          <div
            role="tablist"
            aria-label="Project stages"
            className="grid grid-cols-3 gap-1 border-b border-hairline p-1.5"
          >
            {consoleTabs.map((item, index) => {
              const isActive = index === active;
              return (
                <button
                  key={item.key}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="hero-console-panel"
                  id={`hero-tab-${item.key}`}
                  onClick={() => {
                    setActive(index);
                    setAuto(false);
                  }}
                  className={cn(
                    "relative overflow-hidden rounded-control px-2 py-2.5 text-left transition-colors duration-200 motion-reduce:transition-none",
                    isActive ? "bg-surface" : "hover:bg-surface/70",
                  )}
                >
                  <span
                    className={cn(
                      "block font-mono text-[0.625rem] uppercase tracking-[0.08em]",
                      isActive ? "text-brand" : "text-faint",
                    )}
                  >
                    0{index + 1}
                  </span>
                  <span
                    className={cn(
                      "block text-[0.8125rem] font-semibold",
                      isActive ? "text-anchor" : "text-dim",
                    )}
                  >
                    {item.label}
                  </span>
                  {isActive ? (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-2 bottom-1 h-0.5 overflow-hidden rounded-full bg-hairline"
                    >
                      <span
                        key={`${active}-${cycling}`}
                        className={cn(
                          "block h-full rounded-full bg-brand",
                          cycling && "progress-fill",
                        )}
                        style={{
                          ["--progress-duration" as string]: `${CYCLE_MS}ms`,
                        }}
                      />
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>

          <div
            id="hero-console-panel"
            role="tabpanel"
            aria-labelledby={`hero-tab-${tab.key}`}
            className="relative h-[17.5rem] overflow-hidden p-5 sm:p-6"
          >
            <div
              aria-hidden="true"
              className="dot-grid fade-mask absolute inset-0 opacity-60"
            />
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={tab.key}
                className="relative h-full"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: REVEAL_EASE }}
              >
                <Panel />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-hairline px-5 py-3">
            <span className="text-xs font-medium text-anchor">{tab.note}</span>
            <span className="font-mono text-[0.625rem] uppercase tracking-[0.08em] text-faint">
              Step {active + 1} / {consoleTabs.length}
            </span>
          </div>
        </motion.div>

        <div
          aria-hidden="true"
          className="float-y absolute -top-5 right-4 hidden rounded-full border border-hairline bg-canvas px-3.5 py-2 text-xs font-medium text-anchor shadow-raised sm:flex sm:items-center sm:gap-2"
        >
          <span className="grid size-4 place-items-center rounded-full bg-brand text-white">
            <Check className="size-2.5" />
          </span>
          Scope agreed in writing
        </div>
        <div
          aria-hidden="true"
          className="float-y absolute bottom-10 left-6 hidden rounded-full border border-hairline bg-canvas px-3.5 py-2 text-xs font-medium text-anchor shadow-raised [animation-delay:-3s] sm:flex sm:items-center sm:gap-2"
        >
          <span className="grid size-4 place-items-center rounded-full bg-accent text-white">
            <Check className="size-2.5" />
          </span>
          Code in a repository you own
        </div>

        <figcaption className="mt-14 text-center font-mono text-xs text-dim">
          Illustrative — not delivered client work
        </figcaption>
      </figure>
    </MotionConfig>
  );
}

/**
 * Homepage hero. Copy enters with CSS keyframes rather than Motion so the
 * server-rendered frame already ends visible (`animation-fill-mode: both`)
 * and reduced motion collapses it via the global rule. A soft brand glow
 * follows the pointer across the whole hero.
 */
export function HomeHero({
  headingId,
  eyebrow,
  h1,
  body,
  supportingLine,
  primaryCta,
  secondaryCta,
}: {
  headingId: string;
  eyebrow: string;
  h1: string;
  body: string;
  supportingLine: string;
  primaryCta: Cta;
  secondaryCta: Cta;
}) {
  const gx = useMotionValue(70);
  const gy = useMotionValue(30);
  const glow = useMotionTemplate`radial-gradient(600px circle at ${gx}% ${gy}%, color-mix(in srgb, var(--color-brand) 10%, transparent), transparent 70%)`;

  function handleMove(event: PointerEvent<HTMLElement>) {
    if (event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    gx.set(((event.clientX - rect.left) / rect.width) * 100);
    gy.set(((event.clientY - rect.top) / rect.height) * 100);
  }

  const words = h1.split(" ");
  const lead = words.slice(0, -2).join(" ");
  const accent = words.slice(-2).join(" ");

  return (
    <section
      id="hero"
      aria-labelledby={headingId}
      onPointerMove={handleMove}
      className="relative isolate overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="dot-grid fade-mask absolute inset-0 -z-20"
      />
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{ background: glow }}
      />
      <div
        aria-hidden="true"
        className="aurora absolute -left-40 -top-40 -z-10 size-[28rem] rounded-full bg-accent/10 blur-3xl"
      />

      <div className="container-page pb-[clamp(3.5rem,8vw,6.5rem)] pt-[clamp(3rem,7vw,5.5rem)]">
        <div className="flex flex-wrap items-center gap-x-[clamp(2.5rem,6vw,5rem)] gap-y-14">
          <div className="min-w-0 max-w-155 flex-7 basis-115">
            <div className="rise-in">
              <Pill>{eyebrow}</Pill>
            </div>
            <h1
              id={headingId}
              className="type-display rise-in mt-7 max-w-[12ch] [animation-delay:80ms]"
            >
              {lead}{" "}
              <span className="relative inline-block">
                <span className="text-gradient-brand pb-1">{accent}</span>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 300 16"
                  preserveAspectRatio="none"
                  className="absolute -bottom-1 left-0 h-3 w-full overflow-visible"
                >
                  <path
                    d="M4 11 C 70 3, 150 3, 296 9"
                    pathLength={1}
                    fill="none"
                    strokeWidth="5"
                    strokeLinecap="round"
                    className="linemark-draw stroke-brand/35 [animation-delay:700ms]"
                  />
                </svg>
              </span>
            </h1>
            <p className="type-lead rise-in mt-8 max-w-[54ch] [animation-delay:160ms]">
              {body}
            </p>

            <div className="rise-in mt-10 flex flex-wrap gap-3 [animation-delay:240ms]">
              <MagneticButton strength={0.2}>
                <LinkButton
                  href={primaryCta.href}
                  size="lg"
                  className="rounded-full shadow-[0_12px_30px_-10px_var(--color-brand)]"
                >
                  {primaryCta.label}
                  <span aria-hidden="true">→</span>
                </LinkButton>
              </MagneticButton>
              <LinkButton
                href={secondaryCta.href}
                variant="outline"
                size="lg"
                className="rounded-full"
              >
                {secondaryCta.label}
              </LinkButton>
            </div>

            <p className="rise-in mt-9 flex max-w-[48ch] items-start gap-3 text-small text-muted [animation-delay:320ms]">
              <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-success-bg text-success">
                <Check className="size-3" />
              </span>
              {supportingLine}
            </p>
          </div>

          <div className="rise-in flex min-w-0 flex-5 basis-100 [animation-delay:200ms]">
            <BuildConsole />
          </div>
        </div>
      </div>
    </section>
  );
}
