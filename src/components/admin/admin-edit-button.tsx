import Link from "next/link";
import { PencilIcon } from "lucide-react";
import { getAdminSession } from "@/auth";

type AdminEditButtonProps = {
  /** Which admin collection to edit. */
  kind: "releases" | "artists" | "news";
  /** The record's database id (the admin edit route is keyed by id). */
  id: string;
};

/**
 * Floating "Edit" affordance shown on public content pages. Renders only for
 * logged-in admins and links straight to the matching admin edit view.
 */
export async function AdminEditButton({ kind, id }: AdminEditButtonProps) {
  const session = await getAdminSession();
  if (!session) return null;

  return (
    <Link
      href={`/admin/${kind}/${id}`}
      className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 border border-fever bg-fever px-5 py-3 font-press text-[11px] uppercase tracking-[0.2em] text-black shadow-[0_18px_40px_-18px_rgba(0,0,0,0.7)] transition-colors hover:bg-transparent hover:text-fever"
    >
      <PencilIcon className="h-3.5 w-3.5" />
      Edit
    </Link>
  );
}
