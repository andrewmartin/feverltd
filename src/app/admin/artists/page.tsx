import Link from "next/link";
import { listArtists } from "@/lib/cms";
import { Button } from "@/components/admin/ui";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteArtist } from "@/app/admin/actions";

export const metadata = { title: "Artists — Fever Ltd CMS" };

export default async function ArtistsPage() {
  const artists = await listArtists();

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Artists</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {artists.length} {artists.length === 1 ? "artist" : "artists"}
          </p>
        </div>
        <Link href="/admin/artists/new">
          <Button>New artist</Button>
        </Link>
      </header>

      {artists.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          No artists yet.{" "}
          <Link href="/admin/artists/new" className="text-accent hover:underline">
            Add the first one
          </Link>
          .
        </p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium">Releases</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {artists.map((artist) => (
                <tr key={artist.id} className="bg-muted/10 hover:bg-muted/20">
                  <td className="px-4 py-3 font-medium">
                    <Link
                      href={`/admin/artists/${artist.id}`}
                      className="hover:text-accent"
                    >
                      {artist.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    {artist.slug}
                  </td>
                  <td className="px-4 py-3 tabular-nums text-muted-foreground">
                    {artist._count.releases}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/artists/${artist.id}`}>
                        <Button variant="secondary">Edit</Button>
                      </Link>
                      <DeleteButton
                        id={artist.id}
                        label={artist.name}
                        action={deleteArtist}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
