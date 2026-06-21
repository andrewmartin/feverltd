import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { WORDMARK, FEVER_RED } from "@/lib/brand-marks";

/**
 * Social share image — the "Pressroom" broadsheet look in the light scheme:
 * an oversized black FEVER LTD. wordmark centred on a newsprint canvas, framed
 * by a hairline rule, with a Huben-set tagline below a red rule. Doubles as the
 * Twitter card.
 */
export const alt = "Fever Ltd — independent record label";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CANVAS = "#e7e8e4";
const INK = "#15171a";
const RULE = "rgba(18, 20, 18, 0.86)";

// Render the wordmark as a rasterized <img> data-URI (resvg) rather than an
// inline <svg>: satori's path renderer leaves a stray speck below the glyphs.
// Use the tight glyph bounds so there's no empty padding around the mark.
const MARK_VIEWBOX = "2.575 19.311 1061.03 90.139";
const MARK_RATIO = 90.139 / 1061.03;
const MARK_W = 940;
const MARK_H = MARK_W * MARK_RATIO;

const WORDMARK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${MARK_VIEWBOX}" fill="${INK}"><path d="${WORDMARK.path}"/></svg>`;
const WORDMARK_SRC = `data:image/svg+xml;base64,${Buffer.from(WORDMARK_SVG).toString("base64")}`;

export default async function OpengraphImage() {
  const huben = await readFile(
    join(process.cwd(), "public/fonts/Huben-Regular.otf"),
  );

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: CANVAS,
          padding: 56,
        }}
      >
        {/* Broadsheet hairline frame (satori doesn't parse the `inset`
            shorthand — set each side explicitly or it collapses to a speck) */}
        <div
          style={{
            position: "absolute",
            top: 28,
            right: 28,
            bottom: 28,
            left: 28,
            border: `2px solid ${RULE}`,
          }}
        />

        {/* Wordmark */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={WORDMARK_SRC} width={MARK_W} height={MARK_H} alt="Fever Ltd" />

        {/* Red rule + tagline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: 56,
          }}
        >
          <div style={{ width: 120, height: 4, background: FEVER_RED }} />
          <div
            style={{
              fontFamily: "Huben",
              fontSize: 36,
              letterSpacing: 12,
              color: INK,
              marginTop: 28,
            }}
          >
            NOISE AND CULTURE
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Huben", data: huben, style: "normal", weight: 400 }],
    },
  );
}
