// One-off: outline the Huben text logos into font-independent SVG paths.
// Reproduces the designer's exact tspan x-offsets + per-run letter-spacing.
import opentype from "opentype.js";
import { readFileSync } from "node:fs";

const buf = readFileSync("public/fonts/Huben-Regular.otf");
const font = opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));

function runPath(text, startX, baselineY, fontSize, letterSpacingEm = 0) {
  const ls = letterSpacingEm * fontSize;
  let x = startX;
  let d = "";
  for (const ch of text) {
    d += font.getPath(ch, x, baselineY, fontSize).toPathData(3) + " ";
    x += font.getAdvanceWidth(ch, fontSize) + ls;
  }
  return d.trim();
}

// --- Wordmark: viewBox 0 0 1066.18 140.35, baseline y=109.45, size 128.77 ---
const WM_SIZE = 128.77;
const WM_Y = 109.45;
const wordmarkRuns = [
  { t: "F", x: 0, ls: 0 },
  { t: "EV", x: 115.89, ls: -0.02 },
  { t: "ER ", x: 375.99, ls: 0 },
  { t: "L", x: 665.71, ls: -0.22 },
  { t: "T", x: 753.28, ls: 0 },
  { t: "D", x: 876.89, ls: -0.02 },
  { t: ".", x: 1015.96, ls: 0 },
];
const wordmark = wordmarkRuns
  .map((r) => runPath(r.t, r.x, WM_Y, WM_SIZE, r.ls))
  .join(" ");

// --- F mark: viewBox 0 0 1073.09 1299.63, baseline y=1013.4673, size 1192.33 ---
const fMark = runPath("F", 0, 1013.4673, 1192.33, 0);

console.log("=== WORDMARK ===");
console.log(wordmark);
console.log("=== FMARK ===");
console.log(fMark);
