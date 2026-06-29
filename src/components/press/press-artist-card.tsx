import Link from "next/link";

/** Props for a single roster placard. */
export type PressArtistCardProps = {
  name: string;
  slug: string;
  photo?: string;
  loc?: string;
  genre?: string;
  /** Formerly signed but no longer on the label — surfaced as an "Alumni" label. */
  alumni?: boolean;
  /** Zero-based index, for the numbered kicker. */
  index: number;
};

const pad = (n: number) => (n < 10 ? "0" : "") + n;

/**
 * A gallery placard for one artist on the roster — press photo with a dark
 * vignette + caption, echoing the homepage hero/release card treatment.
 * Photo overlays intentionally stay dark in both schemes for caption contrast.
 */
export function PressArtistCard({
  name,
  slug,
  photo,
  loc,
  genre,
  alumni,
  index,
}: PressArtistCardProps) {
  return (
    <Link
      href={`/artists/${slug}`}
      className="group flex flex-col border border-hair bg-surface transition-[border-color,transform,box-shadow] hover:-translate-y-1 hover:border-ink hover:[box-shadow:0_22px_40px_-28px_rgba(0,0,0,0.5)]"
    >
      <div className="relative aspect-[4/5] overflow-hidden border-b border-hair bg-black">
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element -- mixed local/blob hosts
          <img
            src={photo}
            alt={name}
            loading="lazy"
            className="h-full w-full object-cover [filter:saturate(1.02)_contrast(1.03)] transition-transform duration-[600ms] group-hover:scale-105"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center font-disp text-[64px] font-extrabold uppercase text-[#3a3733]">
            {name.charAt(0)}
          </span>
        )}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(8,7,6,0.82)_0%,rgba(8,7,6,0.2)_46%,rgba(8,7,6,0)_72%)]" />
        <span className="absolute left-3 top-3 z-[2] font-press text-[10px] uppercase tracking-[0.2em] text-[#e8c8c5]">
          {pad(index + 1)}
        </span>
        <span className="absolute right-3 top-3 z-[2] flex items-center gap-1.5 font-press text-[9px] uppercase tracking-[0.18em] text-[#f4efe6]">
          {alumni ? (
            <>
              <span className="h-[6px] w-[6px] rounded-full bg-[#e6ddd0]/70" />
              Alumni
            </>
          ) : (
            <>
              <span className="h-[6px] w-[6px] animate-pulse-led rounded-full bg-fever [box-shadow:0_0_8px_1px_var(--glow)]" />
              On the label
            </>
          )}
        </span>
        <div className="absolute inset-x-0 bottom-0 z-[2] px-4 pb-[18px]">
          <h2 className="text-balance font-disp text-[clamp(24px,3.4vw,34px)] font-extrabold uppercase leading-[0.9] tracking-[-0.01em] text-[#fbf8f1]">
            {name}
            <span className="text-fever">.</span>
          </h2>
        </div>
      </div>
      <div className="flex flex-1 flex-col px-4 pb-4 pt-3.5">
        <dl className="grid grid-cols-[auto_1fr] gap-x-3.5 gap-y-1.5">
          {loc ? (
            <>
              <dt className="self-center font-press text-[9px] uppercase tracking-[0.18em] text-quiet">
                Based
              </dt>
              <dd className="truncate font-editorial text-[14px] italic text-ink">
                {loc}
              </dd>
            </>
          ) : null}
          {genre ? (
            <>
              <dt className="self-center font-press text-[9px] uppercase tracking-[0.18em] text-quiet">
                Sound
              </dt>
              <dd className="truncate font-editorial text-[14px] italic text-ink">
                {genre}
              </dd>
            </>
          ) : null}
        </dl>
        <span className="mt-3.5 font-press text-[10px] uppercase tracking-[0.16em] text-quiet transition-colors group-hover:text-ink">
          Profile →
        </span>
      </div>
    </Link>
  );
}
