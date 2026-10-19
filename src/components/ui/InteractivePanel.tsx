"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { REVEAL_EASE } from "@/components/ui/Reveal";
import { useRevealGate } from "@/components/motion/useRevealGate";
import { useHasMounted } from "@/components/motion/useHasMounted";

/**
 * Bordered surface with a soft brand gradient frame and a gentle lift on hover.
 * Used for closing CTAs and other high-intent panels.
 */
export function InteractivePanel({
  className,
  innerClassName,
  children,
}: {
  className?: string;
  innerClassName?: string;
  children: ReactNode;
}) {
  const { ref, hidden } = useRevealGate<HTMLDivElement>();
  const mounted = useHasMounted();
  const shouldReduceMotion = useReducedMotion();
  const motionOn = mounted && !shouldReduceMotion;

  return (
    <motion.div
      ref={ref}
      className={cn(
        "group relative rounded-card p-px",
        "bg-linear-to-br from-brand/35 via-accent/25 to-brand/15",
        className,
      )}
      initial={false}
      animate={{
        opacity: hidden ? 0 : 1,
        y: hidden ? 20 : 0,
      }}
      transition={{ duration: 0.55, ease: REVEAL_EASE }}
      whileHover={motionOn ? { y: -2 } : undefined}
    >
      <div
        className={cn(
          "rounded-card border border-hairline/80 bg-surface shadow-soft transition-shadow duration-300 group-hover:shadow-raised motion-reduce:transition-none",
          innerClassName,
        )}
      >
        {children}
      </div>
    </motion.div>
  );
}
