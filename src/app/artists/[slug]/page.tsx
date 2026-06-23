import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PressShell } from "@/components/press/press-shell";
import { PressSectionHead, Outline } from "@/components/press/section-head";
import { PressReleaseCard } from "@/components/press/press-release-card";
import { curatedArtistBySlug } from "@/components/press/press-roster-content";
import type { PressRelease } from "@/components/press/press-content";
import { getArtistBySlug, type ArtistWithReleases } from "@/lib/catalog";
import { AdminEditButton } from "@/components/admin/admin-edit-button";

const WRAP = "mx-auto w-full max-w-[1280px] px-[34px] max-[560px]:px-5";

const monthYear = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
});

type PageProps = { params: Promise<{ slug: string }> };

/** What the detail view needs, sourced from the DB or the curated fallback. */
type ArtistView = {
  /** Present only for real DB rows — enables the admin edit affordance. */
  id?: string;
  name: string;
  slug: string;
  bio?: string;
  photo?: string;
  website?: string;
  loc?: string;
  genre?: string;
  /** Formerly signed but no longer on the label. */
  alumni?: boolean;
  releases: PressRelease[];
};

async function loadArtist(slug: string): Promise<ArtistWithReleases | null> {
  try {
    return await getArtistBySlug(slug);
  } catch {
    return null;
  }
}

/**
 * Build the view from a real DB row (only released titles with covers). The
 * "Based / Sound" chips come from the row's own location/genre, falling back to
 * the curated roster, which also stands in for any image/bio a row is missing.
 */
function viewFromDb(a: ArtistWithReleases): ArtistView {
  const curated = curatedArtistBySlug(a.slug);
  return {
    id: a.id,
    name: a.name,
    slug: a.slug,
    bio: a.bio ?? curated?.bio,
    photo: a.imageUrl ?? curated?.photo,
    website: a.website ?? undefined,
    loc: a.location ?? curated?.loc,
    genre: a.genre ?? curated?.genre,
    alumni: a.alumni,
    releases: a.releases
      .filter((r) => r.coverUrl)
      .map((r, i) => ({
        title: r.title,
        slug: r.slug,
        artist: r.artists.map((x) => x.name).join(", ") || a.name,
        cover: r.coverUrl as string,
        date: r.releaseDate ? monthYear.format(r.releaseDate) : "",
        featured: i === 0,
      })),
  };
}

/**
 * Resolve the artist for display. Prefer a real DB row (even one with no
 * published releases — its catalog just renders an empty state); otherwise fall
 * back to the curated roster (so the page stays whole in local dev with an empty
 * DB). A true miss is a 404.
 */
