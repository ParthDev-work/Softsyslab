"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useActiveSection } from "@/components/motion/useActiveSection";
import { useHasMounted } from "@/components/motion/useHasMounted";

/**
 * Header utility-row "where am I" label — the active homepage section's
 * short name, crossfading in as the visitor scrolls. Purely decorative: it
 * repeats information already in the page's own headings, so it carries
 * `aria-hidden` rather than competing with the real landmarks for attention.
 *
 * Renders nothing before hydration, off the homepage, or once the label is
 * unknown (section has not resolved yet), so there is never a mismatched or
 * stale server/client render.
 */
export function SectionTracker({
  sections,
}: {
  sections: ReadonlyArray<{ id: string; label: string }>;
}) {
  const pathname = usePathname();
  const mounted = useHasMounted();
  const shouldReduceMotion = useReducedMotion();
  const activeLabel = useActiveSection(sections);

  if (!mounted || pathname !== "/" || !activeLabel) return null;

  return (
    <div aria-hidden="true" className="flex min-w-0 items-center overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={activeLabel}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={shouldReduceMotion ? undefined : { opacity: 0, y: -4 }}
          transition={{ duration: 0.22 }}
          className="type-meta whitespace-nowrap text-dim"
        >
          {activeLabel}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
