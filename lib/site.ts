/**
 * Deployed origin, shared by metadata, sitemap, and robots so they can never
 * drift apart. Override per-environment with NEXT_PUBLIC_SITE_URL.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://chunlin-he.vercel.app";
