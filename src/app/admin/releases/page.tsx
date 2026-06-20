import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { listReleases } from "@/lib/cms";
import { buttonVariants } from "@/components/ui/button";
import { PageHeader } from "@/components/admin/page-header";
import { ReleasesTable } from "@/components/admin/releases-table";
import type { SerializedRelease } from "@/lib/admin-queries";

export const metadata = { title: "Releases" };

export default async function ReleasesPage() {
  // Server-render the first paint; React Query hydrates + keeps it fresh.
  const releases = (await listReleases()) as unknown as SerializedRelease[];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Releases"
        description={`${releases.length} ${releases.length === 1 ? "release" : "releases"}`}
        action={
          <Link href="/admin/releases/new" className={buttonVariants()}>
            <PlusIcon />
            New release
          </Link>
        }
      />
      <ReleasesTable initialData={releases} />
    </div>
  );
}
