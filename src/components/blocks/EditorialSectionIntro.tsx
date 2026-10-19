import { EditorialShell } from "@/components/blocks/editorial/EditorialShell";

/** Homepage module header in the same editorial split as hub heroes. */
export function EditorialSectionIntro({
  headingId,
  heading,
  support,
}: {
  headingId: string;
  heading: string;
  support?: string;
}) {
  return (
    <EditorialShell className="mb-10">
      <div className="grid gap-8 border-b border-anchor pb-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:items-end lg:gap-16">
        <h2
          id={headingId}
          className="max-w-[16ch] text-[clamp(1.75rem,3.4vw,2.5rem)] font-semibold leading-[1.1] tracking-[-0.03em]"
        >
          {heading}
        </h2>
        {support ? (
          <p className="text-body-lg text-muted text-pretty">{support}</p>
        ) : null}
      </div>
    </EditorialShell>
  );
}
