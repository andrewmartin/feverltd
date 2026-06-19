import Link from "next/link";
import { listReleases } from "@/lib/cms";
import { Button, StatusBadge } from "@/components/admin/ui";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteRelease } from "@/app/admin/actions";

export const metadata = { title: "Releases — Fever Ltd CMS" };

const dateFmt = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export default async function ReleasesPage() {
  const releases = await listReleases();

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Releases</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {releases.length} {releases.length === 1 ? "release" : "releases"}
          </p>
        </div>
        <Link href="/admin/releases/new">
          <Button>New release</Button>
        </Link>
      </header>

      {releases.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          No releases yet.{" "}
          <Link href="/admin/releases/new" className="text-accent hover:underline">
            Add the first one
          </Link>
          .
        </p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Artist</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {releases.map((release) => (
                <tr key={release.id} className="bg-muted/10 hover:bg-muted/20">
                  <td className="px-4 py-3 font-medium">
                    <Link
                      href={`/admin/releases/${release.id}`}
                      className="hover:text-accent"
                    >
                      {release.title}
                    </Link>
                    {release.catalogNo ? (
                      <span className="ml-2 font-mono text-xs text-muted-foreground">
                        {release.catalogNo}
                      </span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {release.artist.name}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {release.releaseDate ? dateFmt.format(release.releaseDate) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={release.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/releases/${release.id}`}>
                        <Button variant="secondary">Edit</Button>
                      </Link>
                      <DeleteButton
                        id={release.id}
                        label={release.title}
                        action={deleteRelease}
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
