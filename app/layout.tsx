import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Bricolage_Grotesque, Source_Serif_4 } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import { site } from "@/content/site";
import { siteUrl } from "@/lib/site-url";
import { tokens } from "@/lib/tokens";
import "lenis/dist/lenis.css";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-bricolage",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
});

const title = `${site.name} · ${site.role}`;

// The social image comes from app/opengraph-image.tsx; Next adds its tags.
export const metadata: Metadata = {
  metadataBase: siteUrl,
  title,
  description: site.intro,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: site.name,
    title,
    description: site.intro,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title, description: site.intro },
};

export const viewport: Viewport = {
  themeColor: tokens.paper,
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={`${bricolage.variable} ${sourceSerif.variable}`}>
      <body>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
