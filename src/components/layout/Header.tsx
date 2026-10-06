import Link from "next/link";
import { Container } from "@/components/ui/Layout";
import { Logo } from "@/components/layout/Logo";
import { mainNav, primaryCta, utilityNav } from "@/components/layout/nav-model";
import {
  MobileMenu,
  NavGroup,
  NavLink,
} from "@/components/layout/NavDisclosure";
import { announcement } from "@/content/homepage";

/**
 * PRD section 12 and section 13 modules 1-2.
 *
 * Two visual levels on desktop: a main row with the logo, the primary sections
 * and the enquiry button, then a utility row. Main row is 64px mobile and 80px
 * desktop. The sticky background is restrained and must not hide anchors or
 * keyboard focus — the global scroll-padding handles the anchor case.
 *
 * The announcement bar is optional and carries only the process line. Section
 * 13 forbids a fabricated launch, event or availability notice.
 */
/**
 * Module 1. Scrolls away rather than sticking: section 13 requires that
 * sticky UI not hide anchors or keyboard focus, and keeping it in the sticky
 * region would put roughly 190px of chrome over every anchored heading.
 */
export function AnnouncementBar() {
  return (
    <div className="border-b border-hairline bg-surface">
      <Container>
        <p className="flex flex-wrap justify-center gap-x-3 gap-y-2 py-3 text-center text-small text-muted">
          <span>{announcement.text}</span>
          <Link
            href={announcement.href}
            className="font-medium text-anchor underline-offset-4 hover:text-brand hover:underline"
          >
            {announcement.linkLabel} →
          </Link>
        </p>
      </Container>
    </div>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-canvas/95 backdrop-blur-sm backdrop-saturate-150 supports-[backdrop-filter]:bg-canvas/90">
      <div className="relative">
        <Container>
          <div className="flex h-16 items-center justify-between gap-6 lg:h-20">
            <Logo />

            <nav aria-label="Main" className="hidden lg:block">
              <ul className="flex items-center gap-1">
                {mainNav.map((section) => (
                  <li key={section.href}>
                    <NavLink href={section.href} label={section.label} />
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex items-center gap-3">
              <Link
                href={primaryCta.href}
                className="hidden h-11 items-center rounded-control bg-anchor px-4.5 font-medium text-white transition-colors duration-150 hover:bg-brand motion-reduce:transition-none lg:inline-flex"
              >
                {primaryCta.label}
              </Link>
              <MobileMenu
                sections={[...mainNav, ...utilityNav]}
                cta={primaryCta}
              />
            </div>
          </div>
        </Container>

        <div className="hidden border-t border-hairline lg:block">
          <Container>
            <nav aria-label="Utility">
              <ul className="flex items-center justify-end gap-1">
                {utilityNav.map((section) =>
                  section.children && section.children.length > 0 ? (
                    <li key={section.href}>
                      <NavGroup section={section} />
                    </li>
                  ) : (
                    <li key={section.href}>
                      <NavLink href={section.href} label={section.label} />
                    </li>
                  ),
                )}
              </ul>
            </nav>
          </Container>
        </div>
      </div>
    </header>
  );
}

/** Section 32 requires a skip link as the first focusable element. */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-100 focus:rounded-control focus:bg-anchor focus:px-4 focus:py-3 focus:font-medium focus:text-white"
    >
      Skip to content
    </a>
  );
}
