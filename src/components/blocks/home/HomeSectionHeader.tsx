import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";

/** The rounded label that opens each homepage module. */
export function Pill({
  children,
  tone = "light",
  className,
}: {
  children: ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <p
      className={cn(
        "type-eyebrow m-0 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5",
        tone === "light"
          ? "border-hairline bg-canvas text-muted"
          : "border-white/15 bg-white/5 text-white/80",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "size-1.5 rounded-full",
          tone === "light" ? "bg-brand" : "bg-white",
        )}
      />
      {children}
    </p>
  );
}

/**
 * Homepage module header: pill, heading and a supporting paragraph. Either
 * centred (for showcase modules) or split heading-left / support-right.
 */
export function HomeSectionHeader({
  eyebrow,
  heading,
  headingId,
  support,
  align = "split",
  tone = "light",
  className,
}: {
  eyebrow: string;
  heading: string;
  headingId: string;
  support?: string;
  align?: "split" | "center";
  tone?: "light" | "dark";
  className?: string;
}) {
  const headingClass = cn(
    "text-[clamp(2rem,4.4vw,3.4rem)] font-semibold leading-[1.04] tracking-[-0.045em] text-balance",
    tone === "dark" && "text-white",
  );
  const supportClass = cn(
    "text-body-lg text-pretty",
    tone === "light" ? "text-muted" : "text-white/70",
  );

  if (align === "center") {
    return (
      <Reveal className={cn("mx-auto mb-14 max-w-3xl text-center", className)}>
        <Pill tone={tone}>{eyebrow}</Pill>
        <h2 id={headingId} className={cn(headingClass, "mt-6")}>
          {heading}
        </h2>
        {support ? (
          <p className={cn(supportClass, "mx-auto mt-5 max-w-[58ch]")}>
            {support}
          </p>
        ) : null}
      </Reveal>
    );
  }

  return (
    <Reveal
      className={cn(
        "mb-14 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-16",
        className,
      )}
    >
      <div>
        <Pill tone={tone}>{eyebrow}</Pill>
        <h2 id={headingId} className={cn(headingClass, "mt-6 max-w-[18ch]")}>
          {heading}
        </h2>
      </div>
      {support ? (
        <p className={cn(supportClass, "max-w-[52ch]")}>{support}</p>
      ) : null}
    </Reveal>
  );
}
