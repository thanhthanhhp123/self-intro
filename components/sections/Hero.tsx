import Link from "@/components/ui/Link";
import Viewfinder from "@/components/ui/Viewfinder";
import { site } from "@/content/site";

// One screen: masthead, framed headline, intro, two links. The only motion
// is the viewfinder drawing once on load.
export default function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="page-container flex min-h-svh flex-col"
    >
      <header className="flex flex-col gap-x-6 border-b border-grid py-4 font-display text-caption md:flex-row md:justify-between">
        <p className="font-semibold">{site.name}</p>
        <p className="text-muted">
          {site.role} · {site.focus}
        </p>
      </header>

      <div className="flex flex-1 flex-col justify-center py-8 md:py-20">
        <div className="relative px-4 py-6 md:px-8 md:py-10">
          <Viewfinder drawOnLoad />
          <h1 id="hero-title" className="text-display">
            {site.headline}
          </h1>
        </div>

        <div className="px-4 md:px-8">
          <p className="mt-6 max-w-[65ch] md:mt-8">{site.intro}</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
            <Link href="#contact" variant="button">
              {site.linkLabels.contact}
            </Link>
            {site.links.github && (
              <Link href={site.links.github}>{site.linkLabels.github}</Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
