import { del } from "@vercel/blob";

/** True when the URL points at our Vercel Blob store (vs. an external URL). */
export function isBlobUrl(url: string | null | undefined): url is string {
  if (!url) return false;
  try {
    return new URL(url).hostname.endsWith(".public.blob.vercel-storage.com");
  } catch {
    return false;
  }
}

/**
 * Delete a blob we own, ignoring failures. No-op for external / empty URLs so
 * callers can pass a previous image value without first checking its origin.
 */
export async function deleteBlobIfOwned(url: string | null | undefined) {
  if (!isBlobUrl(url)) return;
  try {
    await del(url);
  } catch {
    // Best-effort cleanup — a missing/already-deleted blob shouldn't fail the
    // surrounding save or delete.
  }
}
