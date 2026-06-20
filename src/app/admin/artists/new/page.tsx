import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { ArtistForm } from "@/components/admin/artist-form";

export const metadata = { title: "New artist" };

export default function NewArtistPage() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <Link
          href="/admin/artists"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm"
        >
          <ArrowLeftIcon className="size-3.5" />
          Artists
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">New artist</h1>
      </header>
      <ArtistForm />
    </div>
  );
}
