"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { useRevealGate } from "@/components/motion/useRevealGate";

/** Shared easing for every scroll-driven reveal on the page (a confident decelerate). */
export const REVEAL_EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Progressive-enhancement fade/rise-in on scroll, powered by Framer Motion.
 *
 * Section 29's reduced-motion rule and the general no-regression bar for
 * assistive technology rule out the usual approach of baking `opacity:0`
 * into server-rendered markup: a visitor with JavaScript disabled, or one
 * who sees the first paint before hydration runs, would be looking at
 * content that never becomes visible. `useRevealGate` is what keeps that
 * true here — see its own comment for the sequencing.
 */
export function Reveal({
  delay = 0,
  className,
  children,
}: {
  /** Stagger delay in ms, for sequencing items in a list (section 10). */
  delay?: number;
  className?: string;
  children: ReactNode;
}) {
  const { ref, hidden } = useRevealGate<HTMLDivElement>();

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      animate={{ opacity: hidden ? 0 : 1, y: hidden ? 16 : 0 }}
      transition={{ duration: 0.5, delay: delay / 1000, ease: REVEAL_EASE }}
    >
      {children}
    </motion.div>
  );
}
