import { z } from "zod";
import { ReleaseStatus } from "@prisma/client";
import { prisma } from "@/lib/db";

/* ------------------------------------------------------------------ */
/* Validation schemas                                                  */
/* ------------------------------------------------------------------ */

/** Accepts an http(s) URL or an empty string (coerced to undefined). */
const optionalUrl = z
  .string()
  .trim()
  .url("Must be a valid URL")
  .or(z.literal(""))
  .transform((v) => (v === "" ? undefined : v))
  .optional();

/** Accepts a non-empty trimmed string or empty (coerced to undefined). */
const optionalText = z
  .string()
  .trim()
  .transform((v) => (v === "" ? undefined : v))
  .optional();

/** Slug is optional; when provided it must be lowercase kebab-case. */
const optionalSlug = z
  .string()
  .trim()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and dashes")
  .or(z.literal(""))
  .transform((v) => (v === "" ? undefined : v))
  .optional();

export const artistSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  slug: optionalSlug,
  bio: optionalText,
  imageUrl: optionalUrl,
  website: optionalUrl,
});

export type ArtistInput = z.input<typeof artistSchema>;
export type ArtistValues = z.output<typeof artistSchema>;

export const releaseSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(160),
  slug: optionalSlug,
  catalogNo: optionalText,
  description: optionalText,
  coverUrl: optionalUrl,
  releaseDate: z
    .string()
    .trim()
    .transform((v) => (v === "" ? undefined : v))
    .optional(),
  status: z.enum(ReleaseStatus),
  artistId: z.string().trim().min(1, "Artist is required"),
});

export type ReleaseInput = z.input<typeof releaseSchema>;
export type ReleaseValues = z.output<typeof releaseSchema>;

/** Shared result shape returned from server actions. */
export type ActionResult =
  | { ok: true }
  | { ok: false; error: string };

/* ------------------------------------------------------------------ */
/* Read helpers (used by admin server components)                      */
/* ------------------------------------------------------------------ */

export function listArtists() {
  return prisma.artist.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { releases: true } } },
  });
}

export function getArtist(id: string) {
  return prisma.artist.findUnique({ where: { id } });
}

export function listReleases() {
  return prisma.release.findMany({
    orderBy: [{ updatedAt: "desc" }],
    include: { artist: { select: { id: true, name: true } } },
  });
}

export function listArtistOptions() {
  return prisma.artist.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });
}

export function getReleaseWithTracks(id: string) {
  return prisma.release.findUnique({
    where: { id },
    include: { tracks: { orderBy: { position: "asc" } } },
  });
}

export async function getCmsStats() {
  const [artistCount, releaseCount, publishedCount, recentReleases] =
    await Promise.all([
      prisma.artist.count(),
      prisma.release.count(),
      prisma.release.count({ where: { status: ReleaseStatus.PUBLISHED } }),
      prisma.release.findMany({
        orderBy: { updatedAt: "desc" },
        take: 5,
        include: { artist: { select: { name: true } } },
      }),
    ]);

  return { artistCount, releaseCount, publishedCount, recentReleases };
}
