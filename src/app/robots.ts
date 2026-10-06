import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/settings/siteSettings";
import { shouldIndex } from "@/lib/seo/metadata";

/**
 * PRD section 47. Robots points to the sitemap on the canonical host.
 *
 * A non-production deployment disallows everything. Note that this is a second
 * layer only — section 47 is explicit that noindex and robots.txt are not
 * access control, and that a URL blocked from crawling cannot have its noindex
 * read. Preview protection belongs at the platform.
 */
export default function robots(): MetadataRoute.Robots {
  if (!shouldIndex()) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
