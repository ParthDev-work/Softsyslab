import type { Faq } from "@/lib/content/schemas";
import { SectionHeading } from "@/components/ui/Layout";
import { FaqItem } from "@/components/blocks/FaqItem";

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
          <FaqItem key={faq.question} faq={faq} />
        ))}
      </div>
    </div>
  );
}
