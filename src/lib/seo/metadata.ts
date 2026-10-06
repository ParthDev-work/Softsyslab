import type { Metadata } from "next";
import { absoluteUrl, siteSettings } from "@/lib/settings/siteSettings";
import type { Seo } from "@/lib/content/schemas";

/**
 * Route metadata — PRD section 47 (REQ-SEO-01).
 *
 * Every indexable page gets a unique title, a unique description, an absolute
 * self-canonical on one canonical HTTPS host, and an Open Graph / X card. The
 * title is the page H1 with the brand appended, which is what section 14
 * specifies for service pages and which keeps titles unique by construction.
 */

/**
 * Indexing is allowed only on the canonical production host. A preview or
 * staging deployment gets noindex as a second layer of protection on top of
 * access control — section 47 is explicit that noindex is not access control.
 */
export function shouldIndex(): boolean {
  if (process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true") return true;
  if (process.env.NEXT_PUBLIC_ALLOW_INDEXING === "false") return false;
  // Default to noindex anywhere the canonical origin has not been configured.
  return siteSettings.canonicalOrigin.startsWith("https://");
}

export function pageTitle(title: string): string {
  return `${title} | ${siteSettings.brandName}`;
}

export function buildMetadata(seo: Seo, path: string): Metadata {
  const canonical = absoluteUrl(path);
  const title = pageTitle(seo.title);
  const indexable = shouldIndex();

  return {
    title,
    description: seo.description,
    alternates: { canonical },
    robots: indexable
      ? { index: true, follow: true }
      : { index: false, follow: false, nocache: true },
    openGraph: {
      type: "website",
      siteName: siteSettings.brandName,
      title,
      description: seo.description,
      url: canonical,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: seo.description,
    },
  };
}
