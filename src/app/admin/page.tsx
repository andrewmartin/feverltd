import Link from "next/link";
import { getCmsStats } from "@/lib/cms";
import { StatusBadge } from "@/components/admin/ui";

export const metadata = { title: "Dashboard — Fever Ltd CMS" };

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border bg-muted/30 p-5">
      <div className="text-3xl font-bold tabular-nums">{value}</div>
      <div className="mt-1 text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

export default async function AdminDashboardPage() {
  const { artistCount, releaseCount, publishedCount, recentReleases } =
    await getCmsStats();

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Overview of the Fever Ltd catalog.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Artists" value={artistCount} />
        <StatCard label="Total releases" value={releaseCount} />
        <StatCard label="Published" value={publishedCount} />
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent releases</h2>
          <Link
            href="/admin/releases"
            className="text-sm text-accent hover:underline"
          >
            View all
          </Link>
        </div>

        {recentReleases.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            No releases yet.{" "}
            <Link href="/admin/releases/new" className="text-accent hover:underline">
              Create one
            </Link>
            .
          </p>
        ) : (
          <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border">
            {recentReleases.map((release) => (
              <li key={release.id}>
                <Link
                  href={`/admin/releases/${release.id}`}
                  className="flex items-center justify-between gap-4 bg-muted/20 px-4 py-3 transition-colors hover:bg-muted/40"
                >
                  <div className="min-w-0">
                    <div className="truncate font-medium">{release.title}</div>
                    <div className="truncate text-sm text-muted-foreground">
                      {release.artist.name}
                    </div>
                  </div>
                  <StatusBadge status={release.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
