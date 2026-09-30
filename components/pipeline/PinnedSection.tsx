"use client";

import { useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { buildPipeline } from "./timeline";

type Props = {
  labelledBy: string;
  className?: string;
  children: ReactNode;
};

// The section element for EdgePipeline. It pins and scrubs only when motion
// is allowed; with reduced motion it stays a plain section and CSS shows the
// stacked steps instead.
export default function PinnedSection({ labelledBy, className, children }: Props) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;

      const mm = gsap.matchMedia();
      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          wide: "(width >= 64rem)",
          narrow: "(width < 48rem)",
        },
        (context) => {
          const { motion, wide, narrow } = context.conditions ?? {};
          if (!motion) return;
          return buildPipeline(section, { wide: !!wide, narrow: !!narrow });
        },
      );

      // Web fonts change line heights, so measure the pin again once they load.
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby={labelledBy} className={className}>
      {children}
    </section>
  );
}
