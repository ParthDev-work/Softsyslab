"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef, type PointerEvent, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { useHasMounted } from "@/components/motion/useHasMounted";

/**
 * Pointer-driven 3D tilt with a cursor spotlight, for the homepage's card
 * grids. Tilt is a few degrees at most — enough to feel physical, not enough
 * to make text hard to read mid-motion.
 *
 * Reduced motion keeps the spotlight (it is a colour change, not movement)
 * and drops the rotation. As with `MagneticButton`, the branch only switches
 * once hydration has committed so the server and hydrating render agree.
 */
export function TiltCard({
  className,
  max = 6,
  glow = "var(--color-brand)",
  children,
}: {
  className?: string;
  /** Maximum rotation in degrees on either axis. */
  max?: number;
  /** Colour the spotlight washes toward. */
  glow?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mounted = useHasMounted();
  const shouldReduceMotion = useReducedMotion();
  const tiltOn = mounted && !shouldReduceMotion;

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const glowOpacity = useSpring(0, { stiffness: 200, damping: 30 });
  const spring = { stiffness: 220, damping: 22, mass: 0.6 };
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), spring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), spring);

  const gx = useTransform(px, (v) => `${v * 100}%`);
  const gy = useTransform(py, (v) => `${v * 100}%`);
  const background = useMotionTemplate`radial-gradient(420px circle at ${gx} ${gy}, color-mix(in srgb, ${glow} 14%, transparent), transparent 65%)`;

  function handleMove(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((event.clientX - rect.left) / rect.width);
    py.set((event.clientY - rect.top) / rect.height);
  }

  function handleLeave() {
    px.set(0.5);
    py.set(0.5);
    glowOpacity.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={handleMove}
      onPointerEnter={() => glowOpacity.set(1)}
      onPointerLeave={handleLeave}
      style={
        tiltOn ? { rotateX, rotateY, transformPerspective: 900 } : undefined
      }
      className={cn("group relative isolate", className)}
    >
      {children}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 rounded-[inherit]"
        style={{ background, opacity: glowOpacity }}
      />
    </motion.div>
  );
}
