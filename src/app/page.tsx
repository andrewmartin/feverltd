import { PressShell } from "@/components/press/press-shell";
import { PressHero } from "@/components/press/press-hero";
import { PressReleases } from "@/components/press/press-releases";
import { PressNews } from "@/components/press/press-news";
import {
  heroArtistsFrom,
  releasesFrom,
  newsFrom,
} from "@/components/press/press-adapters";
import {
  getAllArtists,
  getFeaturedReleases,
  getLatestNews,
} from "@/lib/catalog";
import type { Artist, NewsPost } from "@prisma/client";
import type { ReleaseWithArtists } from "@/lib/catalog";

export default async function Home() {
  let releases: ReleaseWithArtists[] = [];
  let artists: Artist[] = [];
  let news: NewsPost[] = [];

  try {
    [releases, artists, news] = await Promise.all([
      getFeaturedReleases(8),
      getAllArtists(),
      getLatestNews(3),
    ]);
  } catch {
    // DB empty or unreachable — adapters fall through to curated content.
  }

  return (
    <PressShell>
      <PressHero artists={heroArtistsFrom(artists)} />
      <PressReleases releases={releasesFrom(releases)} />
      <PressNews items={newsFrom(news)} />
    </PressShell>
  );
}
