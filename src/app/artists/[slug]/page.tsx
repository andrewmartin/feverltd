import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { ReleaseCard } from "@/components/site/release-card";
import { getArtistBySlug, type ArtistWithReleases } from "@/lib/catalog";

type PageProps = { params: Promise<{ slug: string }> };

async function loadArtist(slug: string): Promise<ArtistWithReleases | null> {
  try {
    return await getArtistBySlug(slug);
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const artist = await loadArtist(slug);

  if (!artist) return { title: "Artist not found" };

  const description =
    artist.bio ?? `${artist.name} on Fever Ltd. Releases, news, and more.`;

  return {
    title: artist.name,
    description,
    openGraph: {
      title: artist.name,
      description,
      type: "profile",
      images: artist.imageUrl ? [{ url: artist.imageUrl }] : undefined,
    },
  };
}

export default async function ArtistDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const artist = await loadArtist(slug);

  // Only surface artists that have at least one published release.
  if (!artist || artist.releases.length === 0) notFound();

  return (
    <>
      <SiteHeader />
      <main id="main">
        <section className="border-b border-border">
          <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
            <Link
              href="/artists"
              className="font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-accent focus-visible:text-accent focus-visible:outline-none"
            >
              ← All artists
            </Link>

            <div className="mt-10 flex flex-col gap-8 sm:flex-row sm:items-end">
              {artist.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- user-supplied host is arbitrary
                <img
                  src={artist.imageUrl}
                  alt={`${artist.name} portrait`}
                  className="h-32 w-32 shrink-0 rounded-full border border-border object-cover sm:h-40 sm:w-40"
                />
              ) : (
                <span className="flex h-32 w-32 shrink-0 items-center justify-center rounded-full border border-border bg-muted font-mono text-5xl font-bold text-muted-foreground sm:h-40 sm:w-40">
                  {artist.name.charAt(0).toUpperCase()}
                </span>
              )}
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
                  Artist
                </p>
                <h1 className="mt-3 text-balance text-5xl font-bold tracking-tighter sm:text-7xl">
                  {artist.name}
                </h1>
                {artist.website && (
                  <a
                    href={artist.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-accent focus-visible:text-accent focus-visible:outline-none"
                  >
                    {artist.website.replace(/^https?:\/\//, "")} ↗
                  </a>
                )}
              </div>
            </div>

            {artist.bio && (
              <p className="mt-10 max-w-prose text-lg leading-relaxed text-muted-foreground">
                {artist.bio}
              </p>
            )}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-16">
          <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Releases
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {artist.releases.map((release) => (
              <ReleaseCard key={release.id} release={release} />
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
