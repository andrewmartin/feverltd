import Link from "next/link";
import type { PressRelease } from "./press-content";

/** Calendar glyph used in the placard footer (matches the homepage gallery). */
function Cal({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      className={className}
    >
      <rect x="3" y="4.5" width="18" height="16.5" rx="2" />
      <path d="M3 9.5h18M8 2.5v4M16 2.5v4" />
    </svg>
  );
}

/**
 * A single gallery-placard release card — square cover, optional format badge,
 * museum-placard caption, hover lift. Identical visual language to the homepage
 * `PressReleases` grid so the catalog reads as one design.
 */
export function PressReleaseCard({ release: r }: { release: PressRelease }) {
  return (
    <Link
      href={`/releases/${r.slug}`}
      className="group flex flex-col border border-hair bg-surface transition-[border-color,transform,box-shadow] hover:-translate-y-1 hover:border-ink hover:[box-shadow:0_22px_40px_-28px_rgba(0,0,0,0.5)]"
    >
      <div className="relative aspect-square overflow-hidden border-b border-hair bg-black">
        {/* eslint-disable-next-line @next/next/no-img-element -- mixed local/blob hosts */}
        <img
          src={r.cover}
          alt={`${r.title} cover`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[600ms] group-hover:scale-105"
        />
        {r.format ? (
          <span className="absolute right-2.5 top-2.5 z-[2] border border-[rgba(244,239,230,0.28)] bg-[rgba(8,7,6,0.62)] px-2 py-1 font-press text-[9px] uppercase tracking-[0.18em] text-[#f4efe6]">
            {r.format}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col px-[15px] pb-4 pt-3.5">
        <div className="mb-[7px] font-press text-[10px] uppercase tracking-[0.16em] text-quiet">
          {r.artist}
        </div>
        <div className="font-disp text-[18px] font-bold uppercase leading-[0.96] tracking-[0.005em] text-ink">
          {r.title}
        </div>
        <div className="mt-3.5 flex items-center justify-between gap-2.5">
          <span className="inline-flex items-center gap-[7px] font-press text-[10px] uppercase tracking-[0.16em] text-quiet">
            {r.date ? (
              <>
                <Cal className="h-[11px] w-[11px] shrink-0 text-quiet transition-colors group-hover:text-fever" />
                {r.date}
              </>
            ) : null}
          </span>
          <span className="-translate-x-1 whitespace-nowrap font-press text-[10px] uppercase tracking-[0.16em] text-quiet opacity-0 transition group-hover:translate-x-0 group-hover:text-ink group-hover:opacity-100">
            View →
          </span>
        </div>
      </div>
    </Link>
  );
}
