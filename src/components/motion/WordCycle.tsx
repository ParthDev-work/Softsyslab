"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { useHasMounted } from "@/components/motion/useHasMounted";

/**
 * Crossfades once through a short list of words, left to right, then settles
 * on the last one and stops — never loops. An auto-updating phrase with no
 * end would need its own pause control (WCAG 2.2.2); a bounded, one-pass
 * cycle doesn't, so that's the whole reason this doesn't loop.
 *
 * Reduced motion, no-JS, and the pre-hydration render all show the first
 * word statically — nothing here is required reading, so a visitor on the
 * first paint is never stuck looking at anything but real content.
 */
export function WordCycle({
  words,
  interval = 1800,
  className,
}: {
  words: readonly string[];
  /** Milliseconds each word is shown before advancing to the next. */
  interval?: number;
  className?: string;
}) {
  const mounted = useHasMounted();
  const shouldReduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const cycling = mounted && !shouldReduceMotion && words.length > 1;

  useEffect(() => {
    if (!cycling || index >= words.length - 1) return;
    const id = window.setTimeout(() => {
      setIndex((current) => current + 1);
    }, interval);
    return () => window.clearTimeout(id);
  }, [cycling, index, interval, words.length]);

  if (words.length === 0) return null;

  if (!cycling) {
    return <span className={className}>{words[0]}</span>;
  }

  return (
    <span className={cn("relative inline-grid align-bottom", className)}>
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.3 }}
          className="col-start-1 row-start-1"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
