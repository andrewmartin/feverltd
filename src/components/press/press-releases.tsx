"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { PressSectionHead, Outline } from "./section-head";
import type { PressRelease } from "./press-content";

const WRAP = "mx-auto w-full max-w-[1280px] px-[34px] max-[560px]:px-5";
const STEP = 4;
const INITIAL = 4;

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

/** Gallery-placard release grid with a Load More reveal (newest = red feature). */
export function PressReleases({ releases }: { releases: PressRelease[] }) {
  const [shown, setShown] = useState(INITIAL);
  const hidden = Math.max(0, releases.length - shown);

  return (
    <section className="py-[70px]" id="releases">
      <div className={WRAP}>
        <PressSectionHead kicker="(02) — Catalog" href="/releases" label="All releases →">
          Latest <Outline>Releases</Outline>
          <span className="text-fever">.</span>
        </PressSectionHead>
      </div>
      <div className={cn(WRAP, "mt-[34px]")}>
        <div className="grid grid-cols-4 gap-4 max-[1040px]:grid-cols-3 max-[680px]:grid-cols-2">
          {releases.map((r, k) => {
            const feat = !!r.featured;
            return (
              <Link
                key={r.slug}
                href={`/releases/${r.slug}`}
                className={cn(
                  "group flex flex-col border border-hair bg-surface transition-[border-color,transform,box-shadow] hover:-translate-y-1 hover:border-ink hover:[box-shadow:0_22px_40px_-28px_rgba(0,0,0,0.5)]",
                  k >= shown && "hidden",
                )}
              >
                <div className="relative aspect-square overflow-hidden border-b border-hair bg-black">
                  {/* eslint-disable-next-line @next/next/no-img-element -- mixed local/blob hosts */}
                  <img
                    src={r.cover}
                    alt={`${r.title} cover`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[600ms] group-hover:scale-105"
                  />
                  {feat ? (
                    <span className="absolute left-2.5 top-2.5 z-[2] bg-fever px-[9px] py-1 font-press text-[9px] uppercase tracking-[0.2em] text-white">
                      New
                    </span>
                  ) : null}
                  {r.format ? (
                    <span className="absolute right-2.5 top-2.5 z-[2] border border-[rgba(244,239,230,0.28)] bg-[rgba(8,7,6,0.62)] px-2 py-1 font-press text-[9px] uppercase tracking-[0.18em] text-[#f4efe6]">
                      {r.format}
                    </span>
                  ) : null}
                </div>
                <div
                  className={cn(
                    "flex flex-1 flex-col px-[15px] pb-4 pt-3.5",
                    feat && "bg-fever",
                  )}
                >
                  <div
                    className={cn(
                      "mb-[7px] font-press text-[10px] uppercase tracking-[0.16em]",
                      feat ? "text-white/[0.78]" : "text-quiet",
                    )}
                  >
                    {r.artist}
                  </div>
                  <div
                    className={cn(
                      "font-disp text-[18px] font-bold uppercase leading-[0.96] tracking-[0.005em]",
                      feat ? "text-white" : "text-ink",
                    )}
                  >
                    {r.title}
                  </div>
                  <div className="mt-3.5 flex items-center justify-between gap-2.5">
                    <span
                      className={cn(
                        "inline-flex items-center gap-[7px] font-press text-[10px] uppercase tracking-[0.16em]",
                        feat ? "text-white/[0.82]" : "text-quiet",
                      )}
                    >
                      <Cal
                        className={cn(
                          "h-[11px] w-[11px] shrink-0 transition-colors",
                          feat
                            ? "text-white/[0.85] group-hover:text-white"
                            : "text-quiet group-hover:text-fever",
                        )}
                      />
                      {r.date}
                    </span>
                    <span
                      className={cn(
                        "-translate-x-1 whitespace-nowrap font-press text-[10px] uppercase tracking-[0.16em] opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100",
                        feat
                          ? "text-white/[0.72] group-hover:text-white"
                          : "text-quiet group-hover:text-ink",
                      )}
                    >
                      View →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
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
      </div>
    </section>
  );
}
