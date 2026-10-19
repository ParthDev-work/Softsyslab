"use client";

import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import Link from "next/link";
import { useState, type KeyboardEvent } from "react";
import { REVEAL_EASE } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";

type ServiceGroup = {
  id: string;
  title: string;
  summary: string;
  items: ReadonlyArray<{ label: string; href: string }>;
};

/**
 * Module 6 — the five service groups as a tab explorer: a list on the left
 * (a scrolling chip row on narrow screens), and a detail card on the right
 * with the group's two links. Hover previews on desktop; click, focus or
 * arrow keys select everywhere.
 */
export function ServiceExplorer({
  groups,
}: {
  groups: readonly ServiceGroup[];
}) {
  const [active, setActive] = useState(0);
  const group = groups[active];

  function handleKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const delta =
      event.key === "ArrowDown" || event.key === "ArrowRight"
        ? 1
        : event.key === "ArrowUp" || event.key === "ArrowLeft"
          ? -1
          : 0;
    if (!delta) return;
    event.preventDefault();
    const next = (index + delta + groups.length) % groups.length;
    setActive(next);
    document.getElementById(`svc-tab-${next}`)?.focus();
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr] lg:gap-6">
        <div
          role="tablist"
          aria-label="Service groups"
          aria-orientation="vertical"
          className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0"
        >
          {groups.map((item, index) => {
            const isActive = index === active;
            return (
              <button
                key={item.id}
                id={`svc-tab-${index}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls="svc-panel"
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActive(index)}
                onMouseEnter={() => setActive(index)}
                onKeyDown={(event) => handleKey(event, index)}
                className={cn(
                  "group relative flex shrink-0 items-center gap-4 rounded-2xl px-5 py-4 text-left transition-colors duration-200 motion-reduce:transition-none lg:py-5",
                  isActive
                    ? "text-white"
                    : "bg-canvas text-anchor hover:bg-tint lg:bg-transparent",
                )}
              >
                {isActive ? (
                  <motion.span
                    layoutId="svc-active"
                    aria-hidden="true"
                    className="absolute inset-0 rounded-2xl bg-anchor"
                    transition={{ type: "spring", stiffness: 400, damping: 34 }}
                  />
                ) : null}
                <span
                  className={cn(
                    "relative font-mono text-xs",
                    isActive ? "text-white/60" : "text-dim",
                  )}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="relative whitespace-nowrap text-body-lg font-semibold tracking-[-0.02em] lg:text-[1.375rem]">
                  {item.title}
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "relative ml-auto hidden transition-[transform,opacity] duration-300 motion-reduce:transition-none lg:inline",
                    isActive
                      ? "translate-x-0 opacity-100"
                      : "-translate-x-2 opacity-0",
                  )}
                >
                  →
                </span>
              </button>
            );
          })}
        </div>

        <div
          id="svc-panel"
          role="tabpanel"
          aria-labelledby={`svc-tab-${active}`}
          className="relative min-h-[22rem] overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-brand to-brand-hover p-7 text-white sm:p-10"
        >
          <div
            aria-hidden="true"
            className="dot-grid-light absolute inset-0 opacity-50"
          />
          <div
            aria-hidden="true"
            className="aurora absolute -bottom-24 -right-16 size-80 rounded-full bg-accent/50 blur-3xl"
          />
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={group.id}
              className="relative flex h-full flex-col"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: REVEAL_EASE }}
            >
              <span
                aria-hidden="true"
                className="font-serif text-[5rem] italic leading-none text-white/25"
              >
                {String(active + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-tight tracking-[-0.04em] text-white">
                {group.title}
              </h3>
              <p className="mt-3 max-w-[40ch] text-body-lg text-white/85">
                {group.summary}
              </p>
              <ul className="m-0 mt-auto grid list-none gap-2 p-0 pt-10 sm:grid-cols-2">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="group flex min-h-12 items-center justify-between gap-3 rounded-2xl bg-white/10 px-4 py-3 text-small font-medium text-white backdrop-blur transition-colors hover:bg-white hover:text-brand motion-reduce:transition-none"
                    >
                      {item.label}
                      <span
                        aria-hidden="true"
                        className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none"
                      >
                        ↗
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </MotionConfig>
  );
}
