import { reached, type Step } from "./state";

// A small edge device on the frame's 320 x 200 grid. Its screen sits just
// outside the spot where the frame lands (see inDevice in state.ts): the
// frame at half size is 160 x 100, centered at (160, 92).
const lines = [
  "M76 28h168a10 10 0 0 1 10 10v120a10 10 0 0 1-10 10H76a10 10 0 0 1-10-10V38a10 10 0 0 1 10-10Z",
  "M79 41h162v102H79Z",
];

// Header pins along the bottom edge. Left out on phones to keep the stage simple.
const pins = Array.from({ length: 11 }, (_, i) => `M${100 + i * 12} 168v7`).join("");

type Props = { step?: Step };

export default function Device({ step }: Props) {
  const drawn = reached(step, 4);
  const detail = { opacity: drawn ? 1 : 0 };

  return (
    <svg
      data-pl="device"
      viewBox="0 0 320 200"
      fill="none"
      className="absolute inset-0 size-full overflow-visible stroke-ink"
      strokeWidth={1.2}
    >
      {lines.map((d) => (
        <path
          key={d}
          data-pl="device-line"
          d={d}
          pathLength={1}
          strokeDasharray="1 1"
          strokeDashoffset={drawn ? 0 : 1}
        />
      ))}
      <g data-pl="device-detail" style={detail}>
        <circle cx="160" cy="34.5" r="3" />
        <circle cx="238" cy="156" r="2" className="fill-signal stroke-none" />
        <path d={pins} className="max-md:hidden" />
      </g>
    </svg>
  );
}
