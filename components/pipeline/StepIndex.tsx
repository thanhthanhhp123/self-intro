type Props = { steps: { id: string; title: string }[] };

// Visual index for the pinned version: the current step turns ink and a
// signal bar fills with progress (a row with the bar below on narrow screens,
// a column with the bar on its left from 1024px). In the column each step
// takes exactly a quarter of the bar, so the fill reaches a label as its step
// begins. Screen readers get the same titles from the step list, so this is
// hidden from them.
export default function StepIndex({ steps }: Props) {
  return (
    <div
      aria-hidden="true"
      className="flex flex-col-reverse gap-3 lg:flex-row lg:gap-5"
    >
      <div className="relative h-0.5 bg-grid lg:h-auto lg:w-0.5">
        <div
          data-pl="progress"
          className="absolute inset-0 origin-left bg-signal [transform:scaleX(0)] lg:origin-top lg:[transform:scaleY(0)]"
        />
      </div>
      <ol className="flex flex-wrap justify-between gap-x-3 font-display text-caption lg:grid lg:text-body lg:leading-11">
        {steps.map((step, i) => {
          const label = (
            <>
              <span className="mr-1.5 tabular-nums lg:mr-3">{i + 1}</span>
              {step.title}
            </>
          );
          return (
            <li key={step.id} className="relative whitespace-nowrap">
              <span className="text-muted">{label}</span>
              {/* Ink copy on top; the timeline fades it in for the current step. */}
              <span
                data-pl="index-active"
                className="absolute inset-0"
                style={{ opacity: i === 0 ? 1 : 0 }}
              >
                {label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
