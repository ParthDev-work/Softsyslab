import Link from "next/link";
import { Container } from "@/components/ui/Layout";
import { Logo } from "@/components/layout/Logo";
import { routesInGroup } from "@/lib/content/routes";
import {
  availableContactChannels,
  siteSettings,
} from "@/lib/settings/siteSettings";
import { ConsentPreferencesLink } from "@/components/layout/ConsentControls";

/**
 * PRD section 12 and section 13 module 19, in the design's layout: an identity
 * block, mono-labelled link columns, and a separate bottom row carrying the
 * legal status and the consent control.
 *
 * Columns are built from the published-route registry, so an unpublished area
 * contributes no column rather than a dead heading. Identity, contact and legal
 * links stay visible at every width. Social links render only for entries that
 * exist — section 39 says to hide missing or placeholder URLs, not publish them.
 */
export function Footer() {
  const columns = [
    { title: "Services", routes: routesInGroup("services").slice(0, 7) },
    { title: "Solutions", routes: routesInGroup("solutions") },
    {
      title: "Company",
      routes: [
        ...routesInGroup("company"),
        ...routesInGroup("trust"),
        ...routesInGroup("careers"),
        ...routesInGroup("contact"),
      ],
    },
  ].filter((column) => column.routes.length > 0);

  const channels = availableContactChannels();
  const legal = routesInGroup("legal");
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-hairline bg-canvas">
      <Container>
        <div className="flex flex-wrap gap-x-16 gap-y-10 pb-6 pt-[clamp(2.5rem,6vw,4rem)]">
          <div className="min-w-0 flex-2 basis-65">
            <Logo />
            <p className="mt-3 max-w-[34ch] text-small text-muted">
              Custom software, web, mobile and SaaS development — planned before
              it is built.
            </p>
            {channels.length > 0 ? (
              <ul className="mt-4 space-y-1 p-0">
                {channels.map((channel) => (
                  <li key={channel.href}>
                    <a
                      href={channel.href}
                      className="inline-block py-1.5 text-small text-anchor underline-offset-4 hover:text-brand hover:underline"
                    >
                      {channel.value}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
            {siteSettings.socialUrls.length > 0 ? (
              <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 p-0">
                {siteSettings.socialUrls.map((social) => (
                  <li key={social.url}>
                    <a
                      href={social.url}
                      rel="noopener noreferrer"
                      className="text-small text-anchor underline underline-offset-4 hover:text-brand"
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          {columns.map((column) => (
            <nav
              key={column.title}
              aria-label={column.title}
              className="min-w-0 flex-1 basis-40"
            >
              <h2 className="type-meta mb-3.5 text-dim">{column.title}</h2>
              <ul className="grid gap-1 p-0">
                {column.routes.map((route) => (
                  <li key={route.path}>
                    <Link
                      href={route.path}
                      className="inline-block py-1.5 text-small text-anchor underline-offset-4 hover:text-brand hover:underline"
                    >
                      {route.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <nav aria-label="Legal" className="min-w-0 flex-1 basis-40">
            <h2 className="type-meta mb-3.5 text-dim">Legal</h2>
            <ul className="grid gap-1 p-0">
              {legal.map((route) => (
                <li key={route.path}>
                  <Link
                    href={route.path}
                    className="inline-block py-1.5 text-small text-anchor underline-offset-4 hover:text-brand hover:underline"
                  >
                    {route.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3 border-t border-hairline py-5 text-xs text-muted">
          <p className="max-w-[70ch]">
            {siteSettings.verified && siteSettings.legalName ? (
              <>
                © {year} {siteSettings.legalName}.
                {siteSettings.registeredAddress ? (
                  <> Registered address: {siteSettings.registeredAddress}.</>
                ) : null}
              </>
            ) : (
              <>
                © {year} {siteSettings.brandName}. Legal entity, jurisdiction and
                registered address pending verification —{" "}
                <Link
                  href="/company/business-information/"
                  className="text-anchor underline underline-offset-4 hover:text-brand"
                >
                  see their status
                </Link>
                .
              </>
            )}
          </p>
          <ConsentPreferencesLink />
        </div>
      </Container>
    </footer>
  );
}
