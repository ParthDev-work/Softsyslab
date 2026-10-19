"use client";

import { useEffect, useState } from "react";

type TrackedSection = { id: string; label: string };

/**
 * Drives the header's "where am I" label (`SectionTracker`). One shared
 * IntersectionObserver watches every section in `sections` against a thin
 * band just below the sticky header, and the hook returns whichever tracked
 * section currently sits in that band — first in `sections` order wins a
 * tie, which is also the only tie-break a single observer needs.
 *
 * Caller must pass a referentially stable array (a module-level constant
 * from `content/homepage.ts`, not an inline literal) since it drives the
 * effect's dependency array and observing is relatively expensive to redo
 * every render.
 */
export function useActiveSection(sections: readonly TrackedSection[]) {
  const [activeLabel, setActiveLabel] = useState<string | null>(null);

  useEffect(() => {
    if (sections.length === 0 || typeof IntersectionObserver === "undefined") {
      return;
    }

    const nodes = sections
      .map((section) => document.getElementById(section.id))
      .filter((node): node is HTMLElement => node !== null);

    if (nodes.length === 0) return;

    const visible = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        const current = sections.find((section) => visible.has(section.id));
        setActiveLabel(current?.label ?? null);
      },
      // A thin band just under the sticky header rather than viewport
      // center: with sections this tall, centering would often straddle
      // two sections at once and flicker between them.
      { rootMargin: "-140px 0px -70% 0px", threshold: 0 },
    );

    for (const node of nodes) observer.observe(node);
    return () => observer.disconnect();
  }, [sections]);

  return activeLabel;
}
