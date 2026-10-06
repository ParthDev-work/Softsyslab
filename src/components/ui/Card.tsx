import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * PRD sections 29 and 30 with the design's card language: 12px radius, 24-28px
 * padding, hairline border by default, strong border and a lift on a linked
 * card, a mono counter in the corner.
 *
 * A linked card exposes exactly one focusable element and contains no nested
 * clickable controls (section 13 module 6). No fixed heights (section 31) —
 * `min-height` only, so long labels wrap rather than clip.
 */

export function Card({
  tone = "canvas",
  className,
  children,
}: {
  tone?: "canvas" | "surface";
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-card border border-hairline p-6 lg:p-7",
        tone === "surface" ? "bg-surface" : "bg-canvas",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function LinkCard({
  href,
  title,
  body,
  index,
  action,
  className,
}: {
  href: string;
  title: string;
  body?: string;
  /** Mono counter shown above the title, e.g. "01". */
  index?: string;
  action?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "group relative flex w-full min-h-55 flex-col gap-4 rounded-card border border-line bg-canvas p-7",
        "transition-[box-shadow,border-color,transform] duration-200 motion-reduce:transition-none",
        "hover:-translate-y-0.5 hover:border-faint hover:shadow-raised",
        "focus-within:border-faint focus-within:shadow-raised",
        className,
      )}
    >
      {index ? (
        <span className="font-mono text-xs text-dim">{index}</span>
      ) : null}
      <h3 className="text-h3 font-semibold tracking-[-0.01em]">
        <Link
          href={href}
          className="after:absolute after:inset-0 after:content-['']"
        >
          {title}
        </Link>
      </h3>
      {body ? (
        <p className="flex-1 text-body text-muted text-pretty">{body}</p>
      ) : null}
      {action ? (
        <span
          aria-hidden="true"
          className="text-small font-medium text-brand"
        >
          {action}{" "}
          <span className="inline-block transition-transform duration-150 group-hover:translate-x-0.5 motion-reduce:transition-none">
            →
          </span>
        </span>
      ) : null}
    </div>
  );
}

export function CardGrid({
  min = "20rem",
  className,
  children,
}: {
  /** Minimum column width before the grid wraps. */
  min?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <ul
      className={cn("grid list-none gap-5 p-0", className)}
      style={{
        gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, ${min}), 1fr))`,
      }}
    >
      {children}
    </ul>
  );
}

export function CardGridItem({ children }: { children: ReactNode }) {
  return <li className="flex">{children}</li>;
}

/**
 * The design's bordered grid: a single hairline frame drawn by the cells, used
 * for the nine delivery stages. Collapses to one column at narrow widths with
 * no horizontal scroll (section 31).
 */
export function RuledGrid({
  min = "20rem",
  as: Tag = "ol",
  children,
}: {
  min?: string;
  as?: "ol" | "ul";
  children: ReactNode;
}) {
  return (
    <Tag
      className="grid list-none border-l border-t border-line p-0"
      style={{
        gridTemplateColumns: `repeat(auto-fill, minmax(min(100%, ${min}), 1fr))`,
      }}
    >
      {children}
    </Tag>
  );
}

export function RuledCell({ children }: { children: ReactNode }) {
  return (
    <li className="grid content-start gap-2.5 border-r border-b border-line p-7 pb-8">
      {children}
    </li>
  );
}
