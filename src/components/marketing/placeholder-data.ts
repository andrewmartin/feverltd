import { ReleaseStatus, type Artist } from "@prisma/client";
import type { ReleaseWithArtist } from "@/lib/catalog";

/**
 * Curated fallback content used when the database is empty or unreachable,
 * so the landing page always renders something tasteful instead of crashing.
 */

const now = new Date();

function makeArtist(name: string, slug: string): Artist {
  return {
    id: `placeholder-artist-${slug}`,
    name,
    slug,
    bio: null,
    imageUrl: null,
    website: null,
    createdAt: now,
    updatedAt: now,
  };
}

export const PLACEHOLDER_ARTISTS: Artist[] = [
  makeArtist("Static Bloom", "static-bloom"),
  makeArtist("Nightporter", "nightporter"),
  makeArtist("VHS Dreams", "vhs-dreams"),
  makeArtist("The Low Hum", "the-low-hum"),
];

function makeRelease(
  title: string,
  slug: string,
  catalogNo: string,
  artist: Artist,
  year: number,
): ReleaseWithArtist {
  return {
    id: `placeholder-release-${slug}`,
    title,
    slug,
    catalogNo,
    description: null,
    coverUrl: null,
    releaseDate: new Date(`${year}-01-01`),
    status: ReleaseStatus.PUBLISHED,
    artistId: artist.id,
    artist,
    createdAt: now,
    updatedAt: now,
  };
}

export const PLACEHOLDER_RELEASES: ReleaseWithArtist[] = [
  makeRelease("Half-Light", "half-light", "FVR001", PLACEHOLDER_ARTISTS[0], 2024),
  makeRelease("Radio Silence", "radio-silence", "FVR002", PLACEHOLDER_ARTISTS[1], 2024),
  makeRelease("Tape Hiss", "tape-hiss", "FVR003", PLACEHOLDER_ARTISTS[2], 2025),
  makeRelease("Undertow", "undertow", "FVR004", PLACEHOLDER_ARTISTS[3], 2025),
  makeRelease("Neon Fade", "neon-fade", "FVR005", PLACEHOLDER_ARTISTS[2], 2025),
  makeRelease("Slow Burn", "slow-burn", "FVR006", PLACEHOLDER_ARTISTS[0], 2026),
];
