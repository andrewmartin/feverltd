import { prisma } from "@/lib/db";
import { ReleaseStatus, type Artist, type Release, type Track } from "@prisma/client";

/**
 * Public read helpers for the Fever Ltd catalog.
 * Everything here is scoped to PUBLISHED releases only.
 */

export type ReleaseWithArtist = Release & { artist: Artist };

export type ReleaseWithDetails = Release & {
  artist: Artist;
  tracks: Track[];
};

export type ArtistWithReleases = Artist & {
  releases: ReleaseWithArtist[];
};

/** A handful of the most recent published releases for the landing page. */
export async function getFeaturedReleases(
  limit = 6,
): Promise<ReleaseWithArtist[]> {
  return prisma.release.findMany({
    where: { status: ReleaseStatus.PUBLISHED },
    include: { artist: true },
    orderBy: [{ releaseDate: "desc" }, { createdAt: "desc" }],
    take: limit,
  });
}

/** The full published catalog, newest first. */
export async function getAllReleases(): Promise<ReleaseWithArtist[]> {
  return prisma.release.findMany({
    where: { status: ReleaseStatus.PUBLISHED },
    include: { artist: true },
    orderBy: [{ releaseDate: "desc" }, { createdAt: "desc" }],
  });
}

/** A single published release with artist + ordered tracklist, or null. */
export async function getReleaseBySlug(
  slug: string,
): Promise<ReleaseWithDetails | null> {
  return prisma.release.findFirst({
    where: { slug, status: ReleaseStatus.PUBLISHED },
    include: {
      artist: true,
      tracks: { orderBy: { position: "asc" } },
    },
  });
}

/**
 * Every artist that has at least one published release, alphabetical.
 * Artists with only drafts are hidden from the public site.
 */
export async function getAllArtists(): Promise<Artist[]> {
  return prisma.artist.findMany({
    where: {
      releases: { some: { status: ReleaseStatus.PUBLISHED } },
    },
    orderBy: { name: "asc" },
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
        include: { artist: true },
        orderBy: [{ releaseDate: "desc" }, { createdAt: "desc" }],
      },
    },
  });
}
