import { notFound } from "next/navigation";
import { Trash2Icon } from "lucide-react";
import { getNewsPost } from "@/lib/cms";
import { NewsForm } from "@/components/admin/news-form";
import { EditHeader } from "@/components/admin/edit-header";
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
      <EditHeader
        backHref="/admin/news"
        backLabel="News"
        title={post.title}
        viewHref={`/news/${post.slug}`}
        action={
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
        }
      />
      <NewsForm post={post} />
    </div>
  );
}
