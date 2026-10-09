import "server-only";
import { PrismaClient } from "@prisma/client";

/**
 * Prisma client singleton — PRD section 42's operational database.
 *
 * Next.js dev mode hot-reloads server modules on every edit. Constructing a
 * new `PrismaClient` at module scope would otherwise open a fresh connection
 * pool on every reload until the old ones are garbage collected. Caching the
 * instance on `globalThis` in development survives the reload; production
 * runs one module instance per process already, so no caching is needed
 * there and none is applied.
 *
 * Nothing here opens a connection eagerly — Prisma connects lazily on first
 * query — so importing this module is safe even when `DATABASE_URL` is
 * unset (selectStore in leadStore.ts never imports it in that case).
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma: PrismaClient =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
