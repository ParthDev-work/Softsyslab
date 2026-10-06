import { LinkButton } from "@/components/ui/Button";
import { Container } from "@/components/ui/Layout";

/**
 * PRD section 13 module 18, in the design's treatment: a bordered surface panel
 * inside the container with an 800px centred block.
 *
 * Section 31's default is no sticky bottom CTA, so this is the page-level call
 * to action and nothing follows the reader down the page.
 */
export function CtaBanner({
  heading,
  body,
  label,
  href = "/contact/",
}: {
  heading: string;
  body?: string;
  label: string;
  href?: string;
}) {
  return (
    <section
      aria-labelledby="page-cta"
      className="pb-[clamp(3rem,8vw,5.5rem)]"
    >
      <Container>
        <div className="rounded-card border border-hairline bg-surface px-[clamp(1.5rem,5vw,3rem)] py-[clamp(3rem,7vw,5rem)]">
          <div className="mx-auto max-w-quote md:text-center">
            <h2
              id="page-cta"
              className="text-[clamp(2rem,4.4vw,3.25rem)]/[1.1] font-semibold tracking-[-0.025em]"
            >
              {heading}
            </h2>
            {body ? (
              <p className="mx-auto mt-6 max-w-[60ch] text-body-lg text-muted text-pretty">
                {body}
              </p>
            ) : null}
            <div className="mt-8">
              <LinkButton
                href={href}
                size="lg"
                className="w-full justify-center md:w-auto"
              >
                {label}
              </LinkButton>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
