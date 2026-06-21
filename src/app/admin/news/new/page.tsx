import { NewsForm } from "@/components/admin/news-form";
import { EditHeader } from "@/components/admin/edit-header";

export const metadata = { title: "New post" };

export default function NewNewsPage() {
  return (
    <div className="flex flex-col gap-6">
      <EditHeader backHref="/admin/news" backLabel="News" title="New post" />
      <NewsForm />
    </div>
  );
}
