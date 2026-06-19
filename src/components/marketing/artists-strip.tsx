import Link from "next/link";
import type { Artist } from "@prisma/client";

export function ArtistsStrip({ artists }: { artists: Artist[] }) {
  if (artists.length === 0) return null;

  return (
    <section
      className="border-b border-border bg-muted/30"
      aria-labelledby="roster-heading"
    >
      <div className="mx-auto max-w-7xl px-6 py-20 sm:py-28">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
              The roster
            </p>
            <h2
              id="roster-heading"
              className="mt-3 text-4xl font-bold tracking-tighter sm:text-5xl"
            >
              Artists on the label
            </h2>
          </div>
          <Link
            href="/artists"
            className="hidden shrink-0 font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-accent focus-visible:text-accent focus-visible:outline-none sm:inline-block"
          >
            All artists →
          </Link>
        </div>

        <ul className="mt-12 flex flex-wrap gap-x-8 gap-y-4">
          {artists.map((artist) => (
            <li key={artist.id}>
              <Link
                href={`/artists/${artist.slug}`}
                className="group inline-flex items-baseline gap-3 focus-visible:outline-none"
              >
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-border transition-colors group-hover:bg-accent" />
                <span className="text-2xl font-semibold tracking-tight text-muted-foreground transition-colors group-hover:text-foreground sm:text-3xl">
                  {artist.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
