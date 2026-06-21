import { PressNewsCard } from "./press-news-card";
import type { PressNewsItem } from "./press-content";

/** Static 3-up dispatch grid (no reveal) — used by the paginated archive. */
export function PressNewsGrid({ items }: { items: PressNewsItem[] }) {
  return (
    <div className="grid grid-cols-3 gap-4 max-[900px]:grid-cols-2 max-[640px]:grid-cols-1">
      {items.map((n) => (
        <PressNewsCard key={n.slug} item={n} />
      ))}
    </div>
  );
}
