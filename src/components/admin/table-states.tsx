"use client";

import Link from "next/link";
import { buttonVariants, Button } from "@/components/ui/button";

export function EmptyState({
  title,
  description,
  cta,
}: {
  title: string;
  description?: string;
  cta?: { href: string; label: string };
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed p-12 text-center">
      <p className="font-medium">{title}</p>
      {description ? (
        <p className="text-muted-foreground text-sm">{description}</p>
      ) : null}
      {cta ? (
        <Link href={cta.href} className={buttonVariants({ size: "sm" })}>
          {cta.label}
        </Link>
      ) : null}
    </div>
  );
}

export function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="border-destructive/30 bg-destructive/5 flex flex-col items-center gap-3 rounded-lg border p-12 text-center">
      <p className="text-destructive font-medium">Couldn’t load this list</p>
      <p className="text-muted-foreground text-sm">
        Something went wrong fetching the data.
      </p>
      {onRetry ? (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  );
}
