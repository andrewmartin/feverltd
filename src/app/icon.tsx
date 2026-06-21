import { ImageResponse } from "next/og";
import { F_MARK, FEVER_RED } from "@/lib/brand-marks";

/**
 * Favicon — the Fever "F" mark in brand red on a light newsprint tile.
 * Generated so it matches the on-site `FeverF` outline exactly.
 */
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// "F" is wider than tall (~1.23:1); size to fit the tile with padding.
const MARK_W = 21;
const MARK_H = MARK_W * (F_MARK.height / F_MARK.width);

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f4f5f2",
          borderRadius: 6,
        }}
      >
        <svg
          width={MARK_W}
          height={MARK_H}
          viewBox={F_MARK.viewBox}
          fill={FEVER_RED}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d={F_MARK.path} />
        </svg>
      </div>
    ),
    size,
  );
}
