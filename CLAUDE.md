# Portfolio: AI Engineer (Edge AI / Computer Vision)

Single-page scrollytelling portfolio. Positioning: an AI Engineer who can take on a wide range of AI work, sharpest in Edge AI and Computer Vision. Content is generic on purpose: no named client projects, no confidential details.

Audience: recruiters, engineering managers, and freelance clients who skim on a laptop or a phone.
Primary job of the page: in under 60 seconds, make the visitor understand what this person does and get them to the contact section.

## Commands

```bash
npm run dev          # http://localhost:3000
npm run build        # must pass before any task is reported done
npm run lint
npx tsc --noEmit     # typecheck
```

## Stack (do not add dependencies without asking)

- Next.js (App Router) + TypeScript (strict) + Tailwind CSS
- GSAP + ScrollTrigger + `@gsap/react` (`useGSAP` hook) for all scroll animation
- Lenis for smooth scroll, wired to ScrollTrigger (see Motion)
- Fonts via `next/font/google`. No other UI libraries, no animation libraries besides the above.
- Deploy target: Vercel (static export is fine; no server features needed)

Install:
```bash
npm i gsap @gsap/react lenis
```

## File structure

```
app/
  layout.tsx            # fonts, metadata, <SmoothScroll/> provider
  page.tsx              # composes sections in order
  globals.css           # CSS variables (tokens), base styles
components/
  SmoothScroll.tsx      # Lenis + ScrollTrigger bridge, registers GSAP plugins once
  sections/
    Hero.tsx
    EdgePipeline.tsx    # the pinned centerpiece
    Capabilities.tsx
    Approach.tsx
    Contact.tsx
  ui/                   # small shared pieces (Link, Button, Tag)
content/
  site.ts               # ALL copy and data lives here
lib/
  gsap.ts               # registerPlugin(ScrollTrigger) once, exports gsap
```

Rules:
- One section = one component in `components/sections`. No section logic in `page.tsx`.
- Copy, links, and lists come from `content/site.ts`. Never hardcode text inside components.
- Keep components under ~150 lines. Split when they grow.

## Content rules

- Language: English.
- Voice: plain, specific, first person. Short sentences. Say what was done and what it enables, not adjectives about quality.
- Do NOT invent achievements, metrics, employers, or tools. Anything in `site.ts` marked `// TODO(owner)` is a placeholder the owner will edit. Leave the marker in place.
- Numbers shown in the pipeline animation are illustrative. Label them "illustrative" in the UI. Never present them as real benchmarks.
- No stock filler ("passionate", "cutting-edge", "leveraging", "seamless").

Placeholders to create in `content/site.ts`:
```ts
export const site = {
  name: "YOUR NAME",                      // TODO(owner)
  role: "AI Engineer",
  focus: "Edge AI and Computer Vision",
  headline: "I build vision models that run on the device, not in the cloud.",
  intro: "AI Engineer working across the stack, from data and training to optimization and deployment. Strongest where models have to be fast, small, and reliable on real hardware.",
  links: { email: "", github: "", linkedin: "", upwork: "" },   // TODO(owner)
  capabilities: [ /* see Capabilities section */ ],
};
```

## Design system

Direction: a lab notebook crossed with a camera viewfinder. Calm, precise, light-mode. The subject's own vocabulary (frames, boxes, confidence, latency) is the visual language. The memorable moment is the pinned pipeline section. Everything else stays quiet.

Before writing any UI code, write a short design plan (tokens, layout concept, ASCII wireframe per section), review it against this file, and wait for approval.

Tokens (define as CSS variables in `globals.css`, expose to Tailwind):

| Token | Value | Use |
|---|---|---|
| `--paper` | `#ECEEF0` | page background |
| `--surface` | `#F7F8F9` | raised panels, device frames |
| `--ink` | `#14181F` | text |
| `--muted` | `#5B6472` | secondary text |
| `--grid` | `#C9CED6` | hairlines, chart grid |
| `--signal` | `#1F4BFF` | detection boxes, links, focus ring |
| `--heat` | `#FF5A1F` | used ONLY in the pipeline section for latency/heat |

Type:
- Headings and numbers: Bricolage Grotesque (variable). Use `font-variant-numeric: tabular-nums` for figures.
- Body: Source Serif 4, line-height 1.65, max line length ~65ch.
- Type scale: 14 / 16 / 20 / 28 / 44 / 72 (fluid via `clamp()` for the top two).
- Left-aligned text everywhere except the final Contact line.

Avoid (these read as template output):
- Tracked-out ALL-CAPS eyebrow labels above headings
- Numbered markers (01, 02, 03) unless the content is truly a sequence (the pipeline is; the capabilities list is not)
- Identical rounded cards with the same soft shadow repeated down the page
- Gradient washes as decoration
- Fade-and-slide-up on every section, hover animations on everything
- Accenting a single word in a headline with color or italics
- Arrows appended to every link ("Contact →")

