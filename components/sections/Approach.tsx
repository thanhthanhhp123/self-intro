import Section from "@/components/ui/Section";
import { site } from "@/content/site";

// Three short paragraphs in one reading column. Not a sequence, so no numbers.
export default function Approach() {
  return (
    <Section id="approach" title={site.headings.approach}>
      <div className="flex max-w-[65ch] flex-col gap-10 md:gap-12">
        {site.approach.map(({ title, body }) => (
          <div key={title}>
            <h3 className="text-body md:text-h3">{title}</h3>
            <p className="mt-3">{body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
