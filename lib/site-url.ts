import { site } from "@/content/site";

// Base for every absolute URL (canonical, sitemap, social image). The owner's
// domain wins; otherwise the production URL Vercel sets at build time;
// otherwise localhost for local builds.
const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const siteUrl = new URL(
  site.url || (vercel ? `https://${vercel}` : "http://localhost:3000"),
);
