import { EditorialShell } from "@/components/blocks/editorial/EditorialShell";
import { ArrowLink } from "@/components/ui/Button";

export function EditorialDeliveryBand({
  eyebrow,
  heading,
  rows,
  cta,
}: {
  eyebrow: string;
  heading: string;
  rows: ReadonlyArray<{ title: string; body: string }>;
  cta?: { label: string; href: string };
}) {
  return (
    <section
      aria-labelledby="delivery-band-h"
      className="bg-surface py-24 md:py-32"
    >
      <EditorialShell className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="type-eyebrow mb-6">{eyebrow}</p>
          <h2
            id="delivery-band-h"
            className="text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-tight tracking-[-0.05em] text-balance"
          >
            {heading}
          </h2>
        </div>
        <div className="divide-y divide-line border-t border-anchor">
          {rows.map((row, index) => (
            <div
              key={row.title}
              className="grid gap-3 py-6 sm:grid-cols-[3rem_1fr_1fr]"
            >
              <span className="font-mono text-xs text-dim">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="font-semibold text-anchor">{row.title}</h3>
              <p className="text-small leading-relaxed text-muted">{row.body}</p>
            </div>
          ))}
          {cta ? (
            <ArrowLink href={cta.href} className="mt-8 inline-flex pt-2">
              {cta.label}
            </ArrowLink>
          ) : null}
        </div>
      </EditorialShell>
    </section>
  );
}
