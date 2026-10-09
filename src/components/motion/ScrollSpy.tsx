"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { useHasMounted } from "@/components/motion/useHasMounted";

type ContainerTag = "div" | "ul" | "ol";
type ItemTag = "div" | "li";

/**
 * The "pinned heading, scroll-spied rows" pattern used wherever a section
 * pairs a narrow sticky heading column with a sequence of rows in the wider
 * column (module 12's delivery principles, module 5's value proposition).
 * The sticky pin itself is plain CSS on the heading (`lg:sticky lg:top-36`,
 * set by the page) — this only drives the row highlighting and the rail
 * that tracks how far through the list the pinned scroll has gone.
 *
 * `useHasMounted`/`useReducedMotion` gate every inline style this adds, the
 * same way `Stagger` and `DeliveryPrinciplesScroller` do: the resting
 * markup (no JS, or reduced motion) is every row at full opacity with no
 * rail, never a scroll-position-dependent look a no-JS visitor gets stuck
 * in. See `useHasMounted`'s own comment for why that gate has to exist at
 * all (`useReducedMotion` resolves synchronously on the client's first
 * render, unlike most effect-driven values).
 */
export function ScrollSpyList({
  as: Tag = "div",
  rail = true,
  className,
  children,
}: {
  as?: ContainerTag;
  /** Show the brand-colored fill rail down the left edge. */
  rail?: boolean;
  className?: string;
  children: (helpers: {
    progress: MotionValue<number>;
    active: boolean;
  }) => ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"],
  });
  const mounted = useHasMounted();
  const shouldReduceMotion = useReducedMotion();
  const active = mounted && !shouldReduceMotion;
  const MotionTag = motion[Tag];

  return (
    <MotionTag
      ref={ref as never}
      className={cn("relative", rail && "pl-7", className)}
    >
      {rail ? (
        <>
          <span
            aria-hidden="true"
            className="absolute left-0 top-0 h-full w-px bg-line"
          />
          <motion.span
            aria-hidden="true"
            className="absolute left-0 top-0 w-px bg-brand"
            style={
              active
                ? { height: "100%", originY: 0, scaleY: scrollYProgress }
                : { height: 0 }
            }
          />
        </>
      ) : null}
      {children({ progress: scrollYProgress, active })}
    </MotionTag>
  );
}

export function ScrollSpyItem({
  as = "div",
  index,
  total,
  progress,
  active,
  className,
  children,
}: {
  as?: ItemTag;
  index: number;
  total: number;
  progress: MotionValue<number>;
  active: boolean;
  className?: string;
  children: ReactNode;
}) {
  const start = index / total;
  const end = (index + 1) / total;
  const pad = (end - start) * 0.35;
  const stops = [Math.max(start - pad, 0), start, end, Math.min(end + pad, 1)];

  // Always called (rules of hooks) — only applied to the element when
  // `active`, so the unmounted/reduced-motion render never depends on them.
  const opacity = useTransform(progress, stops, [0.4, 1, 1, 0.4]);
  const x = useTransform(progress, stops, [14, 0, 0, 14]);
  const MotionTag = motion[as];

  return (
    <MotionTag style={active ? { opacity, x } : undefined} className={className}>
      {children}
    </MotionTag>
  );
}
