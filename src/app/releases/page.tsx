import type { Metadata } from "next";
import { PressShell } from "@/components/press/press-shell";
import { PressPageHead } from "@/components/press/press-page-head";
import { PressReleaseCard } from "@/components/press/press-release-card";
import { Outline } from "@/components/press/section-head";
import { releasesFrom } from "@/components/press/press-adapters";
import { getAllReleases, type ReleaseWithArtists } from "@/lib/catalog";

const WRAP = "mx-auto w-full max-w-[1280px] px-[34px] max-[560px]:px-5";

export const metadata: Metadata = {
  title: "Releases",
  description: "The full Fever LTD catalog — every record, newest first.",
};

export default async function ReleasesPage() {
  let releases: ReleaseWithArtists[] = [];

  try {
    releases = await getAllReleases();
  } catch {
    // DB empty or unreachable — the adapter falls through to curated content.
  }

  // Real rows with covers, else the curated catalog (newest = red feature).
  const cards = releasesFrom(releases);

  return (
    <PressShell>
      <PressPageHead
        kicker="Catalog"
        title={
          <>
            Every <Outline>Release</Outline>
          </>
        }
        lede="Everything we've put into the world, newest first. Limited pressings — when they're gone, they're gone."
      />

      <section className="py-[60px] max-[560px]:py-10">
        <div className={WRAP}>
          <div className="grid grid-cols-4 gap-4 max-[1040px]:grid-cols-3 max-[680px]:grid-cols-2">
            {cards.map((release) => (
              <PressReleaseCard key={release.slug} release={release} />
            ))}
          </div>
        </div>
      </section>
    </PressShell>
  );
}
