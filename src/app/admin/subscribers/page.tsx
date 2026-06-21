import { DownloadIcon } from "lucide-react";
import { listSubscribers, getSubscriberStats } from "@/lib/newsletter";
import { buttonVariants } from "@/components/ui/button";
import { PageHeader } from "@/components/admin/page-header";
import { SubscribersTable } from "@/components/admin/subscribers-table";
import type { SerializedSubscriber } from "@/lib/admin-queries";

export const metadata = { title: "Subscribers" };

export default async function SubscribersPage() {
  // Server-render the first paint; React Query hydrates + keeps it fresh.
  const [subscribers, stats] = await Promise.all([
    listSubscribers() as unknown as Promise<SerializedSubscriber[]>,
    getSubscriberStats(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        kicker="Newsletter"
        title="Subscribers"
        description={`${stats.total} total · ${stats.subscribed} subscribed · ${stats.unsubscribed} unsubscribed`}
        action={
          <a
            href="/api/admin/subscribers/export"
            download
            className={buttonVariants({ variant: "outline" })}
          >
            <DownloadIcon />
            Export CSV
          </a>
        }
      />
      <SubscribersTable initialData={subscribers} />
    </div>
  );
}
