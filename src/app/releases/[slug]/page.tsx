import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { getReleaseBySlug, type ReleaseWithDetails } from "@/lib/catalog";
import { formatDuration } from "@/lib/utils";

type PageProps = { params: Promise<{ slug: string }> };

async function loadRelease(slug: string): Promise<ReleaseWithDetails | null> {
  try {
    return await getReleaseBySlug(slug);
  } catch {
    // DB unreachable — treat as not found rather than crashing the route.
    return null;
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const release = await loadRelease(slug);

  if (!release) {
    return { title: "Release not found" };
  }

  const artistNames = release.artists.map((a) => a.name).join(", ");
  const title = `${release.title} — ${artistNames}`;
  const description =
    release.description ??
    `${release.title} by ${artistNames}, out now on Fever Ltd.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "music.album",
      images: release.coverUrl ? [{ url: release.coverUrl }] : undefined,
    },
  };
}

function formatReleaseDate(date?: Date | null) {
  if (!date) return null;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

function totalRuntime(tracks: ReleaseWithDetails["tracks"]) {
  const total = tracks.reduce((sum, t) => sum + (t.duration ?? 0), 0);
  return total > 0 ? total : null;
}

export default async function ReleaseDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const release = await loadRelease(slug);

  if (!release) notFound();

  const dateLabel = formatReleaseDate(release.releaseDate);
  const runtime = totalRuntime(release.tracks);

  return (
    <>
      <SiteHeader />
      <main id="main">
        <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
          <Link
            href="/releases"
            className="font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-accent focus-visible:text-accent focus-visible:outline-none"
          >
            ← All releases
          </Link>

          <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,440px)_1fr]">
            {/* Cover */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <div className="relative aspect-square overflow-hidden border border-border bg-muted">
                {release.coverUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element -- user-supplied host is arbitrary
                  <img
                    src={release.coverUrl}
                    alt={`${release.title} cover art`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_30%_30%,#1d1d22,#0a0a0b)]">
                    <span className="font-mono text-6xl font-bold tracking-tighter text-border">
                      {release.catalogNo ?? "FVR"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Meta + tracklist */}
            <div>
              {release.catalogNo && (
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
                  {release.catalogNo}
                </p>
              )}
              <h1 className="mt-3 text-balance text-5xl font-bold tracking-tighter sm:text-6xl">
                {release.title}
              </h1>
              <p className="mt-4 text-xl text-muted-foreground">
                by{" "}
                {release.artists.map((artist, index) => (
                  <span key={artist.id}>
                    {index > 0 ? ", " : ""}
                    <Link
                      href={`/artists/${artist.slug}`}
                      className="text-foreground transition-colors hover:text-accent focus-visible:text-accent focus-visible:outline-none"
                    >
                      {artist.name}
                    </Link>
                  </span>
                ))}
              </p>

              {release.description && (
                <p className="mt-8 max-w-prose text-lg leading-relaxed text-muted-foreground">
                  {release.description}
                </p>
              )}

              <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4 border-t border-border pt-6 font-mono text-xs uppercase tracking-widest">
                {dateLabel && (
                  <div>
                    <dt className="text-muted-foreground">Released</dt>
                    <dd className="mt-1 text-foreground">{dateLabel}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-muted-foreground">Tracks</dt>
                  <dd className="mt-1 text-foreground">
                    {release.tracks.length}
                  </dd>
                </div>
                {runtime && (
                  <div>
                    <dt className="text-muted-foreground">Runtime</dt>
                    <dd className="mt-1 text-foreground">
                      {formatDuration(runtime)}
                    </dd>
                  </div>
                )}
              </dl>

              {release.tracks.length > 0 && (
                <section className="mt-12" aria-labelledby="tracklist-heading">
                  <h2
                    id="tracklist-heading"
                    className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground"
                  >
                    Tracklist
                  </h2>
                  <ol className="mt-4 divide-y divide-border border-y border-border">
                    {release.tracks.map((track) => (
                      <li
                        key={track.id}
                        className="flex items-center gap-4 py-4"
                      >
                        <span className="w-6 shrink-0 font-mono text-sm text-muted-foreground tabular-nums">
                          {track.position.toString().padStart(2, "0")}
                        </span>
                        <span className="min-w-0 flex-1 truncate text-base text-foreground">
                          {track.title}
                        </span>
                        <span className="shrink-0 font-mono text-sm text-muted-foreground tabular-nums">
                          {formatDuration(track.duration)}
                        </span>
                      </li>
                    ))}
                  </ol>
                </section>
              )}
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
