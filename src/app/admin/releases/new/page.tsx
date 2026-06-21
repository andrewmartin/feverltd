import { listArtistOptions } from "@/lib/cms";
import { ReleaseForm } from "@/components/admin/release-form";
import { EditHeader } from "@/components/admin/edit-header";

export const metadata = { title: "New release" };

export default async function NewReleasePage() {
  const artists = await listArtistOptions();

  return (
    <div className="flex flex-col gap-6">
      <EditHeader
        backHref="/admin/releases"
        backLabel="Releases"
        title="New release"
      />
      <ReleaseForm artists={artists} />
    </div>
  );
}
