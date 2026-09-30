import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Bricolage_Grotesque, Source_Serif_4 } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import { site } from "@/content/site";
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

export const metadata: Metadata = {
  title: `${site.name} · ${site.role}`,
  description: site.intro,
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
