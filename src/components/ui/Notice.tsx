import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Semantic state messaging — PRD section 29.
 *
 * Each state pairs a foreground, a background and a border, and always carries
 * a glyph and a visually hidden state name, so no meaning is carried by colour
 * alone. These are in-page regions rather than toasts, because section 58
 * requires messages to stay visible long enough to act on and section 29 says a
 * toast never replaces a submission confirmation.
 */

type Tone = "info" | "success" | "warning" | "error";

const tones: Record<Tone, { shell: string; glyph: string; name: string }> = {
  info: {
    shell: "border-info/25 bg-info-bg text-info",
    glyph: "i",
    name: "Information",
  },
  success: {
    shell: "border-success-line bg-success-bg text-success",
    glyph: "✓",
    name: "Success",
  },
  warning: {
    shell: "border-warning-line bg-warning-bg text-warning",
    glyph: "⚠",
    name: "Warning",
  },
  error: {
    shell: "border-danger-line bg-danger-bg text-danger",
    glyph: "⚠",
    name: "Error",
  },
};

export function Notice({
  tone = "info",
  title,
  live,
  role,
  id,
  className,
  children,
}: {
  tone?: Tone;
  title?: string;
  live?: "polite" | "assertive";
  role?: "status" | "alert" | "note";
  id?: string;
  className?: string;
  children?: ReactNode;
}) {
  const spec = tones[tone];
  return (
    <div
      id={id}
      role={role}
      aria-live={live}
      className={cn("rounded-card border p-5 lg:p-6", spec.shell, className)}
    >
      <div className="flex gap-3">
        <span aria-hidden="true" className="flex-none font-medium">
          {spec.glyph}
        </span>
        <div className="min-w-0 space-y-2">
          <span className="sr-only">{spec.name}: </span>
          {title ? (
            <p className="text-body-lg font-semibold">{title}</p>
          ) : null}
          {children ? (
            <div className="space-y-2 text-body">{children}</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
