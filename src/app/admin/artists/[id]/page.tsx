import Link from "next/link";
import { notFound } from "next/navigation";
import { getArtist } from "@/lib/cms";
import { ArtistForm } from "@/components/admin/artist-form";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteArtist } from "@/app/admin/actions";

export const metadata = { title: "Edit artist — Fever Ltd CMS" };

export default async function EditArtistPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const artist = await getArtist(id);
  if (!artist) notFound();

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <Link
            href="/admin/artists"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Artists
          </Link>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">{artist.name}</h1>
        </div>
        <DeleteButton
          id={artist.id}
          label={artist.name}
          action={deleteArtist}
          redirectTo="/admin/artists"
        />
      </header>
      <ArtistForm artist={artist} />
    </div>
  );
}
