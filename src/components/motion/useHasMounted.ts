"use client";

import { useSyncExternalStore } from "react";

function subscribe() {
  return () => {};
}

function getSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

/**
 * True once client-side hydration has committed; false during SSR and
 * during the hydrating client render itself.
 *
 * `useReducedMotion()` resolves synchronously on the client's very first
 * render (not after an effect), while on the server it's always `null` —
 * so a component that renders different DOM structure per value needs this
 * to stay on the server's branch through hydration and only switch
 * afterward, or React throws a hydration mismatch. `useSyncExternalStore`
 * gets that for free via `getServerSnapshot` (used for both the server
 * render and the client's hydrating render), with no `setState`-in-effect.
 */
export function useHasMounted() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
