import type { Metadata } from "next";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { ReleaseCard } from "@/components/site/release-card";
import { getAllReleases, type ReleaseWithArtist } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Releases",
  description: "The full Fever Ltd catalog — every record, newest first.",
};

export default async function ReleasesPage() {
  let releases: ReleaseWithArtist[] = [];
  let unreachable = false;

  try {
    releases = await getAllReleases();
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
              Catalog
            </p>
            <h1 className="mt-4 text-5xl font-bold tracking-tighter sm:text-7xl">
              Releases
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Everything we&apos;ve put into the world, in reverse chronological
              order. Limited pressings — when they&apos;re gone, they&apos;re
              gone.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-16">
          {releases.length > 0 ? (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {releases.map((release) => (
                <ReleaseCard key={release.id} release={release} />
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-border px-6 py-24 text-center">
              <p className="font-mono text-sm uppercase tracking-widest text-muted-foreground">
                {unreachable
                  ? "The catalog is briefly offline."
                  : "Nothing pressed yet."}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {unreachable
                  ? "Try again in a moment."
                  : "Our first records are on their way — check back soon."}
              </p>
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
