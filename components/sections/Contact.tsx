import Link from "@/components/ui/Link";
import { site } from "@/content/site";

const profiles = ["github", "linkedin", "upwork"] as const;

// The only centered block on the page. The Hero's Contact button lands here.
// Links still empty in site.ts are left out.
export default function Contact() {
  const { email } = site.links;
  const filled = profiles.filter((key) => site.links[key]);

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="page-container"
    >
      <div className="flex flex-col items-center border-t border-grid py-24 text-center md:py-32">
        <h2 id="contact-title" className="text-body md:text-h3">
          {site.contactLine}
        </h2>
        {email && (
          <Link
            href={`mailto:${email}`}
            size="large"
            className="mt-6 wrap-anywhere md:mt-8"
          >
            {email}
          </Link>
        )}
        {filled.length > 0 && (
          <ul className="mt-6 flex flex-wrap justify-center gap-x-8 gap-y-2">
            {filled.map((key) => (
              <li key={key}>
                <Link href={site.links[key]}>{site.linkLabels[key]}</Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
