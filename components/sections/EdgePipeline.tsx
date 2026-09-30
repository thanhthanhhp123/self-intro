import PinnedSection from "@/components/pipeline/PinnedSection";
import Stage from "@/components/pipeline/Stage";
import StaticSteps from "@/components/pipeline/StaticSteps";
import StepIndex from "@/components/pipeline/StepIndex";
import Viewfinder from "@/components/ui/Viewfinder";
import { site } from "@/content/site";

// The centerpiece: scrolling walks one frame from capture to a small device.
// Both versions are in the HTML. CSS shows the pinned one, or the stacked one
// with reduced motion, so nothing flashes or mismatches on hydration.
export default function EdgePipeline() {
  const { steps } = site.pipeline;

  return (
    <PinnedSection labelledBy="pipeline-title" className="overflow-x-clip">
      <div className="page-container">
        <div className="grid border-t border-grid py-16 lg:min-h-svh lg:grid-cols-12 lg:content-center lg:gap-x-8 lg:py-12">
          <div className="lg:col-span-4">
            <h2 id="pipeline-title" className="text-h2">
              {site.headings.pipeline}
            </h2>

            <div data-pl="pin-start" className="pt-6 motion-reduce:hidden lg:pt-10">
              <StepIndex steps={steps} />
              {/* All four texts share one cell; the timeline crossfades them. */}
              <ol className="mt-5 grid lg:mt-8">
                {steps.map((step, i) => (
                  <li
                    key={step.id}
                    data-pl="step-body"
                    className="col-start-1 row-start-1"
                    style={{ opacity: i === 0 ? 1 : 0 }}
                  >
                    <h3 className="sr-only">{step.title}</h3>
                    <p className="max-w-[65ch]">{step.body}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="mt-6 motion-reduce:hidden md:mt-10 lg:col-span-8 lg:mt-0">
            {/* Width follows the screen height, so the pinned stage always fits. */}
            <div className="relative max-w-[calc((100svh-22rem)*1.6)] md:max-w-[calc((100svh-26rem)*1.6+4rem)] md:p-8 lg:max-w-[calc((100svh-17rem)*1.6+4rem)]">
              <div className="max-md:hidden">
                <Viewfinder />
              </div>
              <Stage id="pipeline" />
            </div>
          </div>

          <div className="motion-safe:hidden lg:col-span-12">
            <StaticSteps />
          </div>
        </div>
      </div>
    </PinnedSection>
  );
}
