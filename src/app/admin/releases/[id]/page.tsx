import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, Trash2Icon } from "lucide-react";
import { getReleaseWithTracks, listArtistOptions } from "@/lib/cms";
import { ReleaseForm } from "@/components/admin/release-form";
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
      <header className="flex items-start justify-between gap-4">
        <div>
          <Link
            href="/admin/releases"
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm"
          >
            <ArrowLeftIcon className="size-3.5" />
            Releases
          </Link>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">
            {release.title}
          </h1>
        </div>
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
      </header>
      <ReleaseForm artists={artists} release={release} />
    </div>
  );
}
