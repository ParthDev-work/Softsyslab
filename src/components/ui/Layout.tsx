import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Layout primitives — PRD sections 13, 29 and 31, with the design's fluid
 * gutters and section rhythm.
 *
 * 1200px maximum container; gutters clamp from 16px to 24px; section padding
 * clamps from 48px to 88px, or 56px to 112px for a major module. Long-form
 * reading width is 720px.
 */

export function Container({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={cn("container-page", className)}>{children}</div>;
}

type SectionProps = {
  as?: ElementType;
  id?: string;
  labelledBy?: string;
  tone?: "canvas" | "surface" | "ink";
  size?: "default" | "large";
  /** Hairline above the section, the design's main divider between modules. */
  divider?: boolean;
  className?: string;
  children: ReactNode;
};

const tones: Record<NonNullable<SectionProps["tone"]>, string> = {
  canvas: "bg-canvas text-text",
  surface: "bg-surface text-text",
  ink: "bg-ink text-surface",
};

export function Section({
  as: Tag = "section",
  id,
  labelledBy,
  tone = "canvas",
  size = "default",
  divider = false,
  className,
  children,
}: SectionProps) {
  return (
    <Tag
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        tones[tone],
        size === "large" ? "section-y-lg" : "section-y",
        divider && "border-t border-hairline",
        tone === "surface" && "border-y border-hairline",
        className,
      )}
    >
      <Container>{children}</Container>
    </Tag>
  );
}

/** The mono uppercase label that opens a module in the design. */
export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <p className={cn("type-eyebrow", className)}>{children}</p>;
}

export function SectionHeading({
  as: Tag = "h2",
  id,
  children,
  className,
}: {
  as?: ElementType;
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Tag id={id} className={cn("type-h2", className)}>
      {children}
    </Tag>
  );
}

/**
 * The design's recurring module header: heading on the left, a supporting
 * paragraph bottom-aligned on the right, stacking on narrow screens.
 */
export function SectionHeader({
  id,
  heading,
  support,
  eyebrow,
  className,
}: {
  id: string;
  heading: string;
  support?: string;
  eyebrow?: string;
  className?: string;
}) {
  return (
    <div className={cn("mb-10 flex flex-wrap gap-x-16 gap-y-6", className)}>
      <div className="flex-1 basis-90 space-y-5">
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <SectionHeading id={id} className="max-w-[16ch]">
          {heading}
        </SectionHeading>
      </div>
      {support ? (
        <p className="flex-1 basis-90 self-end text-body-lg text-muted max-w-[52ch] text-pretty">
          {support}
        </p>
      ) : null}
    </div>
  );
}

/** 720px reading width for long-form body copy (section 29). */
export function Prose({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={cn("max-w-prose space-y-4", className)}>{children}</div>;
}

export function Lead({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("type-lead max-w-[62ch]", className)}>{children}</p>
  );
}
