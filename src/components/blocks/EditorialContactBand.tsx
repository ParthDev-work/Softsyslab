import Link from "next/link";
import { EditorialShell } from "@/components/blocks/editorial/EditorialShell";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { WordCycle } from "@/components/motion/WordCycle";

/**
 * Full-width closing CTA band (Figma ContactBand) using brand anchor colours.
 */
export function EditorialContactBand({
  eyebrow = "Have a software project in mind?",
  heading,
  href = "/contact/",
  label = "Start a conversation",
  cycleWords,
}: {
  eyebrow?: string;
  heading: string;
  href?: string;
  label?: string;
  /** Optional — when given, the eyebrow reads "Explore <word>" and cycles through these instead of the static `eyebrow` text. */
  cycleWords?: readonly string[];
}) {
  return (
    <section
      aria-labelledby="editorial-cta-h"
      className="bg-brand text-white"
    >
      <EditorialShell className="py-[clamp(3.5rem,8vw,6.5rem)]">
        <p className="type-eyebrow mb-8 text-white/85">
          {cycleWords && cycleWords.length > 0 ? (
            <>
              Explore <WordCycle words={cycleWords} className="text-white" />
            </>
          ) : (
            eyebrow
          )}
        </p>
        <Link
          href={href}
          className="group flex flex-col gap-6 border-b-2 border-white/90 pb-6 sm:flex-row sm:items-end sm:justify-between"
        >
          <span
            id="editorial-cta-h"
            className="max-w-[14ch] text-[clamp(2rem,6vw,4.5rem)] font-semibold leading-[0.95] tracking-[-0.05em] text-balance"
          >
            {heading}
          </span>
          <span className="inline-flex shrink-0 items-center gap-4 self-start pb-1 text-small font-semibold sm:self-auto">
            {label}
            <MagneticButton strength={0.4}>
              <span
                aria-hidden="true"
                className="grid size-12 place-items-center bg-white text-brand transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none md:size-14"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="size-5 -rotate-45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <path d="M4 12h15M13 6l6 6-6 6" />
                </svg>
              </span>
            </MagneticButton>
          </span>
        </Link>
      </EditorialShell>
    </section>
  );
}
