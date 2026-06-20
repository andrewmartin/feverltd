import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { NewsForm } from "@/components/admin/news-form";

export const metadata = { title: "New post" };

export default function NewNewsPage() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <Link
          href="/admin/news"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm"
        >
          <ArrowLeftIcon className="size-3.5" />
          News
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">New post</h1>
      </header>
      <NewsForm />
    </div>
  );
}
