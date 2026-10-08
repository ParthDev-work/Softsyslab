"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { REVEAL_EASE } from "@/components/ui/Reveal";
import { useRevealGate } from "@/components/motion/useRevealGate";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";

/**
 * The client-side, animated counterparts to `ProcessCurveFigure` and
 * `SecurityBoundaryFigure` in `Figure.tsx`. Split out because they're the
 * only two figures used on the homepage (`WorkflowFigure` is reused on the
 * services/solutions detail pages and has no reason to ship Motion), so
 * keeping them here is what lets those other pages stay server components.
 *
 * Both figures draw in on scroll using the same progressive-enhancement
 * gate as `Reveal`/`Stagger` (see `useRevealGate`): the resting state is
 * fully drawn and visible, so a no-JS visitor sees the complete diagram
 * rather than an empty one, and reduced motion skips the draw-in outright.
 */

const steps = [
  {
    path: "M20,210 C135.5,210 188,55 230,55 C252,55 279.5,140 340,140",
    strokeClass: "stroke-line",
    baseWidth: 1.5,
    activeWidth: 2.25,
    dot: { cx: 40, cy: 250, r: 5.5, className: "fill-canvas stroke-anchor", hasStroke: true },
    label: {
      wrapClassName: "absolute left-0 top-[52%] max-w-37.5",
      eyebrowClassName: "text-anchor",
      eyebrow: "01",
      title: "Understand",
      body: "The work as it is",
    },
  },
  {
    path: "M35,225 C158.75,225 215,95 260,95 C282,95 309.5,150 370,150",
    strokeClass: "stroke-accent",
    baseWidth: 1.5,
    activeWidth: 2.25,
    dot: { cx: 230, cy: 55, r: 5.5, className: "fill-canvas stroke-dim", hasStroke: true },
    label: {
      wrapClassName: "absolute left-[46%] top-0 max-w-37.5",
      eyebrowClassName: "text-dim",
      eyebrow: "02",
      title: "Decide",
      body: "The system it needs",
    },
  },
  {
    path: "M40,250 C177.5,250 240,135 290,135 C316,135 348.5,185 420,185",
    strokeClass: "stroke-brand",
    baseWidth: 2.5,
    activeWidth: 3.25,
    dot: { cx: 420, cy: 185, r: 7, className: "fill-brand", hasStroke: false },
    label: {
      wrapClassName: "absolute right-0 top-[58%] max-w-42 text-right",
      eyebrowClassName: "text-brand",
      eyebrow: "03",
      title: "Release",
      body: "Software people can operate",
    },
  },
] as const;

