"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/**
 * Shared gate behind every scroll-triggered animation on the homepage
 * (`Reveal`, `Stagger`, the hero figures).
 *
 * Returns `hidden: false` until an effect — which only runs once a real
 * IntersectionObserver is about to watch the element, and never runs at all
 * under reduced motion — flips it. That sequencing means a visitor with no
 * JavaScript, or one who sees the first paint before hydration, always sees
 * the resting "revealed" state: there is never a frame where content is
 * hidden with nothing watching it.
 */
export function useRevealGate<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [hidden, setHidden] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (
      !node ||
      typeof IntersectionObserver === "undefined" ||
      shouldReduceMotion
    ) {
      return;
    }

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
  }, [shouldReduceMotion]);

  return { ref, hidden };
}
