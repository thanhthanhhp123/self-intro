import Approach from "@/components/sections/Approach";
import Capabilities from "@/components/sections/Capabilities";
import Contact from "@/components/sections/Contact";
import EdgePipeline from "@/components/sections/EdgePipeline";
import Hero from "@/components/sections/Hero";

// Sections in page order. Each one lives in components/sections.
export default function Home() {
  return (
    <main>
      <Hero />
      <EdgePipeline />
      <Capabilities />
      <Approach />
      <Contact />
    </main>
  );
}
