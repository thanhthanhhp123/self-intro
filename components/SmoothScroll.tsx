"use client";

import Lenis from "lenis";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

// Lenis drives the page scroll and feeds ScrollTrigger. With reduced motion
// it never starts, so the page keeps native scrolling.
export default function SmoothScroll() {
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const lenis = new Lenis({ anchors: true });
      const raf = (time: number) => lenis.raf(time * 1000);

      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);

      return () => {
        gsap.ticker.remove(raf);
        gsap.ticker.lagSmoothing(500, 33);
        lenis.destroy();
      };
    });
  });

  return null;
}
