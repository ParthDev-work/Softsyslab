"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Progressive-enhancement fade/rise-in on scroll.
 *
 * Section 29's reduced-motion rule and the general no-regression bar for
 * assistive technology rule out the usual approach of baking `opacity:0`
 * into server-rendered markup: a visitor with JavaScript disabled, or one
 * who sees the first paint before hydration runs, would be looking at
 * content that never becomes visible.
 *
 * So the element renders with only the resting `.reveal` class (fully
 * visible, see globals.css) on the server and on first client render. Once
 * mounted, an effect adds `.reveal-hidden` and *then* starts observing —
 * the two are sequenced so the hidden state and the observer arrive
 * together, never hidden-without-an-observer. When the element crosses the
 * viewport, `.reveal-hidden` is removed and the CSS transition defined on
 * `.reveal` animates it in. The transition is a plain opacity/transform
 * utility, so the global `prefers-reduced-motion` block (which zeroes every
 * transition duration site-wide) neutralises it automatically.
 */
export function Reveal({
  delay = 0,
  className,
  children,
}: {
  /** Stagger delay in ms, for sequencing items in a list (section 10). */
  delay?: number;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    // Arm the hidden state only once an observer is about to watch it, so
    // there is never a frame where content is hidden with nothing watching.
    setHidden(true);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setHidden(false);
            observer.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn("reveal", hidden && "reveal-hidden", className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
