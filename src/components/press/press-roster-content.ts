/**
 * Curated Pressroom roster fallback content — used by the Artists screens when
 * the database is empty or unreachable, so the roster and artist-detail pages
 * never render broken. Mirrors the real label content (press photos + cover art
 * under `public/reference/`) and stays in sync with `press-content.ts`.
 *
 * The detail page needs an artist's own releases, which the homepage content
 * doesn't group by artist — so this file carries a slug-keyed release list.
 *
 * Image paths are URL-encoded (spaces → %20) so they resolve from `/reference/...`.
 */

import { PRESS_HERO_ARTISTS, type HeroArtist, type PressRelease } from "./press-content";

/** A curated artist with their own (curated) releases, for the detail fallback. */
export type RosterArtist = HeroArtist & {
  releases: PressRelease[];
};

/** Releases grouped by artist slug (titles/covers match `press-content.ts`). */
const RELEASES_BY_SLUG: Record<string, PressRelease[]> = {
  mascara: [
    {
      title: "Going Postal",
      slug: "going-postal",
      artist: "Mascara",
      cover: "/reference/artists/Mascara/03-going-postal-cover.jpg",
      format: "Vinyl",
      date: "Mar 2026",
      featured: true,
    },
  ],
  "valley-of-doves": [
    {
      title: "Constant Remembrance",
      slug: "constant-remembrance-of-wanting-nothing",
      artist: "Valley of Doves",
      cover: "/reference/artists/Valley%20of%20Doves/04-feverltd-cd-product.png",
      format: "CD",
      date: "Mar 2026",
    },
  ],
  "en-masse": [
    {
      title: "newviolenttrends",
      slug: "newviolenttrends",
      artist: "En Masse",
      cover: "/reference/artists/En%20Masse/04-album-art-newviolenttrends.jpg",
      format: "CD",
      date: "Jun 2025",
    },
  ],
  "fly-over-states": [
    {
      title: "Ghosts",
      slug: "ghosts",
      artist: "Fly Over States",
      cover: "/reference/artists/Fly%20Over%20States/04-ghosts-cover-art.png",
      format: "CD",
      date: "May 2024",
    },
  ],
  "muted-color": [
    {
      title: "Take I Lovely You",
      slug: "take-i-lovely-you",
      artist: "Muted Color",
      cover: "/reference/artists/Muted%20Color/03-take-i-lovely-you-cover.jpg",
      format: "Vinyl",
      date: "2023",
    },
    {
      title: "Radial",
      slug: "radial",
      artist: "Muted Color",
      cover: "/reference/artists/Muted%20Color/04-radial-cover.jpg",
      format: "Tape",
      date: "2023",
    },
  ],
  "teenage-wrist": [],
};

/** The full curated roster — homepage hero artists, each with their releases. */
export const PRESS_ROSTER: RosterArtist[] = PRESS_HERO_ARTISTS.map((a) => ({
  ...a,
  releases: RELEASES_BY_SLUG[a.slug] ?? [],
}));

/** Curated lookup by slug for the detail-page fallback. */
export function curatedArtistBySlug(slug: string): RosterArtist | undefined {
  return PRESS_ROSTER.find((a) => a.slug === slug);
}
