import type { Metadata } from "next";
import { IBM_Plex_Mono, Schibsted_Grotesk } from "next/font/google";
import "./globals.css";
import {
  AnnouncementBar,
  Header,
  SkipLink,
} from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ConsentControls } from "@/components/layout/ConsentControls";
import { UnverifiedFactsBanner } from "@/components/layout/UnverifiedFactsBanner";
import { OrganizationJsonLd } from "@/lib/seo/JsonLd";
import { pageTitle, shouldIndex } from "@/lib/seo/metadata";
import { siteSettings } from "@/lib/settings/siteSettings";

/**
 * Typeface pairing from the supplied design. Section 29 allows Inter "if
 * licensed/self-hosted" and a licensed monospace for code; Schibsted Grotesk
 * and IBM Plex Mono are both SIL OFL, which clears that condition.
 *
 * next/font downloads and serves them from this origin, so no request reaches
 * a font CDN at runtime — which matters for section 45 (no third-party call
 * before consent) as much as for section 46. Weights are limited to the four
 * and two the design actually uses, and the subset is Latin only.
 *
 * The root layout stays a Server Component (section 40).
 */
const grotesk = Schibsted_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-grotesk",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-plex-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteSettings.canonicalOrigin),
  title: {
    default: pageTitle("Custom Software Development and Product Engineering"),
    template: `%s`,
  },
  description:
    "Explore custom software, web, mobile and SaaS development, delivery methods and engagement options.",
  robots: shouldIndex()
    ? { index: true, follow: true }
    : { index: false, follow: false, nocache: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${grotesk.variable} ${plexMono.variable} h-full`}
    >
      <body className="flex min-h-full flex-col bg-canvas">
        <SkipLink />
        <UnverifiedFactsBanner />
        <AnnouncementBar />
        <Header />
        <main id="main" tabIndex={-1} className="flex-1">
          {children}
        </main>
        <Footer />
        <ConsentControls />
        <OrganizationJsonLd />
      </body>
    </html>
  );
}
