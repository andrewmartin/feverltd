import Link from "next/link";
import { ArtistForm } from "@/components/admin/artist-form";

export const metadata = { title: "New artist — Fever Ltd CMS" };

export default function NewArtistPage() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <Link
          href="/admin/artists"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Artists
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">New artist</h1>
      </header>
      <ArtistForm />
    </div>
  );
}
