import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { listArtists } from "@/lib/cms";
import { buttonVariants } from "@/components/ui/button";
import { PageHeader } from "@/components/admin/page-header";
import { ArtistsTable } from "@/components/admin/artists-table";
import type { SerializedArtist } from "@/lib/admin-queries";

export const metadata = { title: "Artists" };

export default async function ArtistsPage() {
  // Server-render the first paint; React Query hydrates + keeps it fresh.
  const artists = (await listArtists()) as unknown as SerializedArtist[];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        kicker="Roster"
        title="Artists"
        description={`${artists.length} ${artists.length === 1 ? "artist" : "artists"}`}
        action={
          <Link href="/admin/artists/new" className={buttonVariants()}>
            <PlusIcon />
            New artist
          </Link>
        }
      />
      <ArtistsTable initialData={artists} />
    </div>
  );
}
