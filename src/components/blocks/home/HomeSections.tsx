import Link from "next/link";
import type { ReactNode } from "react";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { SpotlightCard } from "@/components/motion/SpotlightCard";
import { TiltCard } from "@/components/motion/TiltCard";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { WordCycle } from "@/components/motion/WordCycle";
import { Reveal } from "@/components/ui/Reveal";
import {
  HomeSectionHeader,
  Pill,
} from "@/components/blocks/home/HomeSectionHeader";
import { cn } from "@/lib/cn";

type Cta = { label: string; href: string };
type Row = { title: string; body: string };

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function CtaLink({
  cta,
  tone = "light",
}: {
  cta: Cta;
  tone?: "light" | "dark";
}) {
  return (
    <Link
      href={cta.href}
      className={cn(
        "group inline-flex min-h-12 items-center gap-3 rounded-full border px-5 text-small font-semibold transition-colors duration-200 motion-reduce:transition-none",
        tone === "light"
          ? "border-line bg-canvas text-anchor hover:border-anchor hover:bg-anchor hover:text-white"
          : "border-white/25 text-white hover:border-white hover:bg-white hover:text-anchor",
      )}
    >
      {cta.label}
      <span
        aria-hidden="true"
        className="transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
      >
        →
      </span>
    </Link>
  );
}

const icons: Record<string, ReactNode> = {
  scope: <path d="M4 6h16M4 12h10M4 18h6" />,
  architecture: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
      <path d="M10 6.5h4.5a2 2 0 0 1 2 2V14" />
    </>
  ),
  delivery: <path d="M5 12.5 10 17.5 19 7" />,
};

/** Module 5 follow-on — the three decisions made early, as lifting cards. */
export function DecisionBand({
  eyebrow,
  heading,
  rows,
  cta,
}: {
  eyebrow: string;
  heading: string;
  rows: readonly Row[];
  cta: Cta;
}) {
  return (
    <section
      aria-labelledby="decide-h"
      className="bg-paper py-[clamp(4.5rem,10vw,8rem)]"
    >
      <div className="container-page">
        <HomeSectionHeader
          eyebrow={eyebrow}
          heading={heading}
          headingId="decide-h"
        />
        <Stagger
          as="ol"
          stagger={0.1}
          className="m-0 grid list-none gap-4 p-0 md:grid-cols-3"
        >
          {rows.map((row, index) => (
            <StaggerItem as="li" key={row.title} className="min-w-0">
              <TiltCard max={4} className="h-full rounded-[1.5rem]">
                <article className="relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-hairline bg-canvas p-7 transition-shadow duration-300 hover:shadow-raised motion-reduce:transition-none">
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-2 -top-6 select-none font-serif text-[8rem] italic leading-none text-tint transition-colors duration-500 group-hover:text-info-bg"
                  >
                    {pad(index + 1)}
                  </span>
                  <span className="relative grid size-12 place-items-center rounded-2xl bg-brand text-white shadow-[0_10px_24px_-10px_var(--color-brand)] transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110 motion-reduce:transition-none">
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="size-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {icons[row.title.toLowerCase()] ?? icons.delivery}
                    </svg>
                  </span>
                  <h3 className="relative mt-10 text-h3 font-semibold tracking-[-0.03em]">
                    {row.title}
                  </h3>
                  <p className="relative mt-3 text-small leading-relaxed text-muted">
                    {row.body}
                  </p>
                </article>
              </TiltCard>
            </StaggerItem>
          ))}
        </Stagger>
        <Reveal className="mt-10">
          <CtaLink cta={cta} />
        </Reveal>
      </div>
    </section>
  );
}

