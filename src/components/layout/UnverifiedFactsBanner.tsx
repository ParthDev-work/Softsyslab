import Link from "next/link";
import { Container } from "@/components/ui/Layout";
import { siteSettings } from "@/lib/settings/siteSettings";

/**
 * The publication-truth surface — PRD sections 2, 11, 26 and 63.
 *
 * The PRD's central thesis is that a visually complete site carrying fabricated
 * content fails the product objective. This build has a complete design system
 * and thirty published routes, and almost no verified company facts. Saying so
 * plainly at the top of every page is the honest resolution.
 *
 * It renders while siteSettings.verified is false and disappears when that flag
 * is set — which can only be done by supplying the real values, since every
 * page reads them from the same record. Removing the banner is therefore a
 * deliberate act tied to the facts arriving, not a CSS change.
 */
export function UnverifiedFactsBanner() {
  if (siteSettings.verified) return null;

  return (
    <div className="border-b border-warning/30 bg-warning-bg text-warning">
      <Container>
        <p className="py-3 text-small">
          <span className="font-bold">Pre-publication build.</span> Company
          identity, addresses and contact details have not been verified, and no
          client work, testimonial or capability claim appears anywhere on this
          site.{" "}
          <Link
            href="/company/business-information/"
            className="font-semibold underline underline-offset-4"
          >
            What is outstanding
          </Link>
          .
        </p>
      </Container>
    </div>
  );
}
