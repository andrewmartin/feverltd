/**
 * Curated fallback for the release **detail** page. The index/grid pages fall
 * back to `PRESS_RELEASES` from `press-content.ts`; this file augments those
 * same records with the extra fields a detail view wants (description,
 * tracklist) so a direct visit to `/releases/<slug>` reads as complete when the
 * database is empty or unreachable in local dev.
 *
 * Keyed by the same `slug` used in `PRESS_RELEASES`. Image paths are
 * URL-encoded (spaces → %20).
 */

import { PRESS_RELEASES, type PressRelease } from "./press-content";

export type PressReleaseDetail = PressRelease & {
  description?: string;
  /** Track titles in order; durations are unknown for curated content. */
  tracklist?: string[];
};

const DETAILS: Record<string, { description?: string; tracklist?: string[] }> = {
  "going-postal": {
    description:
      "The Paris four-piece's debut full-length — shoegaze turned heavy, all blown-out melody and motion. Pressed to vinyl in a limited first run.",
    tracklist: [
      "Going Postal",
      "Dead Air",
      "Wallflower",
      "Slow Burn",
      "Static Bloom",
      "Comedown",
    ],
  },
  "constant-remembrance-of-wanting-nothing": {
    description:
      "Birmingham, Alabama post-hardcore — patient, cathartic, built for the room's last song. Issued on CD through Fever LTD.",
  },
  "newviolenttrends": {
    description:
      "Connecticut post-hardcore fronted by Zack Santiago. The 'newviolenttrends' EP collects the band's most urgent material to date.",
  },
  ghosts: {
    description:
      "A Montana screamo quartet at full tilt — raw, immediate, and unflinching across this 2024 record.",
  },
  "take-i-lovely-you": {
    description:
      "Chicago's Muted Color wash dream-pop in shoegaze haze — a record that drifts and detonates in equal measure.",
  },
};

/** Look up a curated detail record by slug, or null. */
export function curatedReleaseDetail(slug: string): PressReleaseDetail | null {
  const base = PRESS_RELEASES.find((r) => r.slug === slug);
  if (!base) return null;
  return { ...base, ...DETAILS[slug] };
}
