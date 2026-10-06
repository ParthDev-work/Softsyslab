"use client";

import { Button, LinkButton } from "@/components/ui/Button";
import { Container, Eyebrow } from "@/components/ui/Layout";
import { siteSettings } from "@/lib/settings/siteSettings";

/**
 * PRD section 58's 500 state.
 *
 * Section 58: "Do not imply a form was received when persistence is
 * uncertain." So this page never speculates about what did or did not happen
 * to an in-flight submission; it offers a retry, and the contact form carries
 * its own idempotency key so that retrying cannot create a second lead.
 *
 * The digest is shown because section 58 asks for a safe request reference in
 * the supporting text. It identifies the error in the platform logs and
 * contains nothing about the visitor.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="section-y-lg">
      <Container>
        <Eyebrow>Error</Eyebrow>
        <h1 className="type-h1 mt-5 max-w-[16ch]">Something went wrong.</h1>
        <p className="type-lead mt-5">
          Please try again. If the problem continues, contact us
          {siteSettings.businessEmail ? (
            <>
              {" "}
              at{" "}
              <a
                href={`mailto:${siteSettings.businessEmail}`}
                className="text-brand underline underline-offset-4"
              >
                {siteSettings.businessEmail}
              </a>
            </>
          ) : (
            " through the contact form"
          )}
          {error.digest ? (
            <>
              {" "}
              and include reference{" "}
              <span className="font-mono text-anchor">{error.digest}</span>
            </>
          ) : null}
          .
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button onClick={reset} variant="dark">
            Try again
          </Button>
          <LinkButton href="/" variant="outline">
            Return home
          </LinkButton>
        </div>
      </Container>
    </section>
  );
}
