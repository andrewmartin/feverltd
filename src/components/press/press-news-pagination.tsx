import Link from "next/link";
import { cn } from "@/lib/utils";

/** `/news` for page 1 (canonical), `/news?page=N` otherwise. */
function hrefFor(page: number) {
  return page <= 1 ? "/news" : `/news?page=${page}`;
}

/** Page numbers with ellipsis: first, last, and a ±1 window around current. */
function pageList(current: number, total: number): (number | "ellipsis")[] {
  const out: (number | "ellipsis")[] = [];
  const window = 1;
  for (let p = 1; p <= total; p++) {
    if (p === 1 || p === total || (p >= current - window && p <= current + window)) {
      out.push(p);
    } else if (out[out.length - 1] !== "ellipsis") {
      out.push("ellipsis");
    }
  }
  return out;
}

const BOX =
  "inline-flex h-[38px] min-w-[38px] items-center justify-center border px-3 font-press text-[11px] uppercase tracking-[0.18em] transition";

/** Ruled, mono page navigation matching the Pressroom Load More button. */
export function PressNewsPagination({
  current,
  totalPages,
}: {
  current: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;

  const pages = pageList(current, totalPages);
  const atStart = current <= 1;
  const atEnd = current >= totalPages;

  return (
    <nav
      aria-label="News pagination"
      className="mt-[40px] flex flex-wrap items-center justify-center gap-2"
    >
      {atStart ? (
        <span
          aria-disabled="true"
          className={cn(BOX, "border-rule text-quiet opacity-40")}
        >
          ← Prev
        </span>
      ) : (
        <Link
          href={hrefFor(current - 1)}
          rel="prev"
          className={cn(BOX, "border-rule text-ink hover:bg-ink hover:text-canvas")}
        >
          ← Prev
        </Link>
      )}

      {pages.map((p, i) =>
        p === "ellipsis" ? (
          <span
            key={`gap-${i}`}
            className="px-1 font-press text-[11px] tracking-[0.18em] text-quiet"
          >
            …
          </span>
        ) : p === current ? (
          <span
            key={p}
            aria-current="page"
            className={cn(BOX, "border-fever bg-fever text-white")}
          >
            {p}
          </span>
        ) : (
          <Link
            key={p}
            href={hrefFor(p)}
            className={cn(BOX, "border-rule text-ink hover:bg-ink hover:text-canvas")}
          >
            {p}
          </Link>
        ),
      )}

      {atEnd ? (
        <span
          aria-disabled="true"
          className={cn(BOX, "border-rule text-quiet opacity-40")}
        >
          Next →
        </span>
      ) : (
        <Link
          href={hrefFor(current + 1)}
          rel="next"
          className={cn(BOX, "border-rule text-ink hover:bg-ink hover:text-canvas")}
        >
          Next →
        </Link>
      )}
    </nav>
  );
}
