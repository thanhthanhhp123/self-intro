import { site } from "@/content/site";
import Stage from "./Stage";
import type { Step } from "./state";

// Reduced motion: no pin, no scrub. The four steps stack, each next to the
// stage frozen at the end of that step.
export default function StaticSteps() {
  return (
    <ol className="mt-10 flex flex-col gap-14 md:mt-14 lg:gap-20">
      {site.pipeline.steps.map((step, i) => (
        <li key={step.id} className="lg:grid lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-4">
            <h3 className="text-body md:text-h3">
              <span aria-hidden="true" className="mr-3 tabular-nums">
                {i + 1}
              </span>
              {step.title}
            </h3>
            <p className="mt-3 max-w-[65ch]">{step.body}</p>
          </div>
          <Stage
            id={`pipeline-${step.id}`}
            step={(i + 1) as Step}
            className="mt-6 lg:col-span-8 lg:mt-0"
          />
        </li>
      ))}
    </ol>
  );
}
