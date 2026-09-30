import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

// Written to out/ at build time; the site is a static export.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: new URL("/sitemap.xml", siteUrl).href,
  };
}
