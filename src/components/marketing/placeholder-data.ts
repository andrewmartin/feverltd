import { ReleaseStatus, type Artist } from "@prisma/client";
import type { ReleaseWithArtists } from "@/lib/catalog";

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
    location: null,
    genre: null,
    alumni: false,
    createdAt: now,
    updatedAt: now,
  };
}

export const PLACEHOLDER_ARTISTS: Artist[] = [
  makeArtist("Mascara", "mascara"),
  makeArtist("Teenage Wrist", "teenage-wrist"),
  makeArtist("Muted Color", "muted-color"),
  makeArtist("The Chain Gang of 1974", "the-chain-gang-of-1974"),
  makeArtist("Valley of Doves", "valley-of-doves"),
  makeArtist("Fly Over States", "fly-over-states"),
];

function makeRelease(
  title: string,
  slug: string,
  catalogNo: string,
  artist: Artist,
  year: number,
): ReleaseWithArtists {
  return {
    id: `placeholder-release-${slug}`,
    title,
    slug,
    catalogNo,
    description: null,
    coverUrl: null,
    buyUrl: null,
    releaseDate: new Date(`${year}-01-01`),
    status: ReleaseStatus.PUBLISHED,
    artists: [artist],
    createdAt: now,
    updatedAt: now,
  };
}

export const PLACEHOLDER_RELEASES: ReleaseWithArtists[] = [
  makeRelease("Going Postal", "going-postal", "FEV009", PLACEHOLDER_ARTISTS[0], 2026),
  makeRelease("Dazed (2025 Remaster)", "dazed-2025-remaster", "FEV004", PLACEHOLDER_ARTISTS[1], 2025),
  makeRelease("Take I Lovely You", "take-i-lovely-you", "FEV007", PLACEHOLDER_ARTISTS[2], 2025),
  makeRelease("Honey Moon Drips", "honey-moon-drips", "FEV005", PLACEHOLDER_ARTISTS[3], 2025),
  makeRelease("Constant Remembrance of Wanting Nothing", "constant-remembrance-of-wanting-nothing", "FEV010", PLACEHOLDER_ARTISTS[4], 2026),
  makeRelease("Ghosts", "ghosts", "FEV001", PLACEHOLDER_ARTISTS[5], 2024),
];
