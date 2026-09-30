import type { ReactNode } from "react";

type Props = {
  id: string;
  title: string;
  children: ReactNode;
};

// Frame for the text sections after the pipeline: a hairline on top, the
// heading in the left margin column (4/12), the content on the right (8/12).
// Below 1024px the heading sits above the content.
export default function Section({ id, title, children }: Props) {
  const titleId = `${id}-title`;

  return (
    <section id={id} aria-labelledby={titleId} className="page-container">
      <div className="border-t border-grid py-16 md:py-24 lg:grid lg:grid-cols-12 lg:gap-x-8">
        <h2 id={titleId} className="text-h2 lg:col-span-4">
          {title}
        </h2>
        <div className="mt-10 md:mt-12 lg:col-span-8 lg:mt-0">{children}</div>
      </div>
    </section>
  );
}
