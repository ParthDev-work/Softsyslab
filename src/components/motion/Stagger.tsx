"use client";

import { motion, type Variants } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { REVEAL_EASE } from "@/components/ui/Reveal";
import { useRevealGate } from "@/components/motion/useRevealGate";

type Tag = "div" | "ul" | "ol" | "li";

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: REVEAL_EASE },
  },
};

/**
 * Scroll-triggered stagger container. Pairs with `StaggerItem` for each
 * child that should cascade in rather than arrive as one block.
 *
 * Follows the same progressive-enhancement contract as `Reveal`: the
 * container renders as "visible" until an effect (gated on an observer
 * actually being attached, and skipped entirely under reduced motion) flips
 * it to "hidden" so there is never a frame of hidden content with no
 * observer and no JS watching it.
 */
export function Stagger({
  as = "div",
  className,
  style,
  stagger = 0.08,
  children,
}: {
  as?: Tag;
  className?: string;
  style?: CSSProperties;
  /** Delay in seconds between each child's entrance. */
  stagger?: number;
  children: ReactNode;
}) {
  const { ref, hidden } = useRevealGate<HTMLDivElement>();
  const MotionTag = motion[as];

  return (
    <MotionTag
      ref={ref as never}
      className={cn(className)}
      style={style}
      initial="visible"
      animate={hidden ? "hidden" : "visible"}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger } },
      }}
    >
      {children}
    </MotionTag>
  );
}

export function StaggerItem({
  as = "div",
  className,
  children,
}: {
  as?: Tag;
  className?: string;
  children: ReactNode;
}) {
  const MotionTag = motion[as];
  return (
    <MotionTag className={cn(className)} initial="visible" variants={itemVariants}>
      {children}
    </MotionTag>
  );
}
