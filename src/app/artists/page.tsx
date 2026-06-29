import type { Metadata } from "next";
import { PressShell } from "@/components/press/press-shell";
import {
  PressArtistCard,
  type PressArtistCardProps,
} from "@/components/press/press-artist-card";
import { PRESS_ROSTER } from "@/components/press/press-roster-content";
import { getAllArtists } from "@/lib/catalog";
import type { Artist } from "@prisma/client";

const WRAP = "mx-auto w-full max-w-[1280px] px-[34px] max-[560px]:px-5";

export const metadata: Metadata = {
  title: "Artists",
  description: "The Fever Ltd roster — every artist on the label.",
};

/**
 * Map DB artist rows to roster cards, falling back to the curated roster
 * whenever the database has no artists carrying usable press imagery (so the
 * public roster never renders empty/broken). `Artist` rows have no loc/genre
 * columns, so those only appear when the curated fallback supplies them.
 */
function rosterCards(artists: Artist[]): Omit<PressArtistCardProps, "index">[] {
  const usable = artists
    .filter((a) => a.imageUrl)
    .map((a) => ({
      name: a.name,
      slug: a.slug,
      photo: a.imageUrl as string,
      alumni: a.alumni,
    }));
  if (usable.length > 0) return usable;
  return PRESS_ROSTER.map((a) => ({
    name: a.name,
    slug: a.slug,
    photo: a.photo,
    loc: a.loc,
    genre: a.genre,
  }));
}

export default async function ArtistsPage() {
  let artists: Artist[] = [];

  try {
    artists = await getAllArtists();
  } catch {
    // DB empty or unreachable — fall through to curated roster.
  }

  const cards = rosterCards(artists);

  return (
    <PressShell>
      <section className="pb-[28px] pt-[52px]">
        <div className={WRAP}>
          <span className="mb-3 inline-block font-press text-[11px] uppercase tracking-[0.26em] text-fever">
            The roster
          </span>
          <h1 className="font-disp text-[clamp(44px,8vw,104px)] font-extrabold uppercase leading-[0.84] tracking-[-0.01em]">
            Artists<span className="text-fever">.</span>
          </h1>
          <p className="mt-5 max-w-[52ch] font-editorial text-[16px] leading-[1.5] text-quiet">
            The people behind the records. A small, fiercely independent roster
            of artists we believe in.
          </p>
        </div>
      </section>

      <section className="pb-[80px] pt-[6px]">
        <div className={WRAP}>
          <div className="grid grid-cols-4 gap-4 max-[1040px]:grid-cols-3 max-[680px]:grid-cols-2">
            {cards.map((c, k) => (
              <PressArtistCard key={c.slug} index={k} {...c} />
            ))}
          </div>
        </div>
      </section>
    </PressShell>
  );
}