Structure carries information: use borders and dividers only where they group or separate real content.

## Page structure

1. **Hero** (one screen)
   - Headline + one-paragraph intro + two links (Contact, GitHub). Type-led, left-aligned.
   - One load sequence only: a thin viewfinder bracket draws around the headline once. Nothing else moves on load.
2. **EdgePipeline** (pinned, the centerpiece; spec below)
3. **Capabilities**: grouped list, not cards. Groups: Vision (detection, segmentation, tracking, anomaly detection), Model optimization (quantization, pruning, export/runtime conversion), Deployment (edge devices, embedded, real-time pipelines), Beyond vision (LLM/RAG apps, data pipelines, MLOps basics). Items are placeholders: `// TODO(owner): keep only what is genuinely done`.
4. **Approach**: 3 short paragraphs on how work gets done (measure first, ship the smallest model that meets the spec, test on the target hardware).
5. **Contact**: one sentence, email, GitHub, LinkedIn, Upwork. Centered.

## EdgePipeline section (the pinned centerpiece)

Concept: scroll walks one camera frame from capture to running on a small device. Built with SVG and CSS only. No video, no raster images over 100 KB.

Implementation:
- One `<section>` pinned with ScrollTrigger: `pin: true`, `scrub: 0.6`, `end: "+=400%"` (desktop).
- One GSAP timeline with four labeled steps, each roughly equal scroll length. The left column swaps step text; the right column is a single SVG stage whose layers change.
- Only animate `transform`, `opacity`, `stroke-dashoffset`. No layout properties.

Steps (a real sequence, so numbering is allowed here):
1. **Capture**: a noisy grayscale frame with visible sensor grain on the stage.
2. **Detect**: 3 bounding boxes draw in (stroke-dashoffset) with confidence labels (e.g. 0.94). Color `--signal`.
3. **Compress**: a model-size bar shrinks from FP32 to INT8 (illustrative numbers, labeled). The boxes stay stable to show accuracy is preserved.
4. **Deploy**: the frame moves into a small device outline. A latency readout counts down (illustrative, labeled) and the bar turns `--heat` to `--signal` as it drops.

Mobile (< 768px) and reduced motion:
- Use `gsap.matchMedia()`. On mobile, pin with a shorter distance (`+=250%`) and simplify the stage. Never let the pinned section cause horizontal scroll.
- With `prefers-reduced-motion: reduce`, do not pin or scrub. Render the four steps stacked, each with its final-state graphic.

## Motion rules

- Register plugins once in `lib/gsap.ts`. Import gsap from there.
- Lenis bridge in `SmoothScroll.tsx`:
  ```ts
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  ```
  Destroy Lenis and remove the ticker callback on unmount.
- Always create animations inside `useGSAP({ scope })` so they clean up automatically. No bare `ScrollTrigger.create` in effects without cleanup.
- Ambient motion (not caused by user action) is allowed only in Hero (load) and EdgePipeline (scrub). Other sections may have subtle state changes on user actions (hover, focus, expand) only.
- Anything that scrubs must also make sense as a static image.

## Definition of done (run before saying a task is finished)

1. `npm run lint`, `npx tsc --noEmit`, and `npm run build` all pass.
2. Start the dev server and check the browser console: zero errors and zero warnings (including hydration warnings).
3. Check at 375px, 768px, and 1440px widths: no horizontal scroll, no overlapping text, tap targets at least 44px.
4. Keyboard: every link and button is reachable with visible focus (`--signal` outline, 2px offset).
5. Contrast: body text meets WCAG AA against its background.
6. `prefers-reduced-motion` path works (toggle it in devtools and confirm).
7. Lighthouse (mobile): Performance 90+, Accessibility 95+, Best Practices 95+, SEO 95+. Report the actual numbers.

If a check cannot be run, say so explicitly. Never claim it passed.

## Workflow

- Work one task at a time, in this order: (1) layout, tokens, fonts, SmoothScroll, `site.ts` → (2) Hero → (3) EdgePipeline → (4) Capabilities, Approach, Contact → (5) polish, metadata (title, description, OG image), Lighthouse, deploy.
- For anything non-trivial: plan first, wait for approval, then code.
- After each task: short summary of what changed, list of files touched, and anything left undone. Then stop and wait.
- Do not refactor or restyle areas outside the current task.
- Ask before adding a dependency, changing the stack, or changing tokens.
- Commit messages: imperative, one line (e.g. `Add EdgePipeline pinned timeline`). One commit per finished task.
- When a UI screenshot is provided, treat it as the source of truth for what to fix.