import Link from "next/link";
import type { ReleaseWithArtists } from "@/lib/catalog";

function formatYear(date?: Date | null) {
  if (!date) return null;
  return new Date(date).getFullYear();
}

export function ReleaseCard({ release }: { release: ReleaseWithArtists }) {
  const year = formatYear(release.releaseDate);

  return (
    <Link
      href={`/releases/${release.slug}`}
      className="group block focus-visible:outline-none"
    >
      <div className="relative aspect-square overflow-hidden border border-border bg-muted">
        {release.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- user-supplied host is arbitrary
          <img
            src={release.coverUrl}
            alt={`${release.title} cover art`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_30%_30%,#1d1d22,#0a0a0b)]">
            <span className="font-mono text-4xl font-bold tracking-tighter text-border">
              {release.catalogNo ?? "FVR"}
            </span>
          </div>
        )}
        <div className="absolute inset-0 ring-1 ring-inset ring-white/0 transition-all duration-300 group-hover:ring-accent" />
        {release.catalogNo && (
          <span className="absolute left-3 top-3 bg-background/80 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground backdrop-blur">
            {release.catalogNo}
          </span>
        )}
      </div>

      <div className="mt-3">
        <h3 className="text-balance text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-accent">
          {release.title}
        </h3>
        <p className="mt-0.5 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          {release.artists.map((a) => a.name).join(", ")}
          {year ? ` · ${year}` : ""}
        </p>
      </div>
    </Link>
  );
}
