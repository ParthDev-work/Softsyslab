import Link from "next/link";
import { siteSettings } from "@/lib/settings/siteSettings";

/**
 * The brand mark from the supplied design: a 2x2 grid of small squares, two
 * filled and two outlined, reading as modules of a system being assembled.
 * It is decorative — the accessible name comes from the link label, per
 * section 13's "logo has an accessible brand label".
 */
export function Logo({ tone = "anchor" }: { tone?: "anchor" | "inverse" }) {
  const text = tone === "inverse" ? "text-white" : "text-anchor";
  const solid = tone === "inverse" ? "bg-white" : "bg-anchor";
  const outline =
    tone === "inverse" ? "border-white/70" : "border-anchor";

  return (
    <Link
      href="/"
      aria-label={`${siteSettings.brandName} — home`}
      className={`flex shrink-0 items-center gap-2.5 no-underline ${text}`}
    >
      <span
        aria-hidden="true"
        className="grid grid-cols-2 gap-[3px]"
      >
        <span className={`size-[9px] rounded-[2px] ${solid}`} />
        <span className={`size-[9px] rounded-[2px] border-[1.5px] ${outline}`} />
        <span className={`size-[9px] rounded-[2px] border-[1.5px] ${outline}`} />
        <span className="size-[9px] rounded-[2px] bg-brand" />
      </span>
      <span className="text-[1.1875rem] font-bold tracking-[-0.01em]">
        {siteSettings.brandName}
      </span>
    </Link>
  );
}
