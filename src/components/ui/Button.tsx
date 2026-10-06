import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * PRD section 29: primary filled, secondary outline, tertiary text, each with
 * default, hover, focus, pressed, disabled and loading states. Disabled
 * contrast may be muted but the label stays readable; loading shows text and
 * progress, never an unlabelled spinner.
 *
 * Heights follow the design: 44px for the compact header control, 48px for
 * in-page actions, 52px for hero and submit. All clear section 32's 44x44
 * target minimum.
 */

export type ButtonVariant =
  | "primary"
  | "dark"
  | "outline"
  | "onDark"
  | "ghost"
  | "accent";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2.5 rounded-control " +
  "font-medium text-center no-underline whitespace-nowrap " +
  "transition-[background-color,border-color,color,box-shadow] duration-150 " +
  "motion-reduce:transition-none";

const sizes: Record<ButtonSize, string> = {
  sm: "h-11 px-4.5 text-body",
  md: "h-12 px-5 text-body",
  lg: "h-13 px-7 text-[1.0625rem]",
};

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-brand text-white border border-brand " +
    "hover:bg-brand-hover hover:border-brand-hover " +
    "active:bg-anchor active:border-anchor",
  dark:
    "bg-anchor text-white border border-anchor " +
    "hover:bg-brand hover:border-brand " +
    "active:bg-brand-hover active:border-brand-hover",
  outline:
    "bg-canvas text-anchor border border-line " +
    "hover:border-field hover:bg-surface " +
    "active:bg-tint",
  onDark:
    "bg-transparent text-surface border border-ink-line " +
    "hover:border-surface hover:bg-ink-raised hover:text-white " +
    "active:bg-ink-border",
  ghost:
    "bg-transparent text-anchor border border-transparent " +
    "hover:bg-tint active:bg-line/50",
  /* The secondary/alternate CTA: wires the --color-accent token (already
     defined in globals.css but previously unused by any component) into an
     actual variant, parallel to how `primary` uses brand/brand-hover. */
  accent:
    "bg-accent text-white border border-accent " +
    "hover:bg-accent-hover hover:border-accent-hover " +
    "active:bg-accent-hover active:border-accent-hover",
};

const disabledStyles =
  "disabled:cursor-not-allowed disabled:bg-muted disabled:text-white " +
  "disabled:border-muted disabled:hover:bg-muted disabled:hover:border-muted";

/** Progress is always shown beside the label, never in place of it. */
function Progress() {
  return (
    <span
      aria-hidden="true"
      className="size-4 shrink-0 rounded-full border-2 border-current border-r-transparent animate-spin motion-reduce:animate-none"
    />
  );
}

export function LinkButton({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
}: {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(base, sizes[size], variants[variant], className)}
    >
      {children}
    </Link>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  className,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        base,
        sizes[size],
        variants[variant],
        disabledStyles,
        "cursor-pointer",
        className,
      )}
    >
      {loading ? <Progress /> : null}
      {children}
    </button>
  );
}

/**
 * The design's inline section action — a weighted text link with a trailing
 * arrow. The arrow is decorative; the link text carries the meaning, which is
 * what section 32's "meaningful link names" requires.
 */
export function ArrowLink({
  href,
  children,
  tone = "brand",
  className,
}: {
  href: string;
  children: ReactNode;
  tone?: "brand" | "anchor";
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex min-h-11 items-center gap-2 text-[1.0625rem] font-medium underline-offset-4 hover:underline",
        tone === "brand" ? "text-brand" : "text-anchor",
        className,
      )}
    >
      {children}
      <span
        aria-hidden="true"
        className="transition-transform duration-150 group-hover:translate-x-0.5 motion-reduce:transition-none"
      >
        →
      </span>
    </Link>
  );
}
