import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Card } from "@/components/ui/Card";
import { Notice } from "@/components/ui/Notice";
import {
  Container,
  Eyebrow,
  Lead,
  Section,
} from "@/components/ui/Layout";
import { ContactForm } from "@/components/blocks/ContactForm";
import { FaqList } from "@/components/blocks/FaqList";
import { BreadcrumbJsonLd } from "@/lib/seo/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { contactPage } from "@/content/pages";
import { leadStore } from "@/lib/server/leadStore";
import { availableContactChannels } from "@/lib/settings/siteSettings";

export const metadata: Metadata = buildMetadata(contactPage.seo, "/contact/");

const trail = [
  { label: "Home", href: "/" },
  { label: "Contact", href: "/contact/" },
];

/**
 * PRD section 20 and the section 54 contact wireframe: an 8-column form with a
 * 4-column next-steps sidebar, labels above controls, the legal notice beside
 * submission, and no map anywhere near the top of the page.
 *
 * The page is a Server Component; only the form itself is a Client Component
 * (section 40). The durability of the lead store is read on the server and
 * passed down, so the success screen can be honest about what was and was not
 * persisted without the client guessing.
 *
 * No response-time target appears anywhere. Section 20 permits one only after
 * operational approval, which has not happened.
 */
export default function ContactPage() {
  const channels = availableContactChannels();

  return (
    <>
      <BreadcrumbJsonLd trail={trail} />

      <Container>
        <Breadcrumb trail={trail} />
      </Container>

      <section aria-labelledby="contact-h" className="pb-[clamp(2rem,5vw,3rem)]">
        <Container>
          <Eyebrow>Contact</Eyebrow>
          <h1 id="contact-h" className="type-h1 mt-5 max-w-[14ch]">
            {contactPage.h1}
          </h1>
          <Lead className="mt-5">{contactPage.lead}</Lead>
        </Container>
      </section>

      <section className="pb-[clamp(3rem,8vw,5.5rem)]">
        <Container>
          <div className="flex flex-wrap items-start gap-x-16 gap-y-12">
            <div className="min-w-0 flex-8 basis-140">
              {!leadStore.durable ? (
                <Notice
                  tone="warning"
                  role="note"
                  title="This form is not connected to a durable database yet"
                  className="mb-10"
                >
                  <p>
                    The endpoint validates, rate-limits and records your enquiry
                    on the running instance, but there is no database, no
                    confirmation email and no CRM behind it yet. Nothing is sent
                    to anyone. Please do not use this form for an enquiry you
                    need answered.
                  </p>
                </Notice>
              ) : null}

              <ContactForm storeIsDurable={leadStore.durable} />
            </div>

            <aside className="grid min-w-0 flex-4 basis-75 gap-6 lg:sticky lg:top-36">
              <Card tone="surface">
                <h2 className="text-h4 font-semibold">What happens next</h2>
                <ol className="mt-5 grid list-none gap-4.5 p-0">
                  {contactPage.nextSteps.map((step, index) => (
                    <li
                      key={step.title}
                      className="grid grid-cols-[2rem_minmax(0,1fr)] text-small"
                    >
                      <span
                        aria-hidden="true"
                        className="font-mono text-brand"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span>
                        <strong className="font-semibold">{step.title}.</strong>{" "}
                        <span className="text-muted">{step.body}</span>
                      </span>
                    </li>
                  ))}
                </ol>
              </Card>

              <Card>
                <h2 className="text-h4 font-semibold">Other ways to reach us</h2>
                {channels.length > 0 ? (
                  <ul className="mt-3 grid gap-2 p-0">
                    {channels.map((channel) => (
                      <li key={channel.href} className="text-small">
                        <span className="text-muted">{channel.label}: </span>
                        <a
                          href={channel.href}
                          className="text-anchor underline underline-offset-4 hover:text-brand"
                        >
                          {channel.value}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-small text-muted">
                    A business email, telephone number and address will appear
                    here once they have been verified. Until then this form is
                    the only published route.
                  </p>
                )}
              </Card>

              <nav aria-label="Related" className="grid gap-1 text-small">
                {[
                  { label: "Engagement models", href: "/engagement-models/" },
                  { label: "How we work", href: "/how-we-work/" },
                  { label: "Security approach", href: "/security/" },
                  { label: "Privacy Policy", href: "/privacy/" },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="py-1.5 text-anchor underline-offset-4 hover:text-brand hover:underline"
                  >
                    {link.label} →
                  </Link>
                ))}
              </nav>
            </aside>
          </div>
        </Container>
      </section>

      <Section tone="surface" labelledBy="contact-faqs">
        <FaqList faqs={[...contactPage.faqs]} headingId="contact-faqs" />
      </Section>
    </>
  );
}
