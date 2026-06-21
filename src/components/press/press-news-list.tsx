"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { PressNewsCard } from "./press-news-card";
import type { PressNewsItem } from "./press-content";

const INITIAL = 6;
const STEP = 6;

/** The full dispatch archive as a 3-up grid with a Load More reveal. */
export function PressNewsList({ items }: { items: PressNewsItem[] }) {
  const [shown, setShown] = useState(INITIAL);
  const hidden = Math.max(0, items.length - shown);

  return (
    <>
      <div className="grid grid-cols-3 gap-4 max-[900px]:grid-cols-2 max-[640px]:grid-cols-1">
        {items.map((n, k) => (
          <PressNewsCard
            key={n.slug}
            item={n}
            className={cn(k >= shown && "hidden")}
          />
        ))}
      </div>
      {hidden > 0 ? (
        <div className="mt-[26px] flex justify-center">
          <button
            type="button"
            onClick={() => setShown((s) => s + STEP)}
            className="cursor-pointer border border-rule bg-transparent px-[34px] py-[15px] font-press text-[11px] uppercase tracking-[0.2em] text-ink transition hover:bg-ink hover:text-canvas"
          >
            Load more<span className="ml-2 opacity-55">({hidden})</span>
          </button>
        </div>
      ) : null}
    </>
  );
}
