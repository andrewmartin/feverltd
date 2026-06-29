import imageCompression from "browser-image-compression";

/**
 * Client-side image optimization, run in the admin before uploading to Blob.
 *
 * Editors routinely pick huge, full-resolution PNG/JPEG exports that bloat
 * storage and slow the public site. We downscale to a sane max dimension and
 * re-encode to WebP in the browser, so only the optimized asset ever leaves the
 * page. Animated GIFs are passed through untouched (canvas encoding would drop
 * the animation), and we never return a file larger than the original.
 */

/** Longest edge we keep — ample for retina hero/cover imagery. */
const MAX_DIMENSION = 2400;
/** Re-encode target; the encoder gets close to this without going under quality. */
const TARGET_MB = 1;

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

/** Human-friendly size, KB under a megabyte, otherwise MB. */
export function formatBytes(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

function withExtension(name: string, ext: string): string {
  const base = name.replace(/\.[^./\\]+$/, "");
  return `${base}.${ext}`;
}

export type OptimizeResult = {
  /** The file to upload — optimized when it helped, otherwise the original. */
  file: File;
  /** True when we produced a smaller, re-encoded file. */
  optimized: boolean;
};

export async function optimizeImage(file: File): Promise<OptimizeResult> {
  // Preserve GIFs (potentially animated) — canvas re-encoding would flatten them.
  if (file.type === "image/gif") return { file, optimized: false };

  try {
    const compressed = await imageCompression(file, {
      maxSizeMB: TARGET_MB,
      maxWidthOrHeight: MAX_DIMENSION,
      useWebWorker: true,
      fileType: "image/webp",
      initialQuality: 0.82,
    });

    // Already well-optimized? Keep the original rather than risk a larger file.
    if (compressed.size >= file.size) return { file, optimized: false };

    const renamed = new File([compressed], withExtension(file.name, "webp"), {
      type: "image/webp",
    });
    return { file: renamed, optimized: true };
  } catch {
    // Any encoder/worker failure: fall back to the original, untouched file.
    return { file, optimized: false };
  }
}
