import { notFound } from "next/navigation";
import { Trash2Icon } from "lucide-react";
import { getReleaseWithTracks, listArtistOptions } from "@/lib/cms";
import { ReleaseForm } from "@/components/admin/release-form";
import { EditHeader } from "@/components/admin/edit-header";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import { Button } from "@/components/ui/button";
import { deleteRelease } from "@/app/admin/actions";

export const metadata = { title: "Edit release" };

export default async function EditReleasePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const release = await getReleaseWithTracks(id);
  if (!release) notFound();
  const artists = await listArtistOptions();

  return (
    <div className="flex flex-col gap-6">
      <EditHeader
        backHref="/admin/releases"
        backLabel="Releases"
        title={release.title}
        viewHref={`/releases/${release.slug}`}
        action={
          <DeleteDialog
            kind="release"
            name={release.title}
            onConfirm={deleteRelease.bind(null, release.id)}
            redirectTo="/admin/releases"
            trigger={
              <Button variant="destructive">
                <Trash2Icon />
                Delete
              </Button>
            }
          />
        }
      />
      <ReleaseForm artists={artists} release={release} />
    </div>
  );
}
