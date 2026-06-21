import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeftIcon, ExternalLinkIcon } from "lucide-react";

type EditHeaderProps = {
  /** Back link to the list view. */
  backHref: string;
  backLabel: string;
  title: string;
  /** Public-site URL for this record; renders a "View on site" link. */
  viewHref?: string;
  /** Right-aligned slot (e.g. the delete button). */
  action?: ReactNode;
};

/**
 * Shared header for admin edit views — broadsheet back link + display title,
 * a "View on site" link to the live page, and an action slot. Mirrors the
 * Pressroom type language used across the public site.
 */
export function EditHeader({
  backHref,
  backLabel,
  title,
  viewHref,
  action,
}: EditHeaderProps) {
  return (
    <header className="flex items-end justify-between gap-4 border-b-2 border-foreground pb-4">
      <div className="space-y-1">
        <Link
          href={backHref}
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 font-press text-[11px] uppercase tracking-[0.16em] transition-colors"
        >
          <ArrowLeftIcon className="size-3.5" />
          {backLabel}
        </Link>
        <h1 className="font-disp text-3xl font-bold tracking-tight">{title}</h1>
        {viewHref ? (
          <Link
            href={viewHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary inline-flex items-center gap-1.5 font-press text-[11px] uppercase tracking-[0.16em] hover:underline"
          >
            <ExternalLinkIcon className="size-3.5" />
            View on site
          </Link>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}
