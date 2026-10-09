import "server-only";

/**
 * Minimal Sanity query client — PRD section 34's CMS, read side.
 *
 * Deliberately plain `fetch` rather than the `@sanity/client` SDK: Next.js
 * patches the global `fetch` to understand the `next.tags` option, which is
 * exactly what src/app/api/webhooks/cms/route.ts needs to invalidate by tag
 * after an edit. Routing reads through the SDK instead would mean losing
 * that integration and reinventing it. The SDK is still used, separately,
 * by scripts/migrate-content-to-sanity.ts — a one-off write path where its
 * mutation/transaction helpers earn their keep and tag-based caching is
 * irrelevant.
 */

const API_VERSION = "2025-01-01";

interface SanityConfig {
  projectId: string;
  dataset: string;
  token: string;
}

function readConfig(): SanityConfig | null {
  const projectId = process.env.CMS_PROJECT_ID;
  const dataset = process.env.CMS_DATASET;
  const token = process.env.CMS_READ_TOKEN;
  if (!projectId || !dataset || !token) return null;
  return { projectId, dataset, token };
}

/** Whether the CMS is configured. Mirrors leadStore's DATABASE_URL switch. */
export function isCmsConfigured(): boolean {
  return readConfig() !== null;
}

/**
 * Runs a GROQ query against the configured dataset. Tags are attached to the
 * underlying fetch so `revalidateTag` in the webhook route can invalidate
 * exactly the pages a changed document affects, no more.
 */
export async function sanityQuery<T>(
  query: string,
  params: Record<string, string> = {},
  tags: string[] = [],
): Promise<T> {
  const config = readConfig();
  if (!config) {
    throw new Error("Sanity is not configured (CMS_PROJECT_ID/CMS_DATASET/CMS_READ_TOKEN unset).");
  }

  const url = new URL(
    `https://${config.projectId}.api.sanity.io/v${API_VERSION}/data/query/${config.dataset}`,
  );
  url.searchParams.set("query", query);
  for (const [name, value] of Object.entries(params)) {
    url.searchParams.set(`$${name}`, JSON.stringify(value));
  }

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${config.token}` },
    cache: "force-cache",
    next: { tags: ["cms", ...tags] },
  });

  if (!response.ok) {
    throw new Error(`Sanity query failed with ${response.status}: ${await response.text()}`);
  }

  const body = (await response.json()) as { result: T };
  return body.result;
}
