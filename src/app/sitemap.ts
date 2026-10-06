import type { MetadataRoute } from "next";
import { publishedRoutes } from "@/lib/content/routes";
import { absoluteUrl } from "@/lib/settings/siteSettings";
import { shouldIndex } from "@/lib/seo/metadata";

/**
 * PRD section 47: generate the sitemap from published indexable records only.
 *
 * It is built from the same route registry the navigation uses, so a withheld
 * route is structurally incapable of appearing here — there is no second list
 * to forget to update. Drafts, previews, admin surfaces and private files do
 * not exist in this build and so cannot leak into it.
 *
 * A non-production deployment emits an empty sitemap rather than advertising
 * preview URLs for crawling.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!shouldIndex()) return [];

  return publishedRoutes.map((route) => ({
    url: absoluteUrl(route.path),
    changeFrequency: route.path === "/" ? "weekly" : "monthly",
    priority: route.path === "/" ? 1 : route.group === "legal" ? 0.3 : 0.7,
  }));
}
