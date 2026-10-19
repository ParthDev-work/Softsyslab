import { cn } from "@/lib/cn";

/**
 * Small abstract node-and-line mark, echoing the wireframe visual language
 * `CapabilityBoard` already uses for its panel illustrations rather than
 * introducing a new illustration style. Purely decorative (`aria-hidden`).
 *
 * The draw-in and pulse are plain CSS animations (`.linemark-draw` and the
 * existing `.capability-pulse`, both in globals.css), so this needs no
 * client-side mount gate: the global `prefers-reduced-motion` rule already
 * collapses every animation's duration to near-zero and leaves each one on
 * its final frame, which for a stroke draw-in is simply "fully drawn".
 */
export function LineMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 48 48"
      className={cn("text-brand", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path className="linemark-draw" pathLength={1} d="M9 35 L24 11 L39 29" />
      <path
        className="linemark-draw"
        pathLength={1}
        d="M24 11 L24 3"
        style={{ animationDelay: "120ms" }}
      />
      <circle cx="9" cy="35" r="2.5" fill="currentColor" stroke="none" />
      <circle cx="24" cy="11" r="2.5" fill="currentColor" stroke="none" />
      <circle
        cx="39"
        cy="29"
        r="2.5"
        fill="currentColor"
        stroke="none"
        className="capability-pulse"
      />
    </svg>
  );
}
