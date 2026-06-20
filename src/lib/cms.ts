import { z } from "zod";
import { ReleaseStatus, PostStatus } from "@prisma/client";
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

/** Optional yyyy-MM-dd date string (coerced to undefined when blank). */
const optionalDate = z
  .string()
  .trim()
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
  releaseDate: optionalDate,
  status: z.enum(ReleaseStatus),
  // Many-to-many — at least one artist must be credited.
  artistIds: z.array(z.string().min(1)).min(1, "Select at least one artist"),
});

export type ReleaseInput = z.input<typeof releaseSchema>;
export type ReleaseValues = z.output<typeof releaseSchema>;

export const newsSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(180),
  slug: optionalSlug,
  excerpt: optionalText,
  body: optionalText,
  heroImage: optionalUrl,
  status: z.enum(PostStatus),
  publishedAt: optionalDate,
});

export type NewsInput = z.input<typeof newsSchema>;
export type NewsValues = z.output<typeof newsSchema>;

/** Shared result shape returned from server actions. */
export type ActionResult =
  | { ok: true }
  | { ok: false; error: string };

/* ------------------------------------------------------------------ */
/* Read helpers (used by admin route handlers / server components)     */
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
    include: {
      artists: { select: { id: true, name: true }, orderBy: { name: "asc" } },
    },
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
    include: {
      tracks: { orderBy: { position: "asc" } },
      artists: { select: { id: true, name: true }, orderBy: { name: "asc" } },
    },
  });
}

export function listNews() {
  return prisma.newsPost.findMany({
    orderBy: [{ updatedAt: "desc" }],
  });
}

export function getNewsPost(id: string) {
  return prisma.newsPost.findUnique({ where: { id } });
}

export async function getCmsStats() {
  const [artistCount, releaseCount, publishedCount, newsCount, recentReleases] =
    await Promise.all([
      prisma.artist.count(),
      prisma.release.count(),
      prisma.release.count({ where: { status: ReleaseStatus.PUBLISHED } }),
      prisma.newsPost.count(),
      prisma.release.findMany({
        orderBy: { updatedAt: "desc" },
        take: 5,
        include: {
          artists: { select: { name: true }, orderBy: { name: "asc" } },
        },
      }),
    ]);

  return { artistCount, releaseCount, publishedCount, newsCount, recentReleases };
}

/* ------------------------------------------------------------------ */
/* Serialized list types (what the /api/admin/* routes return)         */
/* ------------------------------------------------------------------ */

export type ArtistRow = Awaited<ReturnType<typeof listArtists>>[number];
export type ReleaseRow = Awaited<ReturnType<typeof listReleases>>[number];
export type NewsRow = Awaited<ReturnType<typeof listNews>>[number];
export type ArtistOption = Awaited<ReturnType<typeof listArtistOptions>>[number];
