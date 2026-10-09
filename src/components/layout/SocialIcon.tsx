/**
 * Local inline-SVG glyphs for the footer's social links (section 39: render
 * only the entries that exist, icon alongside the label rather than instead
 * of it). The CSP forbids third-party scripts, styles and fonts, so there is
 * no icon font or CDN sprite to reach for — every mark here is hand-drawn
 * and inlined, matched against `social.label` by a simple keyword test.
 *
 * An unrecognised label still gets a generic link glyph: section 39 says
 * hide missing/placeholder URLs, not render a known entry without an icon.
 */

const commonProps = {
  viewBox: "0 0 16 16",
  "aria-hidden": true as const,
  className: "size-4 shrink-0",
  fill: "currentColor",
};

function LinkedInGlyph() {
  return (
    <svg {...commonProps}>
      <path d="M2.5 5.2h2.4V13H2.5V5.2Zm1.2-3.9a1.4 1.4 0 1 1 0 2.8 1.4 1.4 0 0 1 0-2.8ZM6.6 5.2h2.3v1.07c.33-.6 1.14-1.23 2.3-1.23 2.46 0 2.8 1.62 2.8 3.47V13h-2.4V8.96c0-.96-.02-2.2-1.34-2.2-1.34 0-1.56 1.05-1.56 2.13V13H6.6V5.2Z" />
    </svg>
  );
}

function XTwitterGlyph() {
  return (
    <svg {...commonProps}>
      <path d="M9.47 6.94 13.63 2h-1.25l-3.6 4.3L5.9 2H2.17l4.46 6.5L2 14.5h1.25l3.86-4.6 3.1 4.6h3.72L9.47 6.94Zm-1.37 1.63-.45-.65L3.9 2.95h1.5l2.9 4.2.45.64 3.95 5.72h-1.5L8.1 8.57Z" />
    </svg>
  );
}

function GitHubGlyph() {
  return (
    <svg {...commonProps}>
      <path d="M8 1.3a6.7 6.7 0 0 0-2.1 13.06c.34.06.46-.15.46-.33v-1.28c-1.87.4-2.26-.8-2.26-.8-.3-.78-.75-.98-.75-.98-.6-.42.05-.4.05-.4.68.05 1.04.7 1.04.7.6 1.04 1.58.74 1.96.56.06-.44.24-.74.44-.9-1.5-.18-3.08-.76-3.08-3.37 0-.75.26-1.35.7-1.83-.07-.17-.3-.88.07-1.83 0 0 .58-.19 1.9.7a6.5 6.5 0 0 1 3.46 0c1.32-.89 1.9-.7 1.9-.7.37.95.14 1.66.07 1.83.44.48.7 1.08.7 1.83 0 2.62-1.58 3.19-3.09 3.36.25.22.46.63.46 1.28v1.9c0 .18.12.4.46.33A6.7 6.7 0 0 0 8 1.3Z" />
    </svg>
  );
}

function FacebookGlyph() {
  return (
    <svg {...commonProps}>
      <path d="M9.4 14.5V8.74h1.94l.29-2.25H9.4V5.1c0-.65.18-1.1 1.1-1.1h1.18V2.03C11.5 2 10.84 1.94 10.07 1.94c-1.63 0-2.75 1-2.75 2.83v1.72H5.37v2.25h1.95v5.76H9.4Z" />
    </svg>
  );
}

function InstagramGlyph() {
  return (
    <svg {...commonProps}>
      <path d="M5.1 1.5h5.8a3.6 3.6 0 0 1 3.6 3.6v5.8a3.6 3.6 0 0 1-3.6 3.6H5.1a3.6 3.6 0 0 1-3.6-3.6V5.1a3.6 3.6 0 0 1 3.6-3.6Zm0 1.3a2.3 2.3 0 0 0-2.3 2.3v5.8a2.3 2.3 0 0 0 2.3 2.3h5.8a2.3 2.3 0 0 0 2.3-2.3V5.1a2.3 2.3 0 0 0-2.3-2.3H5.1ZM8 4.9a3.1 3.1 0 1 1 0 6.2 3.1 3.1 0 0 1 0-6.2Zm0 1.3a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 0 0 0-3.6Zm3.4-2.3a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5Z" />
    </svg>
  );
}

function YouTubeGlyph() {
  return (
    <svg {...commonProps}>
      <path d="M14.5 5.3a1.9 1.9 0 0 0-1.34-1.35C12.05 3.6 8 3.6 8 3.6s-4.05 0-5.16.35A1.9 1.9 0 0 0 1.5 5.3C1.15 6.42 1.15 8 1.15 8s0 1.58.35 2.7a1.9 1.9 0 0 0 1.34 1.35c1.11.35 5.16.35 5.16.35s4.05 0 5.16-.35a1.9 1.9 0 0 0 1.34-1.35c.35-1.12.35-2.7.35-2.7s0-1.58-.35-2.7ZM6.6 10.1V5.9L10.2 8l-3.6 2.1Z" />
    </svg>
  );
}

/** Generic link mark used for any platform not matched above. */
function GenericGlyph() {
  return (
    <svg {...commonProps}>
      <path d="M6.3 9.7a2.3 2.3 0 0 1 0-3.25l1.63-1.63a2.3 2.3 0 0 1 3.25 3.25l-.75.75a.75.75 0 1 1-1.06-1.06l.75-.75a.8.8 0 0 0-1.13-1.13L7.36 7.5a.8.8 0 0 0 0 1.13.75.75 0 1 1-1.06 1.07Zm3.4-3.4a2.3 2.3 0 0 1 0 3.25L8.07 11.2a2.3 2.3 0 0 1-3.25-3.25l.75-.75a.75.75 0 1 1 1.06 1.06l-.75.75a.8.8 0 0 0 1.13 1.13l1.63-1.63a.8.8 0 0 0 0-1.13.75.75 0 1 1 1.06-1.07Z" />
    </svg>
  );
}

const matchers: Array<{ test: RegExp; Glyph: () => React.ReactElement }> = [
  { test: /linkedin/i, Glyph: LinkedInGlyph },
  { test: /twitter|\bx\b/i, Glyph: XTwitterGlyph },
  { test: /github/i, Glyph: GitHubGlyph },
  { test: /facebook/i, Glyph: FacebookGlyph },
  { test: /instagram/i, Glyph: InstagramGlyph },
  { test: /youtube/i, Glyph: YouTubeGlyph },
];

/** Picks the matching glyph for a social label, falling back to a generic mark. */
export function SocialIcon({ label }: { label: string }) {
  const match = matchers.find((m) => m.test.test(label));
  const Glyph = match?.Glyph ?? GenericGlyph;
  return <Glyph />;
}
