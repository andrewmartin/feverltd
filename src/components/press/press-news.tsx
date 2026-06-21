import { PressSectionHead, Outline } from "./section-head";
import { PressNewsCard } from "./press-news-card";
import type { PressNewsItem } from "./press-content";

const WRAP = "mx-auto w-full max-w-[1280px] px-[34px] max-[560px]:px-5";

/** Three-up dispatch cards. */
export function PressNews({ items }: { items: PressNewsItem[] }) {
  if (items.length === 0) return null;

  return (
    <section className="border-t border-hair py-[70px]" id="news">
      <div className={WRAP}>
        <PressSectionHead kicker="(03) — Dispatches" href="/news" label="All news →">
          <Outline>News</Outline>
          <span className="text-fever">.</span>
        </PressSectionHead>
        <div className="mt-[34px] grid grid-cols-3 gap-4 max-[900px]:grid-cols-1">
          {items.map((n) => (
            <PressNewsCard key={n.slug} item={n} />
          ))}
        </div>
      </div>
    </section>
  );
}
