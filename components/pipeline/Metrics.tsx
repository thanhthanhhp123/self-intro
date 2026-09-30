import { site } from "@/content/site";
import { reached, type Step } from "./state";

// Readouts under the frame: model size (step 3) and latency (step 4), then
// the "illustrative" note. Each value sits in a fixed-width column, so the
// swaps and the countdown never move anything else.
const row =
  "grid grid-cols-[5.5rem_1fr_6.5rem] items-center gap-x-3 md:grid-cols-[6.5rem_1fr_7.5rem]";
const hidden = { opacity: 0 };

type Props = { step?: Step };

export default function Metrics({ step }: Props) {
  const { modelSize: size, latency, note } = site.pipeline;
  const animated = step === undefined;
  const compressed = reached(step, 3);
  const deployed = reached(step, 4);

  // A static step 1 has no numbers on it, so it needs no readouts or note.
  if (step === 1) return null;

  return (
    <div className="mt-4 font-display text-caption">
      {(animated || compressed) && (
        <div data-pl="size-row" className={row} style={animated ? hidden : undefined}>
          <span className="text-muted">{size.label}</span>
          <span className="relative h-1.5 bg-grid">
            <span
              data-pl="size-fill"
              className="absolute inset-0 origin-left bg-ink"
              style={
                compressed
                  ? { transform: `scaleX(${size.after.value / size.before.value})` }
                  : undefined
              }
            />
          </span>
          <span className="grid text-right tabular-nums">
            <span
              data-pl="size-before"
              className="col-start-1 row-start-1"
              style={compressed ? hidden : undefined}
            >
              {size.before.format} · {size.before.value} {size.unit}
            </span>
            <span
              data-pl="size-after"
              className="col-start-1 row-start-1"
              style={compressed ? undefined : hidden}
            >
              {size.after.format} · {size.after.value} {size.unit}
            </span>
          </span>
        </div>
      )}

      {(animated || deployed) && (
        <div
          data-pl="latency-row"
          className={`${row} mt-2`}
          style={animated ? hidden : undefined}
        >
          <span className="text-muted">{latency.label}</span>
          <span className="relative h-1.5 bg-grid">
            <span
              data-pl="latency-fill"
              className="absolute inset-0 origin-left"
              style={
                deployed
                  ? { transform: `scaleX(${latency.after / latency.before})` }
                  : undefined
              }
            >
              <span
                data-pl="latency-heat"
                className="absolute inset-0 bg-heat"
                style={deployed ? hidden : undefined}
              />
              <span
                data-pl="latency-signal"
                className="absolute inset-0 bg-signal"
                style={deployed ? undefined : hidden}
              />
            </span>
          </span>
          <span className="text-right tabular-nums">
            <span data-pl="latency-value">
              {deployed ? latency.after : latency.before}
            </span>{" "}
            {latency.unit}
          </span>
        </div>
      )}

      <p className="mt-3 text-muted">{note}</p>
    </div>
  );
}
