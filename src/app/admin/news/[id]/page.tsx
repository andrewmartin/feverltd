import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, Trash2Icon } from "lucide-react";
import { getNewsPost } from "@/lib/cms";
import { NewsForm } from "@/components/admin/news-form";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import { Button } from "@/components/ui/button";
import { deleteNews } from "@/app/admin/actions";

export const metadata = { title: "Edit post" };

export default async function EditNewsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getNewsPost(id);
  if (!post) notFound();

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <Link
            href="/admin/news"
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm"
          >
            <ArrowLeftIcon className="size-3.5" />
            News
          </Link>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">
            {post.title}
          </h1>
        </div>
        <DeleteDialog
          kind="post"
          name={post.title}
          onConfirm={deleteNews.bind(null, post.id)}
          redirectTo="/admin/news"
          trigger={
            <Button variant="destructive">
              <Trash2Icon />
              Delete
            </Button>
          }
        />
      </header>
      <NewsForm post={post} />
    </div>
  );
}
