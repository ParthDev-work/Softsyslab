import { Container, Eyebrow } from "@/components/ui/Layout";
import { LinkButton } from "@/components/ui/Button";
import { routesInGroup } from "@/lib/content/routes";
import Link from "next/link";

/**
 * PRD section 58. Copy is the specified wording, and the response carries a
 * real 404 status — section 47 forbids a soft 404 that answers 200.
 *
 * The onward links are read from the published-route registry, so this page
 * can never offer a destination that does not exist. Case studies are listed
 * only when approved work exists, which it currently does not.
 */
export default function NotFound() {
  const services = routesInGroup("services").slice(0, 6);

  return (
    <section className="section-y-lg">
      <Container>
        <Eyebrow>404</Eyebrow>
        <h1 className="type-h1 mt-5 max-w-[16ch]">
          We couldn&rsquo;t find that page.
        </h1>
        <p className="type-lead mt-5">
          The link may have changed. Explore our services or contact us if you
          need help.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <LinkButton href="/" variant="dark">
            Return home
          </LinkButton>
          <LinkButton href="/services/" variant="outline">
            Browse services
          </LinkButton>
          <LinkButton href="/contact/" variant="outline">
            Contact us
          </LinkButton>
        </div>

        {services.length > 0 ? (
          <nav aria-label="Services" className="mt-12 border-t border-line pt-6">
            <h2 className="type-meta mb-4 text-dim">Published services</h2>
            <ul className="grid gap-x-8 gap-y-1 p-0 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((route) => (
                <li key={route.path}>
                  <Link
                    href={route.path}
                    className="inline-block py-1.5 text-body text-anchor underline-offset-4 hover:text-brand hover:underline"
                  >
                    {route.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </Container>
    </section>
  );
}
