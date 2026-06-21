import type { ReactNode } from "react";

const WRAP = "mx-auto w-full max-w-[1280px] px-[34px] max-[560px]:px-5";

/**
 * Broadsheet page header — numbered kicker, big display headline (with an
 * accent period), and an optional lede. Used at the top of full-page views
 * (catalog, shop) to echo the homepage masthead/section type.
 */
export function PressPageHead({
  kicker,
  title,
  lede,
}: {
  kicker: string;
  title: ReactNode;
  lede?: ReactNode;
}) {
  return (
    <section className="border-b border-hair pb-[46px] pt-[64px] max-[560px]:pt-12">
      <div className={WRAP}>
        <span className="mb-3 inline-block font-press text-[11px] uppercase tracking-[0.26em] text-fever">
          {kicker}
        </span>
        <h1 className="font-disp text-[clamp(46px,9vw,108px)] font-extrabold uppercase leading-[0.84] tracking-[-0.015em]">
          {title}
          <span className="text-fever">.</span>
        </h1>
        {lede ? (
          <p className="mt-6 max-w-[58ch] font-editorial text-[clamp(16px,1.8vw,20px)] leading-relaxed text-quiet">
            {lede}
          </p>
        ) : null}
      </div>
    </section>
  );
}
