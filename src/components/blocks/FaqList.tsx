import type { Faq } from "@/lib/content/schemas";
import { SectionHeading } from "@/components/ui/Layout";

/**
 * PRD section 13 module 17 and section 30, in the design's two-column layout:
 * heading on the left, a ruled list of disclosures on the right at 800px.
 *
 * Native details/summary: accessible by default, keyboard operable without
 * script, several items may stay open with no forced auto-close, and every
 * answer is present in the rendered HTML — which is what section 13 requires
 * and what keeps the page useful with JavaScript blocked.
 *
 * Sections 27 and 47 both rule out FAQPage structured data, so none is emitted.
 * These FAQs exist to help a reader, not to chase a rich result Google retired.
 */
export function FaqList({
  heading = "Frequently asked questions",
  headingId = "faqs",
  support,
  faqs,
}: {
  heading?: string;
  headingId?: string;
  support?: string;
  faqs: Faq[];
}) {
  if (faqs.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-x-16 gap-y-8">
      <div className="min-w-0 flex-4 basis-70">
        <SectionHeading id={headingId}>{heading}</SectionHeading>
        {support ? (
          <p className="mt-4 max-w-[32ch] text-body text-muted">{support}</p>
        ) : null}
      </div>

      <div className="min-w-0 max-w-quote flex-8 basis-130 border-t border-line">
        {faqs.map((faq) => (
          <details key={faq.question} className="group border-b border-line">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5.5 text-[1.1875rem]/7 font-medium marker:content-none">
              <span className="text-anchor">{faq.question}</span>
              <span
                aria-hidden="true"
                className="grid size-7 flex-none place-items-center rounded-chip border border-line text-muted transition-colors duration-150 group-hover:border-field motion-reduce:transition-none"
              >
                <svg viewBox="0 0 16 16" className="size-4" fill="currentColor">
                  <path
                    className="group-open:hidden"
                    d="M8 3.25a.75.75 0 0 1 .75.75v3.25H12a.75.75 0 0 1 0 1.5H8.75V12a.75.75 0 0 1-1.5 0V8.75H4a.75.75 0 0 1 0-1.5h3.25V4A.75.75 0 0 1 8 3.25Z"
                  />
                  <path
                    className="hidden group-open:block"
                    d="M4 7.25h8a.75.75 0 0 1 0 1.5H4a.75.75 0 0 1 0-1.5Z"
                  />
                </svg>
              </span>
            </summary>
            <p className="pb-6 pr-14 text-[1.0625rem]/7 text-muted">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </div>
  );
}
