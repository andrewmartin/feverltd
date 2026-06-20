import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/** Works for both ReleaseStatus and PostStatus (DRAFT | PUBLISHED). */
export function StatusBadge({ status }: { status: "DRAFT" | "PUBLISHED" }) {
  const published = status === "PUBLISHED";
  return (
    <Badge
      variant={published ? "default" : "secondary"}
      className={cn(!published && "text-muted-foreground")}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          published ? "bg-primary-foreground" : "bg-muted-foreground",
        )}
      />
      {published ? "Published" : "Draft"}
    </Badge>
  );
}
