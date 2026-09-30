import Section from "@/components/ui/Section";
import { site } from "@/content/site";

// A grouped list, not cards: a hairline over each group, two columns from
// 768px. Nothing here moves.
export default function Capabilities() {
  return (
    <Section id="capabilities" title={site.headings.capabilities}>
      <div className="grid gap-x-8 gap-y-10 md:grid-cols-2 md:gap-y-12">
        {site.capabilities.map(({ group, items }) => (
          <div key={group} className="border-t border-grid pt-4">
            <h3 className="text-body md:text-h3">{group}</h3>
            <ul className="mt-3">
              {items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
