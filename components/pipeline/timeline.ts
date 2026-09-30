import { site } from "@/content/site";
import { gsap } from "@/lib/gsap";
import { inDevice } from "./state";

type Options = {
  // 1024px and up: two columns, the whole section pins.
  wide: boolean;
  // Below 768px: shorter pin distance.
  narrow: boolean;
};

// One scrubbed timeline, four labeled steps of one unit each. Targets are
// found by their data-pl attribute. Only transform, opacity, and
// stroke-dashoffset animate, plus the latency figure's text.
// Returns a cleanup for the one thing reverting does not undo (that text).
export function buildPipeline(section: HTMLElement, { wide, narrow }: Options) {
  const q = gsap.utils.selector(section);
  const { modelSize, latency } = site.pipeline;

  const tl = gsap.timeline({
    defaults: { ease: "power1.inOut" },
    scrollTrigger: {
      // Below 1024px the heading scrolls away first, so the steps and the
      // stage get the whole screen while pinned.
      trigger: wide ? section : q("[data-pl=pin-start]")[0],
      pin: section,
      start: "top top",
      end: narrow ? "+=250%" : "+=400%",
      scrub: 0.6,
      anticipatePin: 1,
    },
  });

  tl.addLabel("capture", 0)
    .addLabel("detect", 1)
    .addLabel("compress", 2)
    .addLabel("deploy", 3);

  // Left column: the bar tracks the whole timeline; the text swaps at each label.
  const axis = wide ? "scaleY" : "scaleX";
  tl.fromTo(
    q("[data-pl=progress]"),
    { [axis]: 0 },
    { [axis]: 1, duration: 4, ease: "none" },
    0,
  );
  const bodies = q("[data-pl=step-body]");
  const marks = q("[data-pl=index-active]");
  for (let i = 1; i < bodies.length; i++) {
    tl.to([bodies[i - 1], marks[i - 1]], { opacity: 0, duration: 0.08 }, i - 0.08);
    tl.to([bodies[i], marks[i]], { opacity: 1, duration: 0.08 }, i);
  }

  // 1 Capture: the scene exposes through the grain.
  tl.to(q("[data-pl=objects]"), { opacity: 1, duration: 0.6 }, "capture+=0.1");

  // 2 Detect: boxes draw in one after another, then their labels appear.
  tl.to(
    q("[data-pl=box]"),
    { strokeDashoffset: 0, duration: 0.4, stagger: 0.1 },
    "detect+=0.1",
  );
  tl.to(q("[data-pl=chip]"), { opacity: 1, duration: 0.12, stagger: 0.1 }, "detect+=0.45");

  // 3 Compress: the boxes stay put; only the size readout changes.
  tl.to(q("[data-pl=size-row]"), { opacity: 1, duration: 0.12 }, "compress+=0.05");
  tl.to(
    q("[data-pl=size-fill]"),
    { scaleX: modelSize.after.value / modelSize.before.value, duration: 0.5 },
    "compress+=0.2",
  );
  tl.to(q("[data-pl=size-before]"), { opacity: 0, duration: 0.08 }, "compress+=0.45");
  tl.to(q("[data-pl=size-after]"), { opacity: 1, duration: 0.08 }, "compress+=0.53");

  // 4 Deploy: the device draws in, the frame moves into its screen, and the
  // latency bar drops from heat to signal while the figure counts down.
  tl.to(q("[data-pl=device-line]"), { strokeDashoffset: 0, duration: 0.35 }, "deploy+=0.05");
  tl.to(q("[data-pl=frame]"), { ...inDevice, duration: 0.35 }, "deploy+=0.1");
  tl.to(q("[data-pl=device-detail]"), { opacity: 1, duration: 0.1 }, "deploy+=0.35");
  tl.to(q("[data-pl=latency-row]"), { opacity: 1, duration: 0.1 }, "deploy+=0.35");

  const drop = { duration: 0.4 };
  const value = q("[data-pl=latency-value]")[0];
  const counter = { ms: latency.before };
  tl.to(
    q("[data-pl=latency-fill]"),
    { scaleX: latency.after / latency.before, ...drop },
    "deploy+=0.5",
  );
  tl.to(q("[data-pl=latency-heat]"), { opacity: 0, ...drop }, "deploy+=0.5");
  tl.to(q("[data-pl=latency-signal]"), { opacity: 1, ...drop }, "deploy+=0.5");
  tl.to(
    counter,
    {
      ms: latency.after,
      ...drop,
      onUpdate: () => {
        value.textContent = String(Math.round(counter.ms));
      },
    },
    "deploy+=0.5",
  );

  // Hold the final state for the rest of the step.
  tl.set({}, {}, 4);

  return () => {
    value.textContent = String(latency.before);
  };
}
