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
 * curated roster supplies the bits the Artist table has no columns for — the
 * "Based / Sound" chips — and stands in for any image/bio a row is missing.
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
    loc: curated?.loc,
    genre: curated?.genre,
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
 * Resolve the artist for display. Prefer a real DB row that has at least one
 * published release; otherwise fall back to the curated roster (so the page
 * stays whole in local dev with an empty DB). A true miss is a 404.
 */
async function resolveView(slug: string): Promise<ArtistView | null> {
  const db = await loadArtist(slug);
  if (db && db.releases.length > 0) return viewFromDb(db);

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
      <section className="pb-[40px] pt-[40px]">
        <div className={WRAP}>
          <Link
            href="/artists"
            className="font-press text-[11px] uppercase tracking-[0.18em] text-quiet transition-colors hover:text-fever"
          >
            ← All artists
          </Link>

          <div className="mt-6 grid grid-cols-[1.62fr_0.9fr] border border-rule bg-surface max-[900px]:grid-cols-1">
            <div className="relative aspect-[16/11] overflow-hidden bg-black max-[900px]:aspect-[4/3]">
              {artist.photo ? (
                // eslint-disable-next-line @next/next/no-img-element -- mixed local/blob hosts
                <img
                  src={artist.photo}
                  alt={artist.name}
                  className="h-full w-full object-cover [filter:saturate(1.02)_contrast(1.03)]"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center font-disp text-[96px] font-extrabold uppercase text-[#3a3733]">
                  {artist.name.charAt(0)}
                </span>
              )}
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(8,7,6,0.82)_0%,rgba(8,7,6,0.25)_42%,rgba(8,7,6,0)_70%)]" />
              <div className="absolute left-4 top-4 z-[3] flex items-center gap-2 font-press text-[10px] uppercase tracking-[0.2em] text-[#f4efe6]">
                <span className="h-[7px] w-[7px] animate-pulse-led rounded-full bg-fever [box-shadow:0_0_10px_1px_var(--glow)]" />
                On the label
              </div>
              <div className="absolute inset-x-0 bottom-0 z-[3] px-7 py-[26px]">
                <span className="font-press text-[11px] uppercase tracking-[0.18em] text-[#e8c8c5]">
                  Artist
                </span>
                <h1 className="mt-1.5 text-balance font-disp text-[clamp(40px,7.2vw,104px)] font-extrabold uppercase leading-[0.84] tracking-[-0.01em] text-[#fbf8f1]">
                  {artist.name}
                  <span className="text-fever">.</span>
                </h1>
              </div>
            </div>

            <aside className="relative flex flex-col overflow-hidden border-l border-rule px-[30px] py-[34px] max-[900px]:border-l-0 max-[900px]:border-t">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(125%_105%_at_100%_112%,rgba(198,53,47,0.2)_0%,rgba(198,53,47,0.07)_38%,transparent_70%),linear-gradient(135deg,transparent_52%,rgba(22,23,26,0.05)_100%)] pdark:bg-[radial-gradient(125%_105%_at_100%_112%,rgba(198,53,47,0.36)_0%,rgba(198,53,47,0.12)_40%,transparent_72%),linear-gradient(135deg,transparent_52%,rgba(255,255,255,0.045)_100%)]"
              />
              <dl className="relative z-[1] mb-[18px] mt-auto grid grid-cols-[auto_1fr] gap-x-[18px] gap-y-[9px]">
                {artist.loc ? (
                  <>
                    <dt className="self-center font-press text-[10px] uppercase tracking-[0.18em] text-quiet">
                      Based
                    </dt>
                    <dd className="font-editorial text-[16px] italic text-ink">
                      {artist.loc}
                    </dd>
                  </>
                ) : null}
                {artist.genre ? (
                  <>
                    <dt className="self-center font-press text-[10px] uppercase tracking-[0.18em] text-quiet">
                      Sound
                    </dt>
                    <dd className="font-editorial text-[16px] italic text-ink">
                      {artist.genre}
                    </dd>
                  </>
                ) : null}
              </dl>
              {artist.website ? (
                <a
                  href={artist.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative z-[1] font-press text-[11px] uppercase tracking-[0.16em] text-quiet transition-colors hover:text-fever"
                >
                  {artist.website.replace(/^https?:\/\//, "")} ↗
                </a>
              ) : null}
            </aside>
          </div>
        </div>
      </section>

      {artist.bio ? (
        <section className="pb-[44px] pt-[8px]">
          <div className={WRAP}>
            <div className="grid grid-cols-[0.42fr_1fr] gap-x-[44px] gap-y-6 border-t border-rule pt-[34px] max-[760px]:grid-cols-1">
              <span className="font-press text-[11px] uppercase tracking-[0.26em] text-fever">
                (01) — Biography
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

      {artist.releases.length > 0 ? (
        <section className="pb-[80px] pt-[20px]">
          <div className={WRAP}>
            <PressSectionHead
              kicker="(02) — Catalog"
              href="/releases"
              label="All releases →"
            >
              Their <Outline>Releases</Outline>
              <span className="text-fever">.</span>
            </PressSectionHead>
          </div>
          <div className={`${WRAP} mt-[34px]`}>
            <div className="grid grid-cols-4 gap-4 max-[1040px]:grid-cols-3 max-[680px]:grid-cols-2">
              {artist.releases.map((r) => (
                <PressReleaseCard key={r.slug} release={r} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </PressShell>
  );
}
