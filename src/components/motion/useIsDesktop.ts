"use client";

import { useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  const query = window.matchMedia("(min-width: 1024px)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

/**
 * True once mounted on a viewport at least `lg` (1024px) wide. SSR and the
 * first client render both report `false` (via the server snapshot), the
 * same contract as `useHasMounted` — so this never causes a hydration
 * mismatch, it just resolves to the real value a tick after mount.
 */
export function useIsDesktop() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia("(min-width: 1024px)").matches,
    () => false,
  );
}