/** Module 9 — technology approach, with the withheld list stated plainly. */
export function TechnologyBand({
  heading,
  body,
  withheldNote,
  cta,
}: {
  heading: string;
  body: string;
  withheldNote: string;
  cta: Cta;
}) {
  return (
    <section aria-labelledby="tech-h" className="py-[clamp(3rem,7vw,5rem)]">
      <div className="container-page">
        <Reveal>
          <div className="relative grid gap-8 overflow-hidden rounded-[1.75rem] border border-hairline bg-surface p-7 sm:p-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
            <div
              aria-hidden="true"
              className="dot-grid fade-mask absolute inset-0"
            />
            <div className="relative">
              <Pill>Technology</Pill>
              <h2
                id="tech-h"
                className="mt-6 text-[clamp(1.75rem,3.4vw,2.6rem)] font-semibold leading-tight tracking-[-0.04em]"
              >
                {heading}
              </h2>
              <p className="mt-4 max-w-[48ch] text-body-lg text-muted text-pretty">
                {body}
              </p>
              <div className="mt-8">
                <CtaLink cta={cta} />
              </div>
            </div>
            <div className="relative self-center rounded-2xl border-2 border-dashed border-line bg-canvas/80 p-6 backdrop-blur">
              <p className="type-meta text-dim">Capability list withheld</p>
              <p className="mt-3 text-small leading-relaxed text-muted">
                {withheldNote}
              </p>
              <div aria-hidden="true" className="mt-6 flex flex-wrap gap-2">
                {[18, 24, 14, 20, 16].map((w) => (
                  <span
                    key={w}
                    className="h-7 rounded-full bg-tint"
                    style={{ width: `${w * 0.25}rem` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/** Module 11 — engagement models on ink, each tile catching the pointer. */
export function EngagementBand({
  heading,
  body,
  models,
  cta,
}: {
  heading: string;
  body: string;
  models: readonly string[];
  cta: Cta;
}) {
  return (
    <section
      aria-labelledby="eng-h"
      className="relative overflow-hidden bg-ink py-[clamp(4.5rem,10vw,8rem)] text-white"
    >
      <div
        aria-hidden="true"
        className="dot-grid-light fade-mask absolute inset-0 opacity-50"
      />
      <div
        aria-hidden="true"
        className="aurora absolute -left-32 top-10 size-[26rem] rounded-full bg-brand/30 blur-3xl"
      />
      <div className="container-page relative grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <Reveal>
          <Pill tone="dark">Engagement</Pill>
          <h2
            id="eng-h"
            className="mt-6 max-w-[14ch] text-[clamp(2rem,4.4vw,3.4rem)] font-semibold leading-[1.04] tracking-[-0.045em] text-white"
          >
            {heading}
          </h2>
          <p className="mt-5 max-w-[46ch] text-body-lg text-white/70 text-pretty">
            {body}
          </p>
          <div className="mt-9">
            <CtaLink cta={cta} tone="dark" />
          </div>
        </Reveal>
        <Stagger
          as="ul"
          stagger={0.06}
          className="m-0 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2"
        >
          {models.map((model, index) => (
            <StaggerItem as="li" key={model}>
              <SpotlightCard radius={180} className="rounded-2xl">
                <div className="group flex items-center gap-4 rounded-2xl border border-ink-border bg-ink-raised/60 px-5 py-5 transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-ink-line motion-reduce:transition-none">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/5 font-mono text-xs text-white/60 transition-colors duration-300 group-hover:bg-brand group-hover:text-white">
                    {pad(index + 1)}
                  </span>
                  <span className="text-body-lg font-medium text-white">
                    {model}
                  </span>
                </div>
              </SpotlightCard>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/** Module 12 — what an agreement should make explicit, as check cards. */
export function PrinciplesBand({
  eyebrow,
  heading,
  intro,
  rows,
  cta,
}: {
  eyebrow: string;
  heading: string;
  intro: string;
  rows: readonly Row[];
  cta: Cta;
}) {
  return (
    <section
      aria-labelledby="principles-h"
      className="py-[clamp(4.5rem,10vw,8rem)]"
    >
      <div className="container-page">
        <HomeSectionHeader
          eyebrow={eyebrow}
          heading={heading}
          headingId="principles-h"
          support={intro}
        />
        <Stagger
          as="ul"
          stagger={0.08}
          className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-4"
        >
          {rows.map((row) => (
            <StaggerItem as="li" key={row.title} className="min-w-0">
              <div className="group h-full rounded-[1.5rem] border border-hairline bg-canvas p-6 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-success-line hover:shadow-raised motion-reduce:transition-none">
                <span className="grid size-11 place-items-center rounded-full bg-success-bg text-success transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none">
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="size-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path
                      pathLength={1}
                      className="linemark-draw"
                      d="M5 12.5 10 17.5 19 7"
                    />
                  </svg>
                </span>
                <h3 className="mt-8 text-h4 font-semibold tracking-[-0.02em]">
                  {row.title}
                </h3>
                <p className="mt-2.5 text-small leading-relaxed text-muted">
                  {row.body}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
        <Reveal className="mt-10">
          <CtaLink cta={cta} />
        </Reveal>
      </div>
    </section>
  );
}

/** Module 13 — security on ink, beside the responsibility boundary figure. */
export function SecurityBand({
  heading,
  body,
  cta,
  figure,
}: {
  heading: string;
  body: string;
  cta: Cta;
  figure: ReactNode;
}) {
  return (
    <section aria-labelledby="sec-h" className="py-[clamp(2rem,5vw,3rem)]">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-[2rem] bg-ink px-6 py-12 text-white sm:px-10 sm:py-14 lg:px-14">
          <div
            aria-hidden="true"
            className="dot-grid-light fade-mask absolute inset-0 opacity-40"
          />
          <div
            aria-hidden="true"
            className="aurora absolute -bottom-32 right-0 size-96 rounded-full bg-accent/25 blur-3xl"
          />
          <div className="relative flex flex-wrap items-center gap-x-14 gap-y-10">
            <Reveal className="min-w-0 flex-1 basis-80">
              <Pill tone="dark">Security and quality</Pill>
              <h2
                id="sec-h"
                className="mt-6 max-w-[16ch] text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.05] tracking-[-0.045em] text-white"
              >
                {heading}
              </h2>
              <p className="mt-5 max-w-[46ch] text-body-lg text-white/70 text-pretty">
                {body}
              </p>
              <div className="mt-9">
                <CtaLink cta={cta} tone="dark" />
              </div>
            </Reveal>
            {figure}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Module 18 — closing call to action as one large brand card. */
export function FinalCta({
  heading,
  body,
  cta,
  secondary,
  cycleWords,
}: {
  heading: string;
  body: string;
  cta: Cta;
  secondary?: Cta;
  cycleWords: readonly string[];
}) {
  return (
    <section
      aria-labelledby="final-cta-h"
      className="pb-[clamp(3rem,7vw,5rem)] pt-[clamp(1rem,3vw,2rem)]"
    >
      <div className="container-page">
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand via-brand-hover to-anchor px-6 py-16 text-center text-white sm:px-12 sm:py-20">
            <div
              aria-hidden="true"
              className="dot-grid-light fade-mask absolute inset-0 -z-10 opacity-60"
            />
            <div
              aria-hidden="true"
              className="aurora absolute -left-24 -top-24 -z-10 size-96 rounded-full bg-accent/40 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="aurora absolute -bottom-32 -right-20 -z-10 size-[28rem] rounded-full bg-info/50 blur-3xl [animation-delay:-6s]"
            />
            <p className="type-eyebrow m-0 text-white/80">
              Explore <WordCycle words={cycleWords} className="text-white" />
            </p>
            <h2
              id="final-cta-h"
              className="mx-auto mt-6 max-w-[16ch] text-[clamp(2.25rem,6vw,4.75rem)] font-semibold leading-[0.98] tracking-[-0.05em] text-white"
            >
              {heading}
            </h2>
            <p className="mx-auto mt-6 max-w-[56ch] text-body-lg text-white/80 text-pretty">
              {body}
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <MagneticButton strength={0.25}>
                <Link
                  href={cta.href}
                  className="group inline-flex h-14 items-center gap-3 rounded-full bg-white px-8 text-[1.0625rem] font-semibold text-brand shadow-[0_16px_40px_-12px_rgba(0,0,0,0.45)] transition-colors hover:bg-tint motion-reduce:transition-none"
                >
                  {cta.label}
                  <span
                    aria-hidden="true"
                    className="grid size-7 place-items-center rounded-full bg-brand text-white transition-transform duration-200 group-hover:-rotate-45 motion-reduce:transition-none"
                  >
                    →
                  </span>
                </Link>
              </MagneticButton>
              {secondary ? <CtaLink cta={secondary} tone="dark" /> : null}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
