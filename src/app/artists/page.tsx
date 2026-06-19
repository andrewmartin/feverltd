import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { getAllArtists } from "@/lib/catalog";
import type { Artist } from "@prisma/client";

export const metadata: Metadata = {
  title: "Artists",
  description: "The Fever Ltd roster — every artist on the label.",
};

export default async function ArtistsPage() {
  let artists: Artist[] = [];
  let unreachable = false;

  try {
    artists = await getAllArtists();
  } catch {
    unreachable = true;
  }

  return (
    <>
      <SiteHeader />
      <main id="main">
        <section className="border-b border-border">
          <div className="mx-auto max-w-7xl px-6 pb-12 pt-20 sm:pt-28">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
              The roster
            </p>
            <h1 className="mt-4 text-5xl font-bold tracking-tighter sm:text-7xl">
              Artists
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              The people behind the records. A small, fiercely independent
              roster of artists we believe in.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-16">
          {artists.length > 0 ? (
            <ul className="grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
              {artists.map((artist) => (
                <li key={artist.id} className="bg-background">
                  <Link
                    href={`/artists/${artist.slug}`}
                    className="group flex items-center gap-4 p-6 transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-none"
                  >
                    {artist.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element -- user-supplied host is arbitrary
                      <img
                        src={artist.imageUrl}
                        alt={`${artist.name} portrait`}
                        loading="lazy"
                        className="h-16 w-16 shrink-0 rounded-full border border-border object-cover"
                      />
                    ) : (
                      <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-border bg-muted font-mono text-xl font-bold text-muted-foreground">
                        {artist.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                    <div className="min-w-0">
                      <h2 className="truncate text-2xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-accent">
                        {artist.name}
                      </h2>
                      <p className="mt-1 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                        View artist →
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="border border-dashed border-border px-6 py-24 text-center">
              <p className="font-mono text-sm uppercase tracking-widest text-muted-foreground">
                {unreachable
                  ? "The roster is briefly offline."
                  : "No artists announced yet."}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {unreachable
                  ? "Try again in a moment."
                  : "We're signing in the shadows — names drop soon."}
              </p>
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
