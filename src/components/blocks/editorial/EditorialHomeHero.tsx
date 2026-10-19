import { EditorialShell } from "@/components/blocks/editorial/EditorialShell";
import { ArrowLink } from "@/components/ui/Button";
import { LineMark } from "@/components/ui/LineMark";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { TypedLine } from "@/components/motion/TypedLine";

export function EditorialHomeHero({
  headingId,
  headingLead,
  headingAccent,
  supportingLine,
  body,
  primaryHref,
  primaryLabel,
}: {
  headingId: string;
  headingLead: string;
  headingAccent: string;
  /** Short mono status line, typed out above the body copy. */
  supportingLine: string;
  body: string;
  primaryHref: string;
  primaryLabel: string;
}) {
  return (
    <section aria-labelledby={headingId} className="pb-12 pt-12 md:pb-20 md:pt-20">
      <EditorialShell>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,19rem)] lg:items-end">
          <h1
            id={headingId}
            className="max-w-[14ch] text-[clamp(3rem,9.5vw,7.5rem)] font-semibold leading-[0.82] tracking-[-0.07em] text-balance"
          >
            {headingLead}
            <br />
            <span className="inline-flex items-center gap-[0.15em] font-serif italic">
              {headingAccent}
              <span
                aria-hidden="true"
                className="mb-[0.1em] inline-block size-[0.45em] shrink-0 bg-brand"
              />
            </span>
          </h1>
          <div className="border-t border-anchor pt-5 lg:mb-1">
            <div className="flex items-center gap-2.5 text-small text-dim">
              <LineMark className="size-5 shrink-0" />
              <TypedLine text={supportingLine} />
            </div>
            <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted">{body}</p>
            <div className="mt-7">
              <MagneticButton>
                <ArrowLink href={primaryHref} className="text-base font-semibold">
                  {primaryLabel}
                </ArrowLink>
              </MagneticButton>
            </div>
          </div>
        </div>
      </EditorialShell>
    </section>
  );
}
