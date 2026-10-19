"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { EditorialShell } from "@/components/blocks/editorial/EditorialShell";
import { cn } from "@/lib/cn";

type Capability = {
  number: string;
  title: string;
  copy: string;
  beat: string;
  tags: string[];
  href: string;
  accent: string;
};

type HelixPoint = { y: number; lx: number; rx: number };

const DNA_VIEW_HEIGHT = 100;

function tileCenterPercent(index: number, count: number) {
  return ((index + 0.5) / count) * 100;
}

function helixPoints(count: number): HelixPoint[] {
  const twist = 12;
  return Array.from({ length: count }, (_, index) => ({
    y: tileCenterPercent(index, count),
    lx: 54 + (index % 2 === 0 ? 0 : twist),
    rx: 106 - (index % 2 === 0 ? 0 : twist),
  }));
}

function strandPath(points: HelixPoint[], side: "l" | "r", lastIndex: number) {
  const slice = points.slice(0, lastIndex + 1);
  if (slice.length === 0) return "";
  return slice
    .map((point, index) => {
      const x = side === "l" ? point.lx : point.rx;
      return `${index === 0 ? "M" : "L"} ${x} ${point.y}`;
    })
    .join(" ");
}

function CapabilityDnaChart({
  litUpTo,
  highlightIndex,
  stages,
  className,
}: {
  litUpTo: number;
  highlightIndex: number;
  stages: Capability[];
  className?: string;
}) {
  const points = helixPoints(stages.length);

  return (
    <svg
      viewBox={`0 0 160 ${DNA_VIEW_HEIGHT}`}
      preserveAspectRatio="xMidYMid meet"
      className={cn(
        "h-full w-full transition-all duration-500 motion-reduce:transition-none",
        className,
      )}
      fill="none"
      aria-hidden="true"
    >
      <path
        d={strandPath(points, "l", stages.length - 1)}
        className="stroke-white/12"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d={strandPath(points, "r", stages.length - 1)}
        className="stroke-white/12"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d={strandPath(points, "l", litUpTo)}
        className="capability-flow-spine stroke-white/55"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d={strandPath(points, "r", litUpTo)}
        className="capability-flow-spine stroke-white/55"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {points.map((point, index) => {
        const lit = index <= litUpTo;
        const isHighlight = index === highlightIndex;
        const stage = stages[index];

        return (
          <g key={stage.number}>
            <line
              x1={point.lx}
              y1={point.y}
              x2={point.rx}
              y2={point.y}
              className={cn(
                "transition-[stroke,stroke-width,opacity] duration-500 motion-reduce:transition-none",
                lit
                  ? isHighlight
                    ? "capability-dna-rung"
                    : "stroke-white/40"
                  : "stroke-white/10",
              )}
              strokeWidth={isHighlight ? 3.5 : lit ? 2 : 1}
              strokeDasharray={lit ? undefined : "4 6"}
              style={
                isHighlight
                  ? {
                      stroke: stage.accent,
                    }
                  : undefined
              }
            />
            <circle
              cx={point.lx}
              cy={point.y}
              r={isHighlight ? 5 : 3.5}
              className={cn(
                "transition-all duration-300 motion-reduce:transition-none",
                lit ? "opacity-100" : "opacity-20",
                isHighlight && "capability-pulse",
              )}
              fill={lit ? stage.accent : "rgba(255,255,255,0.15)"}
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="1"
            />
            <circle
              cx={point.rx}
              cy={point.y}
              r={isHighlight ? 5 : 3.5}
              className={cn(
                "transition-all duration-300 motion-reduce:transition-none",
                lit ? "opacity-100" : "opacity-20",
                isHighlight && "capability-pulse",
              )}
              fill={lit ? stage.accent : "rgba(255,255,255,0.15)"}
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="1"
            />
          </g>
        );
      })}
    </svg>
  );
}

