"use client";

import { motion } from "framer-motion";
import { REVEAL_EASE } from "@/components/ui/Reveal";
import { useRevealGate } from "@/components/motion/useRevealGate";

/**
 * A connected vertical stepper for the client journey (module 14) — each
 * group is a node on a line that draws downward as it scrolls into view,
 * rather than the flat grid of cards this replaced. The content this
 * describes ("what happens after you get in touch") is inherently
 * sequential, so a line that advances reads truer than a grid where every
 * item carries equal visual weight.
 *
 * Follows the same progressive-enhancement gate as `Reveal`/`Stagger`: the
 * resting state (no JS, or reduced motion) is fully drawn, so a no-JS
 * visitor sees the complete timeline rather than a bare one.
 */
export function JourneyTimeline({
  groups,
}: {
  groups: ReadonlyArray<{ title: string; steps: ReadonlyArray<string> }>;
}) {
  const { ref, hidden } = useRevealGate<HTMLOListElement>();

  return (
    <ol ref={ref} className="relative m-0 max-w-[46rem] list-none p-0">
      {groups.map((group, index) => {
        const isLast = index === groups.length - 1;
        const delay = index * 0.15;

        return (
          <li key={group.title} className="relative pb-10 pl-16 last:pb-0">
            {!isLast ? (
              <motion.span
                aria-hidden="true"
                className="absolute left-5 top-10 w-px bg-line"
                style={{ height: "calc(100% - 2.5rem)", originY: 0 }}
                initial={false}
                animate={{ scaleY: hidden ? 0 : 1, opacity: hidden ? 0 : 1 }}
                transition={{ duration: 0.5, delay: delay + 0.15, ease: REVEAL_EASE }}
              />
            ) : null}

            <motion.span
              aria-hidden="true"
              className="absolute left-0 top-0 grid size-10 place-items-center rounded-full border-2 border-brand bg-canvas font-mono text-eyebrow font-semibold text-brand"
              style={{ originX: "20px", originY: "20px" }}
              initial={false}
              animate={{ scale: hidden ? 0 : 1, opacity: hidden ? 0 : 1 }}
              transition={{ type: "spring", stiffness: 320, damping: 20, delay }}
            >
              {String(index + 1).padStart(2, "0")}
            </motion.span>

            <motion.div
              initial={false}
              animate={{ opacity: hidden ? 0 : 1, x: hidden ? 12 : 0 }}
              transition={{ duration: 0.4, delay: delay + 0.1, ease: REVEAL_EASE }}
            >
              <h3 className="text-h3 font-semibold">{group.title}</h3>
              <ul className="mt-3 grid list-none gap-2 p-0">
                {group.steps.map((step) => (
                  <li key={step} className="flex gap-2.5 text-body text-muted">
                    <span aria-hidden="true" className="text-faint">
                      —
                    </span>
                    {step}
                  </li>
                ))}
              </ul>
            </motion.div>
          </li>
        );
      })}
    </ol>
  );
}
