"use client";

import { useEffect, useState } from "react";

/**
 * Fixed-position return-to-top control. Appears once the visitor has
 * scrolled past the hero, stays clear of the footer (it is `fixed`, not
 * `absolute`, so it never enters the footer's flow) and sits below the
 * header's stacking context (z-30 against the header's z-40) so the open
 * mobile menu panel — which is opaque — covers it rather than overlapping
 * it visually.
 *
 * `scrollTo({ behavior: "smooth" })` is safe unconditionally: the global
 * reduced-motion block in globals.css already forces `scroll-behavior: auto`
 * site-wide when the user has that preference, which overrides the
 * per-call "smooth" request.
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 600);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className="fixed bottom-6 right-6 z-30 flex size-11 items-center justify-center rounded-full border border-line bg-canvas text-anchor shadow-raised transition-colors duration-150 hover:border-field hover:bg-surface motion-reduce:transition-none"
    >
      <svg viewBox="0 0 16 16" aria-hidden="true" className="size-5" fill="currentColor">
        <path d="M8 3.5a.75.75 0 0 1 .53.22l4 4a.75.75 0 1 1-1.06 1.06L8.75 6.06V12a.75.75 0 0 1-1.5 0V6.06L4.53 8.78a.75.75 0 1 1-1.06-1.06l4-4A.75.75 0 0 1 8 3.5Z" />
      </svg>
    </button>
  );
}