export function ProcessCurveFigure() {
  const { ref, hidden } = useRevealGate<HTMLDivElement>();
  const [active, setActive] = useState<number | null>(null);

  return (
    <figure className="m-0 min-w-0 flex-5 basis-100">
      <div ref={ref} className="relative aspect-[23/16] w-full">
        <svg
          viewBox="0 0 460 320"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full overflow-visible"
        >
          {steps.map((step, index) => (
            <motion.path
              key={step.path}
              d={step.path}
              fill="none"
              className={step.strokeClass}
              initial={false}
              animate={{
                pathLength: hidden ? 0 : 1,
                opacity: hidden ? 0 : index === 1 ? 0.6 : 1,
                strokeWidth: active === index ? step.activeWidth : step.baseWidth,
              }}
              transition={{
                pathLength: { duration: 0.9, delay: index * 0.12, ease: REVEAL_EASE },
                opacity: { duration: 0.4, delay: index * 0.12 },
                strokeWidth: { duration: 0.2 },
              }}
            />
          ))}

          {steps.map((step, index) => (
            <motion.circle
              key={`${step.path}-dot`}
              cx={step.dot.cx}
              cy={step.dot.cy}
              r={step.dot.r}
              strokeWidth={step.dot.hasStroke ? 2 : undefined}
              className={step.dot.className}
              initial={false}
              animate={{ scale: hidden ? 0 : 1, opacity: hidden ? 0 : 1 }}
              style={{ originX: `${step.dot.cx}px`, originY: `${step.dot.cy}px` }}
              transition={{
                type: "spring",
                stiffness: 320,
                damping: 18,
                delay: 0.5 + index * 0.12,
              }}
            />
          ))}

          <motion.path
            d="M416,185 L419,188 L425,181"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="stroke-canvas"
            initial={false}
            animate={{ opacity: hidden ? 0 : 1 }}
            transition={{ duration: 0.3, delay: 0.85 }}
          />
        </svg>

        {steps.map((step, index) => (
          <motion.div
            key={step.label.title}
            className={step.label.wrapClassName}
            initial={false}
            animate={{ opacity: hidden ? 0 : 1, y: hidden ? 10 : 0 }}
            transition={{ duration: 0.4, delay: 0.5 + index * 0.12, ease: REVEAL_EASE }}
            onMouseEnter={() => setActive(index)}
            onMouseLeave={() => setActive(null)}
          >
            <p
              className={`font-mono text-[0.6875rem] uppercase tracking-[0.08em] ${step.label.eyebrowClassName}`}
            >
              {step.label.eyebrow} <span className="text-faint">/</span>{" "}
              {step.label.title}
            </p>
            <p className="mt-1 text-[0.9375rem] font-semibold text-anchor">
              {step.label.body}
            </p>
          </motion.div>
        ))}
      </div>
      <figcaption className="mt-3.5 font-mono text-xs text-dim">
        Illustrative — delivery narrows from open options to one operable
        release
      </figcaption>
    </figure>
  );
}

const boundaryNodes = [
  { name: "Web app", note: "output encoding" },
  { name: "API", note: "authz per resource" },
  { name: "Data store", note: "encrypted · backed up" },
] as const;

export function SecurityBoundaryFigure({ caption }: { caption: string }) {
  const { ref, hidden } = useRevealGate<HTMLDivElement>();

  return (
    <figure className="m-0 min-w-0 flex-1 basis-105">
      <motion.div
        ref={ref}
        className="rounded-card border border-ink-border p-6 font-mono text-xs leading-5"
        initial={false}
        animate={{ opacity: hidden ? 0 : 1, y: hidden ? 16 : 0 }}
        transition={{ duration: 0.5, ease: REVEAL_EASE }}
      >
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-chip border border-ink-line px-3 py-2 text-hairline">
            Users
          </span>
          <span
            aria-hidden="true"
            className="min-w-6 flex-1 border-t border-dashed border-ink-line"
          />
          <span className="text-faint">authenticated · least privilege</span>
        </div>

        <div className="relative mt-4 rounded-[10px] border border-dashed border-dim px-4 pb-4 pt-5">
          <span className="absolute -top-2.5 left-3.5 bg-ink px-2 font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-faint">
            Application boundary
          </span>
          <Stagger as="ul" className="grid gap-2.5 p-0 sm:grid-cols-3" stagger={0.08}>
            {boundaryNodes.map((node) => (
              <StaggerItem
                key={node.name}
                as="li"
                className="cursor-default rounded-chip bg-ink-raised p-3 text-surface"
              >
                <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.15 }}>
                  {node.name}
                  <span className="mt-1 block text-[0.6875rem] text-faint">
                    {node.note}
                  </span>
                </motion.div>
              </StaggerItem>
            ))}
          </Stagger>
          <p className="mt-3 flex flex-wrap justify-between gap-2 rounded-chip border border-ink-border px-3 py-2.5 text-faint">
            <span>Logs &amp; monitoring</span>
            <span>dependency review</span>
          </p>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className="text-faint">scoped credentials</span>
          <span
            aria-hidden="true"
            className="min-w-6 flex-1 border-t border-dashed border-ink-line"
          />
          <span className="rounded-chip border border-ink-line px-3 py-2 text-hairline">
            External services
          </span>
        </div>
      </motion.div>
      <figcaption className="mt-3.5 font-mono text-xs text-faint">
        {caption}
      </figcaption>
    </figure>
  );
}
