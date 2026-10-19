"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";
import { useRevealGate } from "@/components/motion/useRevealGate";
import { useHasMounted } from "@/components/motion/useHasMounted";

/**
 * Monospace line that types itself out once scrolled into view, built on the
 * same `useRevealGate` every scroll-triggered reveal on the page uses.
 *
 * The visible characters are a decorative, `aria-hidden` copy; a `sr-only`
 * sibling carries the real text statically, so assistive tech never has to
 * follow a string that's rewriting itself character by character. Before
 * mount, under reduced motion, or before the reveal gate fires, the full
 * string shows immediately — a no-JS or first-paint visitor is never looking
 * at an empty line waiting on a timer.
 */
export function TypedLine({
  text,
  speed = 28,
  className,
}: {
  text: string;
  /** Milliseconds per character. */
  speed?: number;
  className?: string;
}) {
  const { ref, hidden } = useRevealGate<HTMLSpanElement>();
  const mounted = useHasMounted();
  const shouldReduceMotion = useReducedMotion();

  const typing = mounted && !shouldReduceMotion && !hidden;
  const waiting = mounted && !shouldReduceMotion && hidden;

  return (
    <span ref={ref} className={cn("font-mono", className)}>
      <span aria-hidden="true">
        {typing ? (
          <Typewriter key="typing" text={text} speed={speed} />
        ) : waiting ? (
          ""
        ) : (
          text
        )}
      </span>
      <span className="sr-only">{text}</span>
    </span>
  );
}

/** Mounts only once revealed, so its own first frame is the empty string. */
function Typewriter({ text, speed }: { text: string; speed: number }) {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (shown >= text.length) return;
    const id = window.setTimeout(() => {
      setShown((count) => count + 1);
    }, speed);
    return () => window.clearTimeout(id);
  }, [shown, text, speed]);

  return (
    <>
      {text.slice(0, shown)}
      {shown < text.length ? (
        <span className="motion-reduce:hidden" aria-hidden="true">
          ▍
        </span>
      ) : null}
    </>
  );
}
