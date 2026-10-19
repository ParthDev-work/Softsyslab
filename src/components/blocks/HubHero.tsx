"use client";

import { motion, useReducedMotion } from "framer-motion";
import { REVEAL_EASE } from "@/components/ui/Reveal";
import { useHasMounted } from "@/components/motion/useHasMounted";
import { Lead } from "@/components/ui/Layout";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.02 },
  },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: REVEAL_EASE },
  },
};

/**
 * Shared animated hero for hub pages (services, solutions, contact, …).
 * Matches the homepage's motion vocabulary without duplicating scroll reveals
 * on every section below.
 */
export function HubHero({
  eyebrow,
  headingId,
  heading,
  lead,
  className,
  headingClassName = "max-w-[18ch]",
}: {
  eyebrow: string;
  headingId: string;
  heading: string;
  lead: string;
  className?: string;
  headingClassName?: string;
}) {
  const mounted = useHasMounted();
  const shouldReduceMotion = useReducedMotion();
  const animate = mounted && !shouldReduceMotion;

  if (!animate) {
    return (
      <section
        aria-labelledby={headingId}
        className={className ?? "pb-[clamp(2.5rem,6vw,4rem)] hero-wash"}
      >
        <div className="container-page">
          <p className="type-eyebrow">{eyebrow}</p>
          <h1 id={headingId} className={`type-h1 mt-5 ${headingClassName}`}>
            {heading}
          </h1>
          <Lead className="mt-5">{lead}</Lead>
        </div>
      </section>
    );
  }

  return (
    <section
      aria-labelledby={headingId}
      className={className ?? "pb-[clamp(2.5rem,6vw,4rem)] hero-wash"}
    >
      <motion.div
        className="container-page"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.p variants={item} className="type-eyebrow">
          {eyebrow}
        </motion.p>
        <motion.h1
          id={headingId}
          variants={item}
          className={`type-h1 mt-5 ${headingClassName}`}
        >
          {heading}
        </motion.h1>
        <motion.div variants={item}>
          <Lead className="mt-5">{lead}</Lead>
        </motion.div>
      </motion.div>
    </section>
  );
}
