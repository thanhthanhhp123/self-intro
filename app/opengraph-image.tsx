import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/content/site";
import { tokens } from "@/lib/tokens";

export const alt = `${site.name}, ${site.role}. ${site.headline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

// The link preview repeats the Hero: masthead, then the framed headline.
// It is rendered at build time from site.ts. The renderer reads only static
// TTF files, so the fonts come from assets/fonts, not next/font.
const font = (file: string) =>
  readFile(join(process.cwd(), "assets/fonts", file));

const arm = `3px solid ${tokens.ink}`;
const corners = [
  { top: 0, left: 0, borderTop: arm, borderLeft: arm },
  { top: 0, right: 0, borderTop: arm, borderRight: arm },
  { bottom: 0, right: 0, borderBottom: arm, borderRight: arm },
  { bottom: 0, left: 0, borderBottom: arm, borderLeft: arm },
];

export default async function Image() {
  const [semibold, regular] = await Promise.all([
    font("BricolageGrotesque-SemiBold.ttf"),
    font("BricolageGrotesque-Regular.ttf"),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          padding: "0 72px",
          background: tokens.paper,
          color: tokens.ink,
          fontFamily: "Bricolage Grotesque",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "44px 0 24px",
            borderBottom: `2px solid ${tokens.grid}`,
            fontSize: 26,
          }}
        >
          <span style={{ fontWeight: 600 }}>{site.name}</span>
          <span style={{ color: tokens.muted }}>
            {site.role} · {site.focus}
          </span>
        </div>

        <div style={{ display: "flex", flex: 1, alignItems: "center" }}>
          <div style={{ display: "flex", position: "relative", padding: "44px 52px" }}>
            {corners.map((corner, i) => (
              <div
                key={i}
                style={{ position: "absolute", width: 40, height: 40, ...corner }}
              />
            ))}
            <div
              style={{
                fontSize: 70,
                fontWeight: 600,
                lineHeight: 1.05,
                textWrap: "balance",
              }}
            >
              {site.headline}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Bricolage Grotesque", data: semibold, weight: 600 },
        { name: "Bricolage Grotesque", data: regular, weight: 400 },
      ],
    },
  );
}
