import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

// Written to out/ at build time; the site is a static export.
export const dynamic = "force-static";

// One page, so one entry.
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: siteUrl.href }];
}
