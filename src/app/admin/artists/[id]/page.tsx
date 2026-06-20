import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, Trash2Icon } from "lucide-react";
import { getArtist } from "@/lib/cms";
import { ArtistForm } from "@/components/admin/artist-form";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import { Button } from "@/components/ui/button";
import { deleteArtist } from "@/app/admin/actions";

export const metadata = { title: "Edit artist" };

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
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm"
          >
            <ArrowLeftIcon className="size-3.5" />
            Artists
          </Link>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">{artist.name}</h1>
        </div>
        <DeleteDialog
          kind="artist"
          name={artist.name}
          onConfirm={deleteArtist.bind(null, artist.id)}
          redirectTo="/admin/artists"
          trigger={
            <Button variant="destructive">
              <Trash2Icon />
              Delete
            </Button>
          }
        />
      </header>
      <ArtistForm artist={artist} />
    </div>
  );
}
