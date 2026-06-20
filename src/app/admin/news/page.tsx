import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { listNews } from "@/lib/cms";
import { buttonVariants } from "@/components/ui/button";
import { PageHeader } from "@/components/admin/page-header";
import { NewsTable } from "@/components/admin/news-table";
import type { SerializedNews } from "@/lib/admin-queries";

export const metadata = { title: "News" };

export default async function NewsPage() {
  // Server-render the first paint; React Query hydrates + keeps it fresh.
  const posts = (await listNews()) as unknown as SerializedNews[];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="News"
        description={`${posts.length} ${posts.length === 1 ? "post" : "posts"}`}
        action={
          <Link href="/admin/news/new" className={buttonVariants()}>
            <PlusIcon />
            New post
          </Link>
        }
      />
      <NewsTable initialData={posts} />
    </div>
  );
}
