"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { HeroArtist } from "./press-content";

const WRAP = "mx-auto w-full max-w-[1280px] px-[34px] max-[560px]:px-5";
const pad = (n: number) => (n < 10 ? "0" : "") + n;

/** Rotating artist hero — split stage (press photo + meta placard). */
export function PressHero({ artists }: { artists: HeroArtist[] }) {
  const [i, setI] = useState(0);
  const total = artists.length;
  const paused = useRef(false);

  const go = (n: number) => setI(((n % total) + total) % total);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!paused.current) setI((p) => (p + 1) % total);
    }, 6000);
    return () => clearInterval(timer);
  }, [total]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(i + 1);
      if (e.key === "ArrowLeft") go(i - 1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });

  const a = artists[i];

  return (
    <section className="pb-[60px] pt-[52px]">
      <div className={WRAP}>
        <div className="mb-5 flex items-end justify-between gap-[18px] max-[560px]:flex-col max-[560px]:items-start max-[560px]:gap-3">
          <span className="font-press text-[11px] uppercase tracking-[0.26em] text-fever">
            (01) — Artists
          </span>
          <div className="whitespace-nowrap font-press text-[13px] tracking-[0.12em] text-quiet">
            <b className="font-bold text-ink">{pad(i + 1)}</b>
            <span className="px-1.5 opacity-60">/</span>
            <span className="opacity-60">{pad(total)}</span>
          </div>
        </div>

        <div
          className="grid grid-cols-[1.62fr_0.9fr] border border-rule bg-surface max-[900px]:grid-cols-1"
          onMouseEnter={() => (paused.current = true)}
          onMouseLeave={() => (paused.current = false)}
        >
          <div className="relative aspect-[16/11] overflow-hidden bg-black max-[900px]:aspect-[4/3]">
            <div className="absolute inset-0">
              {artists.map((art, k) => (
                <div
                  key={art.slug}
                  className={cn(
                    "absolute inset-0 transition-opacity duration-700",
                    k === i ? "opacity-100" : "pointer-events-none opacity-0",
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- mixed local/blob hosts */}
                  <img
                    src={art.photo}
                    alt={art.name}
                    className={cn(
                      "h-full w-full object-cover [filter:saturate(1.02)_contrast(1.03)]",
                      k === i && "animate-rise",
                    )}
                  />
                </div>
              ))}
            </div>
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(8,7,6,0.82)_0%,rgba(8,7,6,0.25)_42%,rgba(8,7,6,0)_70%)]" />
            <div className="absolute left-4 top-4 z-[3] flex items-center gap-2 font-press text-[10px] uppercase tracking-[0.2em] text-[#f4efe6]">
              <span className="h-[7px] w-[7px] animate-pulse-led rounded-full bg-fever [box-shadow:0_0_10px_1px_var(--glow)]" />
              On the label
            </div>
            <div className="absolute inset-x-0 bottom-0 z-[3] px-7 py-[26px]">
              <span className="font-press text-[11px] tracking-[0.18em] text-[#e8c8c5]">
                {pad(i + 1)} — {pad(total)}
              </span>
              <h1 className="mt-1.5 text-balance font-disp text-[clamp(40px,7.2vw,104px)] font-extrabold uppercase leading-[0.84] tracking-[-0.01em] text-[#fbf8f1]">
                {a.name}
                <span className="text-fever">.</span>
              </h1>
            </div>
          </div>

          <aside className="relative flex flex-col overflow-hidden border-l border-rule px-[30px] py-[34px] max-[900px]:border-l-0 max-[900px]:border-t">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(125%_105%_at_100%_112%,rgba(198,53,47,0.2)_0%,rgba(198,53,47,0.07)_38%,transparent_70%),linear-gradient(135deg,transparent_52%,rgba(22,23,26,0.05)_100%)] pdark:bg-[radial-gradient(125%_105%_at_100%_112%,rgba(198,53,47,0.36)_0%,rgba(198,53,47,0.12)_40%,transparent_72%),linear-gradient(135deg,transparent_52%,rgba(255,255,255,0.045)_100%)]"
            />
            <dl className="relative z-[1] mb-[18px] mt-auto grid grid-cols-[auto_1fr] gap-x-[18px] gap-y-[9px]">
              {a.loc ? (
                <>
                  <dt className="self-center font-press text-[10px] uppercase tracking-[0.18em] text-quiet">
                    Based
                  </dt>
                  <dd className="font-editorial text-[16px] italic text-ink">{a.loc}</dd>
                </>
              ) : null}
              {a.genre ? (
                <>
                  <dt className="self-center font-press text-[10px] uppercase tracking-[0.18em] text-quiet">
                    Sound
                  </dt>
                  <dd className="font-editorial text-[16px] italic text-ink">{a.genre}</dd>
                </>
              ) : null}
            </dl>
            {a.bio ? (
              <p className="relative z-[1] mb-[26px] max-w-[36ch] font-editorial text-[13.5px] leading-[1.5] text-quiet">
                {a.bio}
              </p>
            ) : null}
            <div className="relative z-[1] flex items-center gap-3.5">
              <Link
                href={`/artists/${a.slug}`}
                className="inline-flex items-center gap-[9px] bg-fever px-[18px] py-[13px] font-press text-[11px] uppercase tracking-[0.18em] text-white transition hover:-translate-y-px hover:[box-shadow:0_0_24px_-3px_var(--glow)]"
              >
                <span className="h-0 w-0 border-y-[5px] border-l-[7px] border-y-transparent border-l-white" />
                Listen
              </Link>
            </div>
          </aside>
        </div>

        <div className="mt-[18px] flex items-center justify-between">
          <div className="flex items-center gap-[9px]">
            {artists.map((art, k) => (
              <button
                key={art.slug}
                aria-label={`Go to slide ${k + 1}`}
                onClick={() => go(k)}
                className={cn(
                  "h-0.5 w-8 cursor-pointer border-0 p-0 transition",
                  k === i ? "bg-ink" : "bg-hair",
                )}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => go(i - 1)}
              aria-label="Previous"
              className="flex h-11 w-11 cursor-pointer items-center justify-center border border-rule bg-transparent text-ink transition hover:border-fever hover:bg-fever hover:text-white"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4">
                <path d="M15 5l-7 7 7 7" />
              </svg>
            </button>
            <button
              onClick={() => go(i + 1)}
              aria-label="Next"
              className="flex h-11 w-11 cursor-pointer items-center justify-center border border-rule bg-transparent text-ink transition hover:border-fever hover:bg-fever hover:text-white"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
