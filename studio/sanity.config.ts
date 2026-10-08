import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemaTypes";

/**
 * Standalone Sanity Studio for softsyslab — PRD section 34's CMS.
 *
 * Deliberately not embedded in the Next.js app (no next-sanity /studio
 * route): the main app's CSP in next.config.ts locks every source to 'self'
 * on the premise that it loads no third-party script, font or stylesheet.
 * Studio needs its own script bundle, XHR to api.sanity.io and a websocket
 * for live updates — giving it that would mean loosening the public site's
 * CSP to carry an editor tool. Running it here instead costs nothing extra:
 * `npx sanity deploy` hosts it free on Sanity's own <project>.sanity.studio,
 * or `npm run dev` in this folder runs it locally. Either way it talks to
 * the same dataset the Next app reads from CMS_PROJECT_ID/CMS_DATASET.
 */
export default defineConfig({
  name: "softsyslab",
  title: "SoftSysLab",

  projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? "",
  dataset: process.env.SANITY_STUDIO_DATASET ?? "production",

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
});
