"use client";

import { motion, useReducedMotion, useSpring } from "framer-motion";
import { useRef, type MouseEvent, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { useHasMounted } from "@/components/motion/useHasMounted";

/**
 * Wraps a single interactive child (built for the existing `LinkButton` /
 * `Button`) with a short-throw magnetic pull toward the pointer plus a
 * spring scale on press — the inline `transition-[...]` utilities on the
 * button itself keep handling color/border, this only adds the motion.
 *
 * Reduced motion disables the pointer-follow and scale outright rather than
 * racing it to zero, since Motion's spring is JS-driven and the global CSS
 * media query in globals.css has no reach into it. The plain-`<div>` branch
 * only takes effect once `useHasMounted` confirms hydration has committed —
 * `useReducedMotion()` resolves synchronously on the client's first render
 * (unlike most effect-driven values), so without that gate a reduced-motion
 * visitor's hydrating render would ask for a plain `<div>` while the server
 * sent a `<motion.div>`, which is a real (if same-tag) hydration mismatch.
 */
export function MagneticButton({
  className,
  strength = 0.3,
  children,
}: {
  className?: string;
  /** Fraction of pointer offset the button travels toward, 0–1. */
  strength?: number;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mounted = useHasMounted();
  const shouldReduceMotion = useReducedMotion();
  const x = useSpring(0, { stiffness: 300, damping: 20, mass: 0.5 });
  const y = useSpring(0, { stiffness: 300, damping: 20, mass: 0.5 });

  if (mounted && shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      className={cn("inline-block", className)}
      style={{ x, y }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
}
