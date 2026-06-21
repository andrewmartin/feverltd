import Link from "next/link";
import { getCmsStats } from "@/lib/cms";
import { StatusBadge } from "@/components/admin/status-badge";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = { title: "Dashboard" };

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <CardContent>
        <div className="font-disp text-5xl font-extrabold tabular-nums leading-none">
          {value}
        </div>
        <div className="text-muted-foreground mt-2 font-press text-[11px] uppercase tracking-[0.16em]">
          {label}
        </div>
      </CardContent>
    </Card>
  );
}

export default async function AdminDashboardPage() {
  const {
    artistCount,
    releaseCount,
    publishedCount,
    newsCount,
    subscriberCount,
    recentReleases,
  } = await getCmsStats();

  return (
    <div className="flex flex-col gap-8">
      <header className="border-b-2 border-foreground pb-4">
        <span className="font-press text-[11px] uppercase tracking-[0.24em] text-primary">
          Overview
        </span>
        <h1 className="font-disp text-4xl font-extrabold uppercase leading-[0.9] tracking-tight">
          Dashboard<span className="text-primary">.</span>
        </h1>
        <p className="text-muted-foreground mt-1 font-press text-xs uppercase tracking-wider">
          The Fever Ltd catalog at a glance
        </p>
      </header>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard label="Artists" value={artistCount} />
        <StatCard label="Total releases" value={releaseCount} />
        <StatCard label="Published" value={publishedCount} />
        <StatCard label="News posts" value={newsCount} />
        <StatCard label="Subscribers" value={subscriberCount} />
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <h2 className="font-disp text-xl font-bold uppercase tracking-tight">
            Recent releases
          </h2>
          <Link
            href="/admin/releases"
            className="text-primary font-press text-[11px] uppercase tracking-[0.16em] hover:underline"
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
