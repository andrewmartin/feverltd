import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { Hero } from "@/components/marketing/hero";
import { FeaturedReleases } from "@/components/marketing/featured-releases";
import { ArtistsStrip } from "@/components/marketing/artists-strip";
import { About } from "@/components/marketing/about";
import { NewsletterCta } from "@/components/marketing/newsletter-cta";
import {
  PLACEHOLDER_ARTISTS,
  PLACEHOLDER_RELEASES,
} from "@/components/marketing/placeholder-data";
import { getAllArtists, getFeaturedReleases } from "@/lib/catalog";
import type { Artist } from "@prisma/client";
import type { ReleaseWithArtist } from "@/lib/catalog";

export default async function Home() {
  let releases: ReleaseWithArtist[] = [];
  let artists: Artist[] = [];

  try {
    [releases, artists] = await Promise.all([
      getFeaturedReleases(6),
      getAllArtists(),
    ]);
  } catch {
    // DB empty or unreachable — fall through to curated placeholders below.
  }

  // If the catalog is genuinely empty (or unreachable), show curated placeholders
  // so the public face of the label never looks broken.
  const showReleases =
    releases.length > 0 ? releases : PLACEHOLDER_RELEASES;
  const showArtists = artists.length > 0 ? artists : PLACEHOLDER_ARTISTS;

  return (
    <>
      <SiteHeader />
      <main id="main">
        <Hero releaseCount={releases.length || undefined} />
        <FeaturedReleases releases={showReleases} />
        <ArtistsStrip artists={showArtists} />
        <About />
        <NewsletterCta />
      </main>
      <SiteFooter />
    </>
  );
}
