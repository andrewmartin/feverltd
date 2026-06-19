import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDuration } from "@/lib/utils";
import { getReleaseWithTracks, listArtistOptions } from "@/lib/cms";
import { ReleaseForm } from "@/components/admin/release-form";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteRelease } from "@/app/admin/actions";

export const metadata = { title: "Edit release — Fever Ltd CMS" };

export default async function EditReleasePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [release, artists] = await Promise.all([
    getReleaseWithTracks(id),
    listArtistOptions(),
  ]);
  if (!release) notFound();

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <Link
            href="/admin/releases"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Releases
          </Link>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">{release.title}</h1>
        </div>
        <DeleteButton
          id={release.id}
          label={release.title}
          action={deleteRelease}
          redirectTo="/admin/releases"
        />
      </header>

      <ReleaseForm artists={artists} release={release} />

      {release.tracks.length > 0 ? (
        <section className="max-w-2xl">
          <h2 className="mb-2 text-sm font-semibold text-muted-foreground">
            Tracklist
          </h2>
          <ol className="divide-y divide-border overflow-hidden rounded-lg border border-border">
            {release.tracks.map((track) => (
              <li
                key={track.id}
                className="flex items-center justify-between gap-4 bg-muted/10 px-4 py-2.5 text-sm"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className="w-6 shrink-0 text-right font-mono text-xs text-muted-foreground">
                    {track.position}
                  </span>
                  <span className="truncate">{track.title}</span>
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {formatDuration(track.duration)}
                </span>
              </li>
            ))}
          </ol>
        </section>
      ) : null}
    </div>
  );
}
