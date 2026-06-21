import type { SVGProps } from "react";

/**
 * Fever LTD "F" mark — the single Huben "F" glyph.
 * Outlined from the brand asset (feverltd_asset_F_LOGO_FINAL.svg) and tightly
 * framed to the glyph, with `fill="currentColor"` so it inherits text color.
 *
 * Aspect ratio ~1.23:1 (w:h). Size it with width or height.
 */
export function FeverF({
  title = "F",
  ...props
}: SVGProps<SVGSVGElement> & { title?: string }) {
  return (
    <svg
      viewBox="23.847 178.836 1025.403 834.631"
      role="img"
      aria-label={title}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>{title}</title>
      <path d="M23.847 1013.467L441.162 1013.467L441.162 721.346L1049.250 721.346L1049.250 500.765L441.162 500.765L441.162 405.379L1049.250 405.379L1049.250 178.836L23.847 178.836" />
    </svg>
  );
}

export default FeverF;
