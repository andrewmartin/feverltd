import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { WORDMARK, FEVER_RED } from "@/lib/brand-marks";

/**
 * Social share image — the "Pressroom" broadsheet look in the light scheme:
 * black FEVER LTD. wordmark centred on a newsprint canvas, framed by a hairline
 * rule with a red accent and a Huben-set tagline. Doubles as the Twitter card.
 */
export const alt = "Fever Ltd — independent record label";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CANVAS = "#e7e8e4";
const INK = "#15171a";
const RULE = "rgba(18, 20, 18, 0.86)";
const QUIET = "#646862";

// Wordmark is ~7.6:1 (w:h); pick a width and derive the height.
const MARK_W = 760;
const MARK_H = MARK_W * (WORDMARK.height / WORDMARK.width);

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
        {/* Broadsheet hairline frame */}
        <div
          style={{
            position: "absolute",
            inset: 28,
            border: `2px solid ${RULE}`,
          }}
        />

        {/* Kicker */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 44,
          }}
        >
          <div style={{ width: 40, height: 6, background: FEVER_RED }} />
          <div
            style={{
              fontFamily: "Huben",
              fontSize: 26,
              letterSpacing: 14,
              color: QUIET,
            }}
          >
            LOS ANGELES
          </div>
        </div>

        {/* Wordmark */}
        <svg
          width={MARK_W}
          height={MARK_H}
          viewBox={WORDMARK.viewBox}
          fill={INK}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d={WORDMARK.path} />
        </svg>

        {/* Red rule + tagline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: 48,
          }}
        >
          <div style={{ width: 120, height: 4, background: FEVER_RED }} />
          <div
            style={{
              fontFamily: "Huben",
              fontSize: 32,
              letterSpacing: 10,
              color: INK,
              marginTop: 26,
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
