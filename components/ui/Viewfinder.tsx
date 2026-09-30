"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

// Four corner brackets that frame their parent, which must be `relative`.
// Each corner is an L of two 23.25-unit arms (46.5 total). A dash of 48
// covers the whole path, so an offset of 48 hides it and 0 shows it.
const corners = [
  { d: "M.75 24V.75H24", place: "left-0 top-0" },
  { d: "M0 .75h23.25V24", place: "right-0 top-0" },
  { d: "M23.25 0v23.25H0", place: "right-0 bottom-0" },
  { d: "M24 23.25H.75V0", place: "left-0 bottom-0" },
];

type Props = {
  // Draw the corners once, clockwise, when the page loads.
  drawOnLoad?: boolean;
};

export default function Viewfinder({ drawOnLoad = false }: Props) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const paths = root.current?.querySelectorAll("path");
      if (!drawOnLoad || !paths) return;

      // Reduced motion never matches here, and CSS keeps the corners drawn.
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", (context) => {
        let active = true;

        // Wait for the final fonts so the frame does not jump mid-draw.
        document.fonts.ready.then(() => {
          if (!active) return;
          context.add(() => {
            gsap.to(paths, {
              strokeDashoffset: 0,
              duration: 0.35,
              stagger: 0.15,
              ease: "power1.inOut",
            });
          });
        });

        return () => {
          active = false;
        };
      });
    },
    { scope: root, dependencies: [drawOnLoad] },
  );

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 text-ink"
    >
      {corners.map(({ d, place }) => (
        <svg
          key={d}
          viewBox="0 0 24 24"
          fill="none"
          className={`absolute size-6 ${place}`}
        >
          <path
            d={d}
            stroke="currentColor"
            strokeWidth={1.5}
            strokeDasharray={48}
            className={
              drawOnLoad ? "motion-safe:[stroke-dashoffset:48]" : undefined
            }
          />
        </svg>
      ))}
    </div>
  );
}
