import { ArtistForm } from "@/components/admin/artist-form";
import { EditHeader } from "@/components/admin/edit-header";

export const metadata = { title: "New artist" };

export default function NewArtistPage() {
  return (
    <div className="flex flex-col gap-6">
      <EditHeader
        backHref="/admin/artists"
        backLabel="Artists"
        title="New artist"
      />
      <ArtistForm />
    </div>
  );
}
