import Link from "next/link";
import type { ReactNode } from "react";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { TiltCard } from "@/components/motion/TiltCard";
import { cn } from "@/lib/cn";

type Capability = {
  number: string;
  title: string;
  copy: string;
  tags: string[];
  href: string;
  accent: string;
};

/*
 * One small illustration per capability. Each is plain markup whose parts
 * move on `group-hover` (the card is the group), so they cost no script and
 * reduced motion stills them through the global transition rule.
 */
const t =
  "transition-transform duration-500 ease-out motion-reduce:transition-none";

function WebArt() {
  return (
    <div className="w-full max-w-64 rounded-control border border-hairline bg-canvas shadow-soft">
      <div className="flex gap-1 border-b border-hairline px-2.5 py-2">
        <span className="size-1.5 rounded-full bg-line" />
        <span className="size-1.5 rounded-full bg-line" />
        <span className="size-1.5 rounded-full bg-line" />
      </div>
      <div className="grid grid-cols-[1fr_2fr] gap-2 p-2.5">
        <div className="grid gap-1.5">
          <span className="h-1.5 rounded-full bg-tint" />
          <span className="h-1.5 rounded-full bg-tint" />
          <span className="h-1.5 w-2/3 rounded-full bg-tint" />
        </div>
        <div className="flex h-16 items-end gap-1.5">
          {[40, 65, 50, 85, 70].map((h, i) => (
            <span
              key={h}
              className={cn(
                "flex-1 origin-bottom rounded-t bg-brand/70 group-hover:scale-y-110",
                t,
              )}
              style={{ height: `${h}%`, transitionDelay: `${i * 50}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function MobileArt() {
  return (
    <div className="relative h-28 w-16 rounded-[0.9rem] border-2 border-anchor/80 bg-canvas p-1.5 shadow-soft">
      <span className="mx-auto block h-1 w-5 rounded-full bg-line" />
      <div className="mt-2 grid gap-1">
        <span className="h-5 rounded bg-accent/20" />
        <span className="h-1.5 rounded-full bg-tint" />
        <span className="h-1.5 w-2/3 rounded-full bg-tint" />
      </div>
      <span
        className={cn(
          "absolute -right-14 top-3 rounded-full border border-hairline bg-canvas px-2.5 py-1 text-[0.625rem] font-medium text-anchor shadow-raised group-hover:-translate-x-3 group-hover:-translate-y-1",
          t,
        )}
      >
        Synced
      </span>
    </div>
  );
}

function SaasArt() {
  return (
    <div className="relative h-24 w-40">
      {[0, 1, 2].map((layer) => (
        <span
          key={layer}
          className={cn(
            "absolute inset-x-0 h-12 rounded-control border border-hairline shadow-soft",
            layer === 0
              ? "bg-canvas group-hover:-translate-y-2"
              : layer === 1
                ? "bg-info-bg"
                : "bg-brand/90 group-hover:translate-y-2",
            t,
          )}
          style={{
            top: `${layer * 18}px`,
            transform: `scale(${1 - layer * 0.06})`,
            zIndex: 3 - layer,
          }}
        />
      ))}
    </div>
  );
}

function AiArt() {
  return (
    <div className="relative grid size-28 place-items-center">
      <span className="absolute inset-0 rounded-full border border-dashed border-line group-hover:rotate-90 transition-transform duration-1000 motion-reduce:transition-none" />
      <span className="absolute inset-4 rounded-full border border-hairline" />
      {[0, 120, 240].map((deg) => (
        <span
          key={deg}
          className="absolute size-2.5 rounded-full bg-accent"
          style={{ transform: `rotate(${deg}deg) translateY(-3.5rem)` }}
        />
      ))}
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className={cn(
          "size-9 text-accent group-hover:scale-125 group-hover:rotate-12",
          t,
        )}
        fill="currentColor"
      >
        <path d="M12 2l1.8 5.6L19.5 9.5l-5.7 1.9L12 17l-1.8-5.6L4.5 9.5l5.7-1.9z" />
        <path
          d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"
          opacity=".6"
        />
      </svg>
    </div>
  );
}

function CloudArt() {
  return (
    <div className="flex items-end gap-3">
      <svg
        viewBox="0 0 64 40"
        aria-hidden="true"
        className="h-14 text-info"
        fill="none"
      >
        <path
          d="M18 36h30a10 10 0 0 0 1-20 14 14 0 0 0-27-3A11 11 0 0 0 18 36z"
          fill="currentColor"
          fillOpacity=".12"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
      <div className="grid gap-1.5">
        {["build", "test", "deploy"].map((step, i) => (
          <span
            key={step}
            className={cn(
              "flex items-center gap-1.5 rounded-full border border-hairline bg-canvas px-2 py-0.5 font-mono text-[0.625rem] text-dim group-hover:translate-x-1.5",
              t,
            )}
            style={{ transitionDelay: `${i * 70}ms` }}
          >
            <span className="size-1.5 rounded-full bg-success" />
            {step}
          </span>
        ))}
      </div>
    </div>
  );
}

function DesignArt() {
  return (
    <div className="relative h-24 w-48">
      <span className="absolute left-0 top-2 h-16 w-24 rounded-control border border-hairline bg-canvas shadow-soft" />
      <span
        className={cn(
          "absolute left-16 top-6 h-16 w-24 rounded-control border-2 border-dashed border-brand/60 bg-info-bg/60 group-hover:translate-x-4 group-hover:-translate-y-1",
          t,
        )}
      />
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className={cn(
          "absolute left-36 top-14 size-5 text-anchor group-hover:translate-x-4 group-hover:-translate-y-1",
          t,
        )}
        fill="currentColor"
      >
        <path d="M4 3l16 7-7 2-2 7z" />
      </svg>
    </div>
  );
}

const art: Record<string, () => ReactNode> = {
  "Web Applications": WebArt,
  "Mobile Products": MobileArt,
  "SaaS Platforms": SaasArt,
  "AI and Automation": AiArt,
  "Cloud and DevOps": CloudArt,
  "Product Design": DesignArt,
};

/* Bento rhythm on a six-column grid: 4+2, 2+4, 3+3. */
const spans = [
  "lg:col-span-4",
  "lg:col-span-2",
  "lg:col-span-2",
  "lg:col-span-4",
  "lg:col-span-3",
  "lg:col-span-3",
];

/** Module 4 — the six capability starting points as a tilting bento grid. */
export function CapabilityBento({
  capabilities,
}: {
  capabilities: Capability[];
}) {
  return (
    <Stagger
      as="ul"
      stagger={0.07}
      className="m-0 grid list-none gap-4 p-0 md:grid-cols-2 lg:grid-cols-6"
    >
      {capabilities.map((capability, index) => {
        const Art = art[capability.title];
        const wide = spans[index]?.endsWith("4");
        return (
          <StaggerItem
            as="li"
            key={capability.number}
            className={cn("min-w-0", spans[index])}
          >
            <TiltCard
              glow={capability.accent}
              max={4}
              className="h-full rounded-[1.5rem]"
            >
              <Link
                href={capability.href}
                className={cn(
                  "flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-hairline bg-canvas transition-[border-color,box-shadow] duration-300 hover:border-line hover:shadow-raised motion-reduce:transition-none",
                  wide && "lg:flex-row",
                )}
              >
                <div
                  className={cn(
                    "relative grid min-h-44 place-items-center overflow-hidden bg-surface p-6",
                    wide && "lg:w-1/2 lg:min-h-full",
                  )}
                >
                  <div
                    aria-hidden="true"
                    className="dot-grid fade-mask absolute inset-0"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute -bottom-16 left-1/2 size-48 -translate-x-1/2 rounded-full opacity-20 blur-3xl transition-opacity duration-500 group-hover:opacity-40"
                    style={{ backgroundColor: capability.accent }}
                  />
                  <div aria-hidden="true" className="relative">
                    {Art ? <Art /> : null}
                  </div>
                </div>
                <div
                  className={cn(
                    "flex flex-1 flex-col p-6 sm:p-7",
                    wide && "lg:justify-center",
                  )}
                >
                  <span className="font-mono text-xs text-dim">
                    {capability.number}
                  </span>
                  <h3 className="mt-3 flex items-center justify-between gap-3 text-h3 font-semibold tracking-[-0.03em]">
                    {capability.title}
                    <span
                      aria-hidden="true"
                      className="grid size-9 shrink-0 place-items-center rounded-full border border-hairline text-brand transition-[transform,background-color,color] duration-300 group-hover:rotate-[-45deg] group-hover:bg-brand group-hover:text-white motion-reduce:transition-none"
                    >
                      →
                    </span>
                  </h3>
                  <p className="mt-3 text-small leading-relaxed text-muted">
                    {capability.copy}
                  </p>
                  {capability.tags.length > 0 ? (
                    <ul className="m-0 mt-5 flex list-none flex-wrap gap-2 p-0">
                      {capability.tags.map((tag) => (
                        <li
                          key={tag}
                          className="rounded-full bg-tint px-3 py-1 text-[0.6875rem] font-medium text-nav"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </Link>
            </TiltCard>
          </StaggerItem>
        );
      })}
    </Stagger>
  );
}
