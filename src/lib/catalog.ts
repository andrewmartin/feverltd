import { prisma } from "@/lib/db";
import {
  ReleaseStatus,
  PostStatus,
  type Artist,
  type NewsPost,
  type Release,
  type Track,
} from "@prisma/client";

/**
 * Public read helpers for the Fever Ltd catalog.
 * Everything here is scoped to PUBLISHED releases only.
 */

export type ReleaseWithArtists = Release & { artists: Artist[] };

export type ReleaseWithDetails = Release & {
  artists: Artist[];
  tracks: Track[];
};

export type ArtistWithReleases = Artist & {
  releases: ReleaseWithArtists[];
};

const artistsInclude = { orderBy: { name: "asc" } } as const;

/** A handful of the most recent published releases for the landing page. */
export async function getFeaturedReleases(
  limit = 6,
): Promise<ReleaseWithArtists[]> {
  return prisma.release.findMany({
    where: { status: ReleaseStatus.PUBLISHED },
    include: { artists: artistsInclude },
    orderBy: [{ releaseDate: "desc" }, { createdAt: "desc" }],
    take: limit,
  });
}

/** The full published catalog, newest first. */
export async function getAllReleases(): Promise<ReleaseWithArtists[]> {
  return prisma.release.findMany({
    where: { status: ReleaseStatus.PUBLISHED },
    include: { artists: artistsInclude },
    orderBy: [{ releaseDate: "desc" }, { createdAt: "desc" }],
  });
}

/** A single published release with artists + ordered tracklist, or null. */
export async function getReleaseBySlug(
  slug: string,
): Promise<ReleaseWithDetails | null> {
  return prisma.release.findFirst({
    where: { slug, status: ReleaseStatus.PUBLISHED },
    include: {
      artists: artistsInclude,
      tracks: { orderBy: { position: "asc" } },
    },
  });
}

/**
 * Every artist, alphabetical. Artists without a published release still appear
 * on the public site — their detail page simply shows an empty catalog state.
 */
export async function getAllArtists(): Promise<Artist[]> {
  return prisma.artist.findMany({
    orderBy: { name: "asc" },
  });
}

/** The most recent published news posts, newest first. */
export async function getLatestNews(limit = 3): Promise<NewsPost[]> {
  return prisma.newsPost.findMany({
    where: { status: PostStatus.PUBLISHED },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    take: limit,
  });
}

/** The full published news archive, newest first. */
export async function getAllNews(): Promise<NewsPost[]> {
  return prisma.newsPost.findMany({
    where: { status: PostStatus.PUBLISHED },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
  });
}

/** A single published news post by slug, or null. */
export async function getNewsBySlug(slug: string): Promise<NewsPost | null> {
  return prisma.newsPost.findFirst({
    where: { slug, status: PostStatus.PUBLISHED },
  });
}

/** A single artist plus their published releases, or null. */
export async function getArtistBySlug(
  slug: string,
): Promise<ArtistWithReleases | null> {
  return prisma.artist.findUnique({
    where: { slug },
    include: {
      releases: {
        where: { status: ReleaseStatus.PUBLISHED },
        include: { artists: artistsInclude },
        orderBy: [{ releaseDate: "desc" }, { createdAt: "desc" }],
      },
    },
  });
}
