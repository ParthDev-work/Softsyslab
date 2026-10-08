"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState, type MouseEvent } from "react";
import type { Faq } from "@/lib/content/schemas";
import { REVEAL_EASE } from "@/components/ui/Reveal";
import { useHasMounted } from "@/components/motion/useHasMounted";

/**
 * One FAQ row. Renders as a plain native `<details>`/`<summary>` — browser
 * toggling, no script required, the answer always present in the HTML —
 * exactly like before. Once mounted, and only when motion isn't reduced, a
 * click on the summary is intercepted (`preventDefault`) so React can drive
 * the open state instead, and the answer gets a measured height animation
 * rather than snapping open.
 *
 * The `useHasMounted` gate matters here because this component switches
 * between a plain `<p>` and a `<motion.div><p></motion.div>` — different
 * DOM structure, not just different styling — so `enhanced` must stay
 * false through hydration (see that hook's comment) or React throws a
 * hydration mismatch for most visitors, not just an edge case.
 */
export function FaqItem({ faq }: { faq: Faq }) {
  const mounted = useHasMounted();
  const [open, setOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const enhanced = mounted && !shouldReduceMotion;

  function handleSummaryClick(event: MouseEvent<HTMLElement>) {
    if (!enhanced) return;
    event.preventDefault();
    setOpen((value) => !value);
  }

  return (
    <details
      {...(enhanced ? { open } : {})}
      className="group border-b border-line"
    >
      <summary
        onClick={handleSummaryClick}
        className="flex cursor-pointer list-none items-center justify-between gap-6 py-5.5 text-[1.1875rem]/7 font-medium marker:content-none"
      >
        <span className="text-anchor">{faq.question}</span>
        <span
          aria-hidden="true"
          className="grid size-7 flex-none place-items-center rounded-chip border border-line text-muted transition-colors duration-150 group-hover:border-field motion-reduce:transition-none"
        >
          <svg viewBox="0 0 16 16" className="size-4" fill="currentColor">
            <path
              className="group-open:hidden"
              d="M8 3.25a.75.75 0 0 1 .75.75v3.25H12a.75.75 0 0 1 0 1.5H8.75V12a.75.75 0 0 1-1.5 0V8.75H4a.75.75 0 0 1 0-1.5h3.25V4A.75.75 0 0 1 8 3.25Z"
            />
            <path
              className="hidden group-open:block"
              d="M4 7.25h8a.75.75 0 0 1 0 1.5H4a.75.75 0 0 1 0-1.5Z"
            />
          </svg>
        </span>
      </summary>

      {enhanced ? (
        <motion.div
          initial={false}
          animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
          transition={{ duration: 0.25, ease: REVEAL_EASE }}
          className="overflow-hidden"
        >
          <p className="pb-6 pr-14 text-[1.0625rem]/7 text-muted">
            {faq.answer}
          </p>
        </motion.div>
      ) : (
        <p className="pb-6 pr-14 text-[1.0625rem]/7 text-muted">
          {faq.answer}
        </p>
      )}
    </details>
  );
}
