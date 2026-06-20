import Link from "next/link";
import type { ReleaseWithArtists } from "@/lib/catalog";
import { ReleaseCard } from "@/components/site/release-card";

export function FeaturedReleases({
  releases,
}: {
  releases: ReleaseWithArtists[];
}) {
  return (
    <section className="border-b border-border" aria-labelledby="featured-heading">
      <div className="mx-auto max-w-7xl px-6 py-20 sm:py-28">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
              Latest
            </p>
            <h2
              id="featured-heading"
              className="mt-3 text-4xl font-bold tracking-tighter sm:text-5xl"
            >
              Fresh on wax
            </h2>
          </div>
          <Link
            href="/releases"
            className="hidden shrink-0 font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-accent focus-visible:text-accent focus-visible:outline-none sm:inline-block"
          >
            All releases →
          </Link>
        </div>

        {releases.length > 0 ? (
          <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-3">
            {releases.map((release) => (
              <ReleaseCard key={release.id} release={release} />
            ))}
          </div>
        ) : (
          <div className="mt-12 border border-dashed border-border px-6 py-20 text-center">
            <p className="font-mono text-sm uppercase tracking-widest text-muted-foreground">
              The first pressings are in the cutting room.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              New releases land here soon — check back shortly.
            </p>
          </div>
        )}

        <div className="mt-10 sm:hidden">
          <Link
            href="/releases"
            className="font-mono text-xs uppercase tracking-widest text-accent"
          >
            All releases →
          </Link>
        </div>
      </div>
    </section>
  );
}
