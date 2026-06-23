import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PressShell } from "@/components/press/press-shell";
import {
  curatedReleaseDetail,
  type PressReleaseDetail,
} from "@/components/press/press-catalog-content";
import { getReleaseBySlug, type ReleaseWithDetails } from "@/lib/catalog";
import { AdminEditButton } from "@/components/admin/admin-edit-button";
import { formatDuration } from "@/lib/utils";

const WRAP = "mx-auto w-full max-w-[1280px] px-[34px] max-[560px]:px-5";

type PageProps = { params: Promise<{ slug: string }> };

async function loadRelease(slug: string): Promise<ReleaseWithDetails | null> {
  try {
    return await getReleaseBySlug(slug);
  } catch {
    // DB unreachable — fall through to curated content / not found.
    return null;
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const release = await loadRelease(slug);
  const curated = release ? null : curatedReleaseDetail(slug);

  if (!release && !curated) {
    return { title: "Release not found" };
  }

  if (release) {
    const artistNames = release.artists.map((a) => a.name).join(", ");
    const title = `${release.title} — ${artistNames}`;
    const description =
      release.description ??
      `${release.title} by ${artistNames}, out now on Fever LTD.`;
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

  const c = curated as PressReleaseDetail;
  const title = `${c.title} — ${c.artist}`;
  const description =
    c.description ?? `${c.title} by ${c.artist}, out now on Fever LTD.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "music.album",
      images: [{ url: c.cover }],
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

/** Normalized view model so real + curated content render through one layout. */
type ReleaseView = {
  title: string;
  catalogNo: string | null;
  coverUrl: string | null;
  description: string | null;
  buyUrl: string | null;
  dateLabel: string | null;
  /** [name, slug | null] — curated artists have no detail page. */
  artists: { name: string; slug: string | null }[];
  trackCount: number;
  runtime: number | null;
  /** Real tracks with durations, or curated string-only titles. */
  tracks:
    | { kind: "full"; items: ReleaseWithDetails["tracks"] }
    | { kind: "titles"; items: string[] }
    | null;
};

function viewFromRelease(r: ReleaseWithDetails): ReleaseView {
  return {
    title: r.title,
    catalogNo: r.catalogNo ?? null,
    coverUrl: r.coverUrl ?? null,
    description: r.description ?? null,
    buyUrl: r.buyUrl ?? null,
    dateLabel: formatReleaseDate(r.releaseDate),
    artists: r.artists.map((a) => ({ name: a.name, slug: a.slug })),
    trackCount: r.tracks.length,
    runtime: totalRuntime(r.tracks),
    tracks: r.tracks.length > 0 ? { kind: "full", items: r.tracks } : null,
  };
}

function viewFromCurated(c: PressReleaseDetail): ReleaseView {
  const titles = c.tracklist ?? [];
  return {
    title: c.title,
    catalogNo: null,
    coverUrl: c.cover,
    description: c.description ?? null,
    buyUrl: null,
    dateLabel: c.date || null,
    artists: [{ name: c.artist, slug: null }],
    trackCount: titles.length,
    runtime: null,
    tracks: titles.length > 0 ? { kind: "titles", items: titles } : null,
  };
}

export default async function ReleaseDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const release = await loadRelease(slug);
  const curated = release ? null : curatedReleaseDetail(slug);

  if (!release && !curated) notFound();

  const v = release ? viewFromRelease(release) : viewFromCurated(curated!);

  return (
    <PressShell>
      {release ? <AdminEditButton kind="releases" id={release.id} /> : null}
      <div className={WRAP}>
        <div className="py-[44px] max-[560px]:py-8">
          <Link
            href="/releases"
            className="font-press text-[11px] uppercase tracking-[0.2em] text-quiet transition-colors hover:text-fever"
          >
            ← All releases
          </Link>

          <div className="mt-9 grid gap-12 lg:grid-cols-[minmax(0,440px)_1fr] max-[560px]:gap-8">
            {/* Cover */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <div className="relative aspect-square overflow-hidden border border-hair bg-black">
                {v.coverUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element -- mixed local/blob hosts
                  <img
                    src={v.coverUrl}
                    alt={`${v.title} cover art`}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="font-disp text-6xl font-extrabold uppercase tracking-tight text-[rgba(244,239,230,0.16)]">
                      {v.catalogNo ?? "FVR"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Meta + tracklist */}
            <div>
              {v.catalogNo ? (
                <p className="font-press text-[11px] uppercase tracking-[0.26em] text-fever">
                  {v.catalogNo}
                </p>
              ) : null}
              <h1 className="mt-3 text-balance font-disp text-[clamp(40px,7vw,80px)] font-extrabold uppercase leading-[0.86] tracking-[-0.01em]">
                {v.title}
                <span className="text-fever">.</span>
              </h1>
              <p className="mt-4 font-editorial text-xl text-quiet">
                by{" "}
                {v.artists.map((artist, index) => (
                  <span key={`${artist.name}-${index}`}>
                    {index > 0 ? ", " : ""}
                    {artist.slug ? (
                      <Link
                        href={`/artists/${artist.slug}`}
                        className="text-ink transition-colors hover:text-fever"
                      >
                        {artist.name}
                      </Link>
                    ) : (
                      <span className="text-ink">{artist.name}</span>
                    )}
                  </span>
                ))}
              </p>

              {v.buyUrl ? (
                <a
                  href={v.buyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex items-center gap-2 border border-fever bg-fever px-7 py-3 font-press text-[11px] uppercase tracking-[0.2em] text-black transition-colors hover:bg-transparent hover:text-fever"
                >
                  Listen
                  <span aria-hidden>↗</span>
                </a>
              ) : null}

              {v.description ? (
                <p className="mt-8 max-w-prose font-editorial text-lg leading-relaxed text-quiet">
                  {v.description}
                </p>
              ) : null}

              <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4 border-t border-rule pt-6 font-press text-[11px] uppercase tracking-[0.18em]">
                {v.dateLabel ? (
                  <div>
                    <dt className="text-quiet">Released</dt>
                    <dd className="mt-1 text-ink">{v.dateLabel}</dd>
                  </div>
                ) : null}
                {v.trackCount > 0 ? (
                  <div>
                    <dt className="text-quiet">Tracks</dt>
                    <dd className="mt-1 text-ink">{v.trackCount}</dd>
                  </div>
                ) : null}
                {v.runtime ? (
                  <div>
                    <dt className="text-quiet">Runtime</dt>
                    <dd className="mt-1 text-ink">{formatDuration(v.runtime)}</dd>
                  </div>
                ) : null}
              </dl>

              {v.tracks ? (
                <section className="mt-12" aria-labelledby="tracklist-heading">
                  <h2
                    id="tracklist-heading"
                    className="font-press text-[11px] uppercase tracking-[0.26em] text-fever"
                  >
                    Tracklist
                  </h2>
                  <ol className="mt-4 divide-y divide-hair border-y border-hair">
                    {v.tracks.kind === "full"
                      ? v.tracks.items.map((track) => (
                          <li
                            key={track.id}
                            className="flex items-center gap-4 py-4"
                          >
                            <span className="w-6 shrink-0 font-press text-sm text-quiet tabular-nums">
                              {track.position.toString().padStart(2, "0")}
                            </span>
                            <span className="min-w-0 flex-1 truncate text-base text-ink">
                              {track.title}
                            </span>
                            <span className="shrink-0 font-press text-sm text-quiet tabular-nums">
                              {formatDuration(track.duration)}
                            </span>
                          </li>
                        ))
                      : v.tracks.items.map((title, i) => (
                          <li
                            key={`${title}-${i}`}
                            className="flex items-center gap-4 py-4"
                          >
                            <span className="w-6 shrink-0 font-press text-sm text-quiet tabular-nums">
                              {(i + 1).toString().padStart(2, "0")}
                            </span>
                            <span className="min-w-0 flex-1 truncate text-base text-ink">
                              {title}
                            </span>
                          </li>
                        ))}
                  </ol>
                </section>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </PressShell>
  );
}
