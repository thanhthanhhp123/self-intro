// A stage is either animated or static. Animated (no step) renders the start
// of Capture and GSAP drives it from there. Static renders the end state of
// one step, for the reduced-motion list.
export type Step = 1 | 2 | 3 | 4;

export const reached = (step: Step | undefined, n: Step) =>
  step !== undefined && step >= n;

// Where the frame lands in step 4: half size, 8 units (4%) above center.
// Device.tsx draws the screen around this spot.
export const inDevice = { scale: 0.5, yPercent: -4 };
export const inDeviceTransform = `translateY(${inDevice.yPercent}%) scale(${inDevice.scale})`;
