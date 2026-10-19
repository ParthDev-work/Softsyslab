"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/cn";
import { useHasMounted } from "@/components/motion/useHasMounted";
import { useIsDesktop } from "@/components/motion/useIsDesktop";
import { RuledCell, RuledGrid } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/Layout";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";

type Stage = { name: string; artifact: string };

/** Degrees swept per pixel of scroll inside the pinned track below. */
const TRACK_VH_PER_STAGE = 32;
/** Ellipse radius as a percentage of the ring's own width/height. */
const RADIUS_X = 44;
const RADIUS_Y = 42;

function OrbitItem({
  index,
  stage,
  baseAngle,
  rotation,
}: {
  index: number;
  stage: Stage;
  baseAngle: number;
  rotation: MotionValue<number>;
}) {
  const left = useTransform(rotation, (r) => {
    const rad = ((baseAngle + r) * Math.PI) / 180;
    return `${50 + RADIUS_X * Math.cos(rad)}%`;
  });
  const top = useTransform(rotation, (r) => {
    const rad = ((baseAngle + r) * Math.PI) / 180;
    return `${50 + RADIUS_Y * Math.sin(rad)}%`;
  });

  return (
    <motion.div
      style={{ left, top }}
      className="absolute w-48 -translate-x-1/2 -translate-y-1/2 rounded-card border border-line bg-canvas p-4 lg:w-52 lg:p-5"
    >
      <span aria-hidden="true" className="font-mono text-eyebrow text-brand">
        {String(index + 1).padStart(2, "0")}
      </span>
      <h3 className="mt-1 text-body font-semibold">{stage.name}</h3>
      <p className="mt-1.5 text-xs leading-snug text-muted">
        <span className="text-dim">Artifact — </span>
        <span className="text-anchor">{stage.artifact}</span>
      </p>
    </motion.div>
  );
}

/**
 * Module 7, orbit variant. The centre heading stays put; the nine stages sit
 * on an ellipse around it and sweep through one full turn as the visitor
 * scrolls the pinned track — same left-to-right order as `stages`, just read
 * around the ring instead of down a grid.
 *
 * Below `lg`, under reduced motion, or before hydration, this renders the
 * original ruled grid instead: nine compact cards on an ellipse have no
 * narrow-viewport layout that stays readable, and a scroll-jacked rotation is
 * exactly what reduced motion opts out of. That fallback is the same markup
 * this replaced, not a stripped-down version of the orbit.
 */
export function ProcessOrbit({
  heading,
  intro,
  stages,
}: {
  heading: string;
  intro: string;
  stages: readonly Stage[];
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const mounted = useHasMounted();
  const isDesktop = useIsDesktop();
  const shouldReduceMotion = useReducedMotion();
  const active = mounted && isDesktop && !shouldReduceMotion;

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });
  const rotation = useTransform(scrollYProgress, [0, 1], [0, -360]);

  const step = 360 / stages.length;

  if (!active) {
    return (
      <>
        <SectionHeader id="proc-h" heading={heading} support={intro} className="mb-12" />
        <Stagger as="div" stagger={0.06}>
          <RuledGrid min="20rem">
            {stages.map((stage, index) => (
              <RuledCell key={stage.name}>
                <StaggerItem className="grid content-start gap-2.5">
                  <span aria-hidden="true" className="font-mono text-eyebrow text-brand">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-h3 font-semibold">{stage.name}</h3>
                  <p className="text-small text-muted">
                    <span className="text-dim">Artifact — </span>
                    <span className="text-anchor">{stage.artifact}</span>
                  </p>
                </StaggerItem>
              </RuledCell>
            ))}
          </RuledGrid>
        </Stagger>
      </>
    );
  }

  return (
    <div
      ref={trackRef}
      style={{ height: `${stages.length * TRACK_VH_PER_STAGE}vh` }}
      className={cn("relative")}
    >
      <div className="sticky top-20 flex h-[calc(100vh-5rem)] flex-col items-center justify-center gap-8 overflow-hidden py-8">
        <p className="max-w-[56ch] text-center text-body-lg text-muted text-pretty">
          {intro}
        </p>
        <div className="relative h-0 w-full max-w-[72rem] flex-1">
          <div className="absolute inset-0 m-auto grid h-fit max-w-[18ch] place-items-center text-center">
            <h2 id="proc-h" className="type-h2">
              {heading}
            </h2>
          </div>
          {stages.map((stage, index) => (
            <OrbitItem
              key={stage.name}
              index={index}
              stage={stage}
              baseAngle={-90 + step * index}
              rotation={rotation}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
