"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { useRef, useState, type MouseEvent, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Cursor-tracking highlight for a card. Wraps the card's existing markup
 * (whatever border/background/radius it already draws) with a thin,
 * non-interactive overlay that washes brand color near the pointer.
 *
 * The overlay rounds its own corners rather than relying on the wrapper to
 * clip it — several cards this wraps (e.g. `LinkCard`) lift with a
 * box-shadow on hover, and a clipping wrapper would cut that shadow off at
 * the card's edge.
 *
 * The glow is purely decorative, so reduced motion is handled with a plain
 * `motion-reduce:hidden` instead of a JS check — the pointer tracking keeps
 * running (harmless, nothing paints) but nothing is ever shown.
 */
export function SpotlightCard({
  className,
  radius = 220,
  children,
}: {
  className?: string;
  radius?: number;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [opacity, setOpacity] = useState(0);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const background = useMotionTemplate`radial-gradient(${radius}px circle at ${x}px ${y}px, color-mix(in srgb, var(--color-brand) 16%, transparent), transparent 70%)`;

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(event.clientX - rect.left);
    y.set(event.clientY - rect.top);
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={cn("relative isolate", className)}
    >
      {children}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 rounded-card transition-opacity duration-300 motion-reduce:hidden"
        style={{ background, opacity }}
      />
    </div>
  );
}
