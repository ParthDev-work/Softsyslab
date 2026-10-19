"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { useHasMounted } from "@/components/motion/useHasMounted";

/**
 * A thin brand bar along the top edge that tracks reading progress. Purely
 * decorative; hidden when motion is reduced or before hydration.
 */
export function ScrollProgress() {
  const mounted = useHasMounted();
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });

  if (!mounted || shouldReduceMotion) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 z-50 h-0.5 origin-left bg-brand"
      style={{ scaleX }}
    />
  );
}
