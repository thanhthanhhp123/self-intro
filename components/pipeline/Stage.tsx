import Device from "./Device";
import Frame from "./Frame";
import Metrics from "./Metrics";
import { reached, type Step } from "./state";

type Props = {
  // Unique per stage on the page.
  id: string;
  // Omit for the animated stage. Set it to freeze the stage at the end of a step.
  step?: Step;
  className?: string;
};

// The pipeline diagram: the frame area (frame, with the device drawn over it)
// above the readouts. The step text beside it says the same thing in words,
// so the diagram is hidden from screen readers.
export default function Stage({ id, step, className = "" }: Props) {
  return (
    <div aria-hidden="true" className={className}>
      <div className="relative aspect-[16/10]">
        <Frame id={id} step={step} />
        {(step === undefined || reached(step, 4)) && <Device step={step} />}
      </div>
      <Metrics step={step} />
    </div>
  );
}
