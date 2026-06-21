import Link from "next/link";
import { cn } from "@/lib/utils";
import type { PressNewsItem } from "./press-content";

/**
 * A single dispatch card — 16:10 thumb, mono dateline, display headline,
 * serif excerpt, hover lift. Shared by the homepage `PressNews` three-up and
 * the `/news` archive grid so both read as one design.
 */
export function PressNewsCard({
  item: n,
  className,
}: {
  item: PressNewsItem;
  className?: string;
}) {
  return (
    <Link
      href={`/news/${n.slug}`}
      className={cn(
        "group flex h-full flex-col border border-hair bg-surface transition-[border-color,transform] hover:-translate-y-1 hover:border-ink",
        className,
      )}
    >
      <div className="aspect-[16/10] overflow-hidden border-b border-hair bg-black">
        {/* eslint-disable-next-line @next/next/no-img-element -- mixed local/blob hosts */}
        <img
          src={n.thumb}
          alt={n.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col px-[22px] pb-[26px] pt-[22px]">
        <div className="mb-3 font-disp text-[22px] font-bold uppercase leading-[0.98] tracking-[0.005em]">
          {n.title}
        </div>
        <p className="flex-1 font-editorial text-[15px] leading-[1.55] text-quiet">
          {n.excerpt}
        </p>
        <span className="mt-[18px] font-press text-[10px] uppercase tracking-[0.16em] text-quiet transition-colors group-hover:text-ink">
          Read →
        </span>
      </div>
    </Link>
  );
}
