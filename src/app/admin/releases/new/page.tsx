import Link from "next/link";
import { listArtistOptions } from "@/lib/cms";
import { ReleaseForm } from "@/components/admin/release-form";

export const metadata = { title: "New release — Fever Ltd CMS" };

export default async function NewReleasePage() {
  const artists = await listArtistOptions();

  return (
    <div className="flex flex-col gap-6">
      <header>
        <Link
          href="/admin/releases"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Releases
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">New release</h1>
      </header>
      <ReleaseForm artists={artists} />
    </div>
  );
}
