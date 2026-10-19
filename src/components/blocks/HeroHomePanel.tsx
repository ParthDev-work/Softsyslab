"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { REVEAL_EASE } from "@/components/ui/Reveal";
import { useHasMounted } from "@/components/motion/useHasMounted";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.04 },
  },
};

const item = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: REVEAL_EASE },
  },
};

/**
 * One orchestrated load-in for the homepage hero copy. Scroll reveals are
 * handled elsewhere; this is the single "first paint" moment for module 3.
 */
export function HeroHomePanel({
  eyebrow,
  headingId,
  headingLead,
  headingAccent,
  body,
  actions,
  supporting,
}: {
  eyebrow: string;
  headingId: string;
  headingLead: string;
  headingAccent: string;
  body: string;
  actions: ReactNode;
  supporting: string;
}) {
  const mounted = useHasMounted();
  const shouldReduceMotion = useReducedMotion();
  const animate = mounted && !shouldReduceMotion;

  const shellClass = "min-w-0 max-w-155 flex-7 basis-115";

  if (!animate) {
    return (
      <div className={shellClass}>
        <p className="type-eyebrow m-0">{eyebrow}</p>
        <h1 id={headingId} className="type-display mt-7">
          {headingLead}{" "}
          <span className="italic">{headingAccent}</span>
        </h1>
        <p className="type-lead mt-7">{body}</p>
        <div className="mt-9 flex flex-wrap gap-3">{actions}</div>
        <p className="mt-7 max-w-[46ch] border-t border-hairline pt-5 text-small text-muted">
          {supporting}
        </p>
      </div>
    );
  }

  return (
    <motion.div
      className={shellClass}
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.p variants={item} className="type-eyebrow m-0">
        {eyebrow}
      </motion.p>
      <motion.h1 id={headingId} variants={item} className="type-display mt-7">
        {headingLead}{" "}
        <span className="italic">{headingAccent}</span>
      </motion.h1>
      <motion.p variants={item} className="type-lead mt-7">
        {body}
      </motion.p>
      <motion.div
        variants={item}
        className="mt-9 flex flex-wrap gap-3"
      >
        {actions}
      </motion.div>
      <motion.p
        variants={item}
        className="mt-7 max-w-[46ch] border-t border-hairline pt-5 text-small text-muted"
      >
        {supporting}
      </motion.p>
    </motion.div>
  );
}
