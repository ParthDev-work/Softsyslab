import { EditorialShell } from "@/components/blocks/editorial/EditorialShell";

/**
 * Hub hero in the editorial agency layout: eyebrow, oversized headline,
 * supporting copy in a ruled side column — SoftSysLab tokens only.
 */
export function EditorialPageHero({
  eyebrow,
  headingId,
  heading,
  lead,
}: {
  eyebrow: string;
  headingId: string;
  heading: string;
  lead: string;
}) {
  return (
    <section
      aria-labelledby={headingId}
      className="pb-[clamp(3rem,7vw,5rem)] pt-[clamp(2rem,5vw,3.5rem)]"
    >
      <EditorialShell>
        <p className="type-eyebrow mb-8">{eyebrow}</p>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:items-end lg:gap-16">
          <h1
            id={headingId}
            className="max-w-[16ch] text-[clamp(2.35rem,6.5vw,5.5rem)] font-semibold leading-[0.88] tracking-[-0.06em] text-balance"
          >
            {heading}
          </h1>
          <p className="border-t border-anchor pt-5 text-body-lg text-muted text-pretty">
            {lead}
          </p>
        </div>
      </EditorialShell>
    </section>
  );
}