async function resolveView(slug: string): Promise<ArtistView | null> {
  const db = await loadArtist(slug);
  if (db) return viewFromDb(db);

  const curated = curatedArtistBySlug(slug);
  if (curated) {
    return {
      name: curated.name,
      slug: curated.slug,
      bio: curated.bio,
      photo: curated.photo,
      loc: curated.loc,
      genre: curated.genre,
      releases: curated.releases,
    };
  }
  return null;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const artist = await loadArtist(slug);

  if (!artist) {
    const curated = curatedArtistBySlug(slug);
    if (!curated) return { title: "Artist not found" };
    const description =
      curated.bio ?? `${curated.name} on Fever Ltd. Releases, news, and more.`;
    return {
      title: curated.name,
      description,
      openGraph: {
        title: curated.name,
        description,
        type: "profile",
        images: curated.photo ? [{ url: curated.photo }] : undefined,
      },
    };
  }

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
  const artist = await resolveView(slug);

  if (!artist) notFound();

  return (
    <PressShell>
      {artist.id ? <AdminEditButton kind="artists" id={artist.id} /> : null}

      {/* Full-bleed hero — image spans the full viewport width, with the
          artist name set over the bottom and the back link / status floated
          over the top. */}
      <section className="relative h-[clamp(420px,62vh,680px)] w-full overflow-hidden bg-black">
        {artist.photo ? (
          // eslint-disable-next-line @next/next/no-img-element -- mixed local/blob hosts
          <img
            src={artist.photo}
            alt={artist.name}
            className="absolute inset-0 h-full w-full object-cover [filter:saturate(1.02)_contrast(1.03)]"
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center font-disp text-[clamp(120px,28vw,360px)] font-extrabold uppercase text-[#26241f]">
            {artist.name.charAt(0)}
          </span>
        )}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(8,7,6,0.9)_0%,rgba(8,7,6,0.5)_34%,rgba(8,7,6,0.12)_64%,rgba(8,7,6,0.28)_100%)]" />

        <div className={`${WRAP} absolute inset-x-0 top-0 z-[3] pt-7`}>
          <Link
            href="/artists"
            className="font-press text-[11px] uppercase tracking-[0.18em] text-[#e6ddd0] transition-colors hover:text-fever"
          >
            ← All artists
          </Link>
        </div>

        <div className={`${WRAP} absolute inset-x-0 bottom-0 z-[3] pb-[34px]`}>
          <div className="flex items-center gap-3">
            <span className="font-press text-[11px] uppercase tracking-[0.2em] text-[#e8c8c5]">
              Artist
            </span>
            {artist.alumni ? (
              <span className="inline-flex items-center gap-2 border border-[#e6ddd0]/35 px-2.5 py-1 font-press text-[10px] uppercase tracking-[0.2em] text-[#f4efe6]">
                <span className="h-[6px] w-[6px] rounded-full bg-[#e6ddd0]/70" />
                Alumni
              </span>
            ) : null}
          </div>
          <h1 className="mt-2 text-balance font-disp text-[clamp(48px,9vw,128px)] font-extrabold uppercase leading-[0.82] tracking-[-0.015em] text-[#fbf8f1]">
            {artist.name}
            <span className="text-fever">.</span>
          </h1>
        </div>
      </section>

      {/* Meta bar — Based / Sound / website, beneath the full-width hero. */}
      {artist.loc || artist.genre || artist.website ? (
        <section className="border-b border-rule bg-surface">
          <div
            className={`${WRAP} flex flex-wrap items-center gap-x-[44px] gap-y-3 py-[18px]`}
          >
            {artist.loc ? (
              <div className="flex items-baseline gap-[14px]">
                <span className="font-press text-[10px] uppercase tracking-[0.18em] text-quiet">
                  Based
                </span>
                <span className="font-editorial text-[16px] italic text-ink">
                  {artist.loc}
                </span>
              </div>
            ) : null}
            {artist.genre ? (
              <div className="flex items-baseline gap-[14px]">
                <span className="font-press text-[10px] uppercase tracking-[0.18em] text-quiet">
                  Sound
                </span>
                <span className="font-editorial text-[16px] italic text-ink">
                  {artist.genre}
                </span>
              </div>
            ) : null}
            {artist.website ? (
              <a
                href={artist.website}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto font-press text-[11px] uppercase tracking-[0.16em] text-quiet transition-colors hover:text-fever"
              >
                {artist.website.replace(/^https?:\/\//, "")} ↗
              </a>
            ) : null}
          </div>
        </section>
      ) : null}

      {artist.bio ? (
        <section className="pb-[44px] pt-[40px]">
          <div className={WRAP}>
            <div className="grid grid-cols-[0.42fr_1fr] gap-x-[44px] gap-y-6 max-[760px]:grid-cols-1">
              <span className="font-press text-[11px] uppercase tracking-[0.26em] text-fever">
                Biography
              </span>
              <div className="max-w-[64ch] font-editorial text-[19px] leading-[1.62] text-ink max-[760px]:text-[17px]">
                {artist.bio.split(/\n{2,}/).map((para, i) => (
                  <p key={i} className={i > 0 ? "mt-5" : undefined}>
                    {para}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="pb-[80px] pt-[20px]">
        <div className={WRAP}>
          <PressSectionHead
            kicker="Catalog"
            href="/releases"
            label="All releases →"
          >
            <Outline>Releases</Outline>
            <span className="text-fever">.</span>
          </PressSectionHead>
        </div>
        {artist.releases.length > 0 ? (
          <div className={`${WRAP} mt-[34px]`}>
            <div className="grid grid-cols-4 gap-4 max-[1040px]:grid-cols-3 max-[680px]:grid-cols-2">
              {artist.releases.map((r) => (
                <PressReleaseCard key={r.slug} release={r} />
              ))}
            </div>
          </div>
        ) : (
          <div className={`${WRAP} mt-[34px]`}>
            <div className="flex flex-col items-start gap-3 border border-rule bg-surface px-[34px] py-[52px] max-[560px]:px-6">
              <span className="font-press text-[11px] uppercase tracking-[0.26em] text-fever">
                Coming soon
              </span>
              <p className="max-w-[48ch] font-editorial text-[19px] leading-[1.5] text-ink max-[760px]:text-[17px]">
                No releases yet from {artist.name}. Check back soon — new music
                is on the way.
              </p>
            </div>
          </div>
        )}
      </section>
    </PressShell>
  );
}
