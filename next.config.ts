import type { NextConfig } from "next";

/**
 * Section 11's redirect registry.
 *
 * Declared here rather than imported from src/lib/content/routes, because
 * next.config is transpiled without the "@/" path alias and importing the
 * registry would pull the whole content graph into config loading. The
 * content validator cross-checks that every destination below is a published
 * route, so the two cannot drift silently.
 *
 * Sources carry the trailing slash because `trailingSlash: true` normalises
 * the request before custom redirects are matched. A request for the
 * unslashed form still arrives, via one normalising hop — the only chain
 * section 47 tolerates, since it is the framework's canonical-form redirect
 * rather than a redirect pointing at another redirect.
 */
const permanentRedirects = [
  { source: "/company/about/", destination: "/company/" },
  { source: "/company/careers/", destination: "/careers/" },
];

/**
 * PRD section 47 requires one trailing-slash policy, one canonical HTTPS
 * hostname and permanent redirects for alternate forms. `trailingSlash: true`
 * makes `/services/` canonical and redirects `/services` to it, which matches
 * the route registry, the sitemap and every internal link.
 *
 * Section 44's transport and browser controls are applied as headers. The CSP
 * is deliberately strict: this build loads no third-party script, stylesheet,
 * font or image, so every source can be locked to 'self'. `'unsafe-inline'`
 * appears only for style-src, which Next requires for its inlined critical CSS
 * and which carries far less risk than a script allowance.
 */
const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "object-src 'none'",
      "img-src 'self' data:",
      "font-src 'self'",
      "style-src 'self' 'unsafe-inline'",
      // Next's bootstrap and the Server Components payload are inlined.
      "script-src 'self' 'unsafe-inline'",
      "connect-src 'self'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  /* Section 44: HSTS follows a domain and subdomain readiness review, so it is
     opt-in by environment variable rather than on by default. */
  ...(process.env.ENABLE_HSTS === "true"
    ? [
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains",
        },
      ]
    : []),
];

const nextConfig: NextConfig = {
  trailingSlash: true,
  poweredByHeader: false,

  async redirects() {
    return permanentRedirects.map((redirect) => ({
      source: redirect.source,
      destination: redirect.destination,
      permanent: true,
    }));
  },

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
