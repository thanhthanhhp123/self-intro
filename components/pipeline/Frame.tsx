import { site } from "@/content/site";
import { inDeviceTransform, reached, type Step } from "./state";

// One camera frame on a 320 x 200 grid: a person, a car, and a crate in flat
// grays, sensor grain on top, then the detection boxes and their labels.
// Boxes follow the order of site.pipeline.detections.
const boxes = [
  { d: "M45 51h34v103H45Z", x: 45, y: 51 },
  { d: "M113 95h122v58H113Z", x: 113, y: 95 },
  { d: "M247 107h50v47h-50Z", x: 247, y: 107 },
];

const layer = "absolute inset-0 size-full";

type Props = {
  // Unique per stage on the page, used for the grain filter id.
  id: string;
  step?: Step;
};

export default function Frame({ id, step }: Props) {
  const animated = step === undefined;
  const detected = reached(step, 2);
  // Separate compositor layers, so a scrubbed layer never repaints the grain.
  const own = animated ? "will-change-transform" : "";
  const grain = `${id}-grain`;

  return (
    <div
      data-pl="frame"
      className={`${layer} ${own}`}
      style={reached(step, 4) ? { transform: inDeviceTransform } : undefined}
    >
      <svg viewBox="0 0 320 200" className={layer}>
        <rect width="320" height="200" className="fill-grid" />
        <rect y="148" width="320" height="52" className="fill-ink/10" />
      </svg>

      <svg
        data-pl="objects"
        viewBox="0 0 320 200"
        className={`${layer} ${own}`}
        style={animated ? { opacity: 0 } : undefined}
      >
        <circle cx="62" cy="64" r="8" className="fill-ink/45" />
        <path
          d="M50 76h24v38h-3v36h-7v-36h-4v36h-7v-36h-3Z"
          className="fill-ink/45"
        />
        <path d="M136 118l14-18h46l16 18h18v22H118v-22Z" className="fill-ink/35" />
        <path d="M147 116l8-10h16v10Zm28 0v-10h19l9 10Z" className="fill-grid/70" />
        <circle cx="142" cy="140" r="9" className="fill-ink/60" />
        <circle cx="206" cy="140" r="9" className="fill-ink/60" />
        <rect x="252" y="112" width="40" height="38" className="fill-ink/25" />
        <rect x="269" y="112" width="6" height="38" className="fill-ink/10" />
      </svg>

      <svg className={`${layer} ${own} max-md:opacity-60`}>
        <filter
          id={grain}
          x="0"
          y="0"
          width="100%"
          height="100%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves={2}
            seed={7}
            stitchTiles="stitch"
            result="noise"
          />
          {/* Bright noise becomes dark specks, dim noise becomes light ones. */}
          <feColorMatrix
            in="noise"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  3.5 0 0 0 -2"
            result="darkMask"
          />
          <feColorMatrix
            in="noise"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -3.5 0 0 0 1.5"
            result="lightMask"
          />
          <feFlood style={{ floodColor: "var(--ink)" }} />
          <feComposite in2="darkMask" operator="in" result="dark" />
          <feFlood style={{ floodColor: "var(--surface)" }} />
          <feComposite in2="lightMask" operator="in" result="light" />
          <feMerge>
            <feMergeNode in="dark" />
            <feMergeNode in="light" />
          </feMerge>
        </filter>
        <rect width="100%" height="100%" filter={`url(#${grain})`} />
      </svg>

      <svg
        data-pl="boxes"
        viewBox="0 0 320 200"
        fill="none"
        className={`${layer} ${own} stroke-signal`}
      >
        {boxes.map(({ d }) => (
          <path
            key={d}
            data-pl="box"
            d={d}
            strokeWidth={1.2}
            pathLength={1}
            strokeDasharray="1 1"
            strokeDashoffset={detected ? 0 : 1}
          />
        ))}
      </svg>

      <div className={`${layer} ${own}`}>
        {site.pipeline.detections.map(({ label, confidence }, i) => (
          <span
            key={label}
            data-pl="chip"
            className="absolute -translate-y-full bg-signal px-1 font-display text-caption whitespace-nowrap text-paper tabular-nums"
            style={{
              left: `${boxes[i].x / 3.2}%`,
              top: `${boxes[i].y / 2}%`,
              opacity: detected ? 1 : 0,
            }}
          >
            <span className="max-md:hidden">{label} </span>
            {confidence.toFixed(2)}
          </span>
        ))}
      </div>
    </div>
  );
}
