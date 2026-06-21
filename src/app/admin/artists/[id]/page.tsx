import { notFound } from "next/navigation";
import { Trash2Icon } from "lucide-react";
import { getArtist } from "@/lib/cms";
import { ArtistForm } from "@/components/admin/artist-form";
import { EditHeader } from "@/components/admin/edit-header";
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
      <EditHeader
        backHref="/admin/artists"
        backLabel="Artists"
        title={artist.name}
        viewHref={`/artists/${artist.slug}`}
        action={
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
        }
      />
      <ArtistForm artist={artist} />
    </div>
  );
}