function Arrow({ diagonal }: { diagonal?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={`size-5 ${diagonal ? "-rotate-45" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}

export function CapabilityBoard({
  eyebrow,
  heading,
  intro,
  capabilities,
}: {
  eyebrow: string;
  heading: string;
  intro: string;
  capabilities: Capability[];
}) {
  const [active, setActive] = useState(0);
  const current = capabilities[active];

  function select(index: number) {
    setActive(index);
  }

  return (
    <section aria-labelledby="cap-board-h" className="py-24 md:py-32">
      <EditorialShell>
        <div className="mb-12 grid gap-8 border-t border-anchor pt-10 md:mb-14 md:grid-cols-[0.75fr_1.25fr] md:pt-12">
          <div>
            <p className="type-eyebrow text-brand">{eyebrow}</p>
            <p className="mt-5 max-w-sm text-small leading-relaxed text-muted">
              {intro}
            </p>
          </div>
          <h2
            id="cap-board-h"
            className="max-w-3xl text-[clamp(2rem,4.5vw,3.5rem)] font-semibold leading-tight tracking-[-0.05em] text-balance text-anchor"
          >
            {heading}
          </h2>
        </div>

        <div className="capability-board grid overflow-hidden border border-hairline bg-canvas lg:grid-cols-[0.86fr_1.14fr] lg:items-stretch">
          <div className="divide-y divide-hairline bg-surface/40">
            {capabilities.map((capability, index) => {
              const isActive = active === index;
              return (
                <button
                  key={capability.number}
                  type="button"
                  className={cn(
                    "group relative grid w-full grid-cols-[2.75rem_1fr_auto] items-center gap-3 px-5 py-5 text-left transition-[background-color,box-shadow,color] duration-200 md:px-7 motion-reduce:transition-none",
                    isActive
                      ? "bg-brand text-white shadow-[inset_4px_0_0_0_var(--color-canvas)]"
                      : "text-anchor hover:bg-canvas",
                  )}
                  onMouseEnter={() => select(index)}
                  onFocus={() => select(index)}
                  onClick={() => select(index)}
                  aria-pressed={isActive}
                >
                  <span
                    className={cn(
                      "font-mono text-[0.625rem] font-medium tabular-nums",
                      isActive ? "text-white/75" : "text-dim",
                    )}
                  >
                    {capability.number}
                  </span>
                  <span className="text-lg font-semibold tracking-[-0.03em] md:text-xl">
                    {capability.title}
                  </span>
                  <span
                    className={cn(
                      "transition-transform duration-300 motion-reduce:transition-none",
                      isActive
                        ? "translate-x-0 text-white/90 opacity-100"
                        : "-translate-x-2 text-brand opacity-0 group-hover:translate-x-0 group-hover:opacity-100",
                    )}
                  >
                    <Arrow />
                  </span>
                </button>
              );
            })}
          </div>

          <div
            className="capability-panel relative flex min-h-0 flex-col overflow-hidden p-5 text-white md:p-7 lg:min-h-full"
            style={
              {
                "--capability-accent": current.accent,
              } as CSSProperties
            }
          >
            <div
              aria-hidden="true"
              className="capability-panel-glow pointer-events-none absolute inset-0"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -top-4 -right-1 select-none font-serif text-[9rem] leading-none text-white/[0.07] italic md:text-[12rem]"
            >
              {current.number}
            </span>

            <div className="relative z-10 flex h-full min-h-0 flex-col">
              <div className="flex min-h-[10rem] flex-1 items-center justify-center border-b border-white/12 px-2 py-4 sm:min-h-[11rem]">
                <CapabilityDnaChart
                  litUpTo={active}
                  highlightIndex={active}
                  stages={capabilities}
                  className="mx-auto h-full max-h-[12rem] w-full max-w-[11rem] sm:max-h-[13rem] sm:max-w-[12rem]"
                />
              </div>

              <div className="grid gap-6 pt-6 md:grid-cols-[1fr_auto] md:items-end">
                <div key={current.title} className="capability-copy">
                  <p className="font-mono text-xs text-white/50">
                    Chapter {current.number}
                  </p>
                  <h3 className="mt-2 text-h3 font-semibold tracking-[-0.04em] text-white md:text-h2">
                    {current.title}
                  </h3>
                  <p className="mt-3 max-w-lg text-small leading-relaxed text-white/75">
                    {current.copy}
                  </p>
                  <p className="mt-3 text-xs leading-relaxed text-white/60">
                    {current.beat}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {current.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[0.625rem] font-medium uppercase tracking-[0.1em] text-white/80 backdrop-blur-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <Link
                  href={current.href}
                  className="grid size-12 place-items-center rounded-card bg-white text-brand shadow-soft transition-[transform,background-color,color] hover:-translate-y-0.5 hover:translate-x-0.5 hover:bg-brand hover:text-white motion-reduce:transition-none md:size-14"
                  aria-label={`Explore ${current.title}`}
                >
                  <Arrow diagonal />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </EditorialShell>
    </section>
  );
}
