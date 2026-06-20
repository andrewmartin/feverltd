import Link from "next/link";
import { getCmsStats } from "@/lib/cms";
import { StatusBadge } from "@/components/admin/status-badge";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = { title: "Dashboard" };

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <CardContent>
        <div className="text-3xl font-bold tabular-nums">{value}</div>
        <div className="text-muted-foreground mt-1 text-sm">{label}</div>
      </CardContent>
    </Card>
  );
}

export default async function AdminDashboardPage() {
  const { artistCount, releaseCount, publishedCount, newsCount, recentReleases } =
    await getCmsStats();

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Overview of the Fever Ltd catalog.
        </p>
      </header>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Artists" value={artistCount} />
        <StatCard label="Total releases" value={releaseCount} />
        <StatCard label="Published" value={publishedCount} />
        <StatCard label="News posts" value={newsCount} />
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent releases</h2>
          <Link
            href="/admin/releases"
            className="text-primary text-sm hover:underline"
          >
            View all
          </Link>
        </div>

        {recentReleases.length === 0 ? (
          <p className="text-muted-foreground rounded-lg border border-dashed p-8 text-center text-sm">
            No releases yet.{" "}
            <Link href="/admin/releases/new" className="text-primary hover:underline">
              Create one
            </Link>
            .
          </p>
        ) : (
          <ul className="divide-y overflow-hidden rounded-lg border">
            {recentReleases.map((release) => (
              <li key={release.id}>
                <Link
                  href={`/admin/releases/${release.id}`}
                  className="bg-card hover:bg-muted/50 flex items-center justify-between gap-4 px-4 py-3 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="truncate font-medium">{release.title}</div>
                    <div className="text-muted-foreground truncate text-sm">
                      {release.artists.map((a) => a.name).join(", ") || "—"}
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
