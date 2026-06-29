import type { Artist, NewsPost } from "@prisma/client";
import type { ReleaseWithArtists } from "@/lib/catalog";
import {
  PRESS_HERO_ARTISTS,
  PRESS_NEWS,
  PRESS_RELEASES,
  type HeroArtist,
  type PressNewsItem,
  type PressRelease,
} from "./press-content";

const monthYear = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
});
const longDate = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

/**
 * Map DB rows to Pressroom view props, falling back to the curated content
 * (the prototype's real label content) whenever the database has nothing
 * usable to show. We only promote real rows that carry the imagery the
 * gallery layout depends on, so the page never renders empty black tiles.
 */

export function heroArtistsFrom(artists: Artist[]): HeroArtist[] {
  const usable = artists
    .filter((a) => a.imageUrl)
    .map(
      (a): HeroArtist => ({
        name: a.name,
        slug: a.slug,
        photo: a.imageUrl as string,
        bio: a.bio ?? undefined,
        alumni: a.alumni,
      }),
    );
  return usable.length > 0 ? usable : PRESS_HERO_ARTISTS;
}

export function releasesFrom(releases: ReleaseWithArtists[]): PressRelease[] {
  const usable = releases
    .filter((r) => r.coverUrl)
    .map(
      (r, i): PressRelease => ({
        title: r.title,
        slug: r.slug,
        artist: r.artists.map((a) => a.name).join(", ") || "Fever LTD",
        cover: r.coverUrl as string,
        date: r.releaseDate ? monthYear.format(r.releaseDate) : "",
        featured: i === 0,
      }),
    );
  return usable.length > 0 ? usable : PRESS_RELEASES;
}

function newsItemFrom(p: NewsPost): PressNewsItem {
  return {
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt ?? "",
    date: longDate.format(p.publishedAt ?? p.createdAt),
    thumb: p.heroImage as string,
    body: p.body ?? undefined,
  };
}

export function newsFrom(posts: NewsPost[]): PressNewsItem[] {
  const usable = posts.filter((p) => p.heroImage).map(newsItemFrom);
  return usable.length > 0 ? usable : PRESS_NEWS;
}

/**
 * Resolve a single dispatch by slug — a real row (with imagery) when present,
 * otherwise the curated post of the same slug. Returns null when neither has it
 * so the detail route can 404.
 */
export function newsDetailFrom(
  post: NewsPost | null,
  slug: string,
): PressNewsItem | null {
  if (post?.heroImage) return newsItemFrom(post);
  return PRESS_NEWS.find((n) => n.slug === slug) ?? null;
}
