import { ImageResponse } from "next/og";
import { F_MARK, FEVER_RED } from "@/lib/brand-marks";

/**
 * Apple touch icon — the Fever "F" mark in brand red on a light newsprint tile.
 * Larger padding than the favicon since iOS renders it at home-screen size.
 */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const MARK_W = 108;
const MARK_H = MARK_W * (F_MARK.height / F_MARK.width);

export default function AppleIcon() {
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
