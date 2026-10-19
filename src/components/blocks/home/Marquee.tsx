/**
 * An endless strip of labels. The list renders twice so the CSS loop can
 * translate by exactly half its width; the second copy is hidden from
 * assistive technology so the labels are announced once. Pauses on hover.
 */
export function Marquee({ items }: { items: readonly string[] }) {
  const row = (hidden: boolean) => (
    <ul
      aria-hidden={hidden || undefined}
      className="m-0 flex shrink-0 list-none items-center gap-10 p-0 pr-10"
    >
      {items.map((item) => (
        <li
          key={item}
          className="flex items-center gap-10 whitespace-nowrap text-[clamp(1.25rem,2.4vw,1.75rem)] font-semibold tracking-[-0.03em] text-anchor/80"
        >
          {item}
          <span aria-hidden="true" className="text-brand">
            ✦
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="marquee relative overflow-hidden border-y border-hairline bg-canvas py-6 [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
      <div className="marquee-track flex w-max">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
