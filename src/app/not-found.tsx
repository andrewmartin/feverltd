import type { Metadata } from "next";
import Link from "next/link";
import { PressShell } from "@/components/press/press-shell";
import { Outline } from "@/components/press/section-head";

const WRAP = "mx-auto w-full max-w-[1280px] px-[34px] max-[560px]:px-5";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you were looking for could not be found.",
};

export default function NotFound() {
  return (
    <PressShell>
      <section className="py-[100px] max-[560px]:py-16">
        <div className={WRAP}>
          <span className="mb-3 inline-block font-press text-[11px] uppercase tracking-[0.26em] text-fever">
            (404) — Off The Press
          </span>

          <h1 className="font-disp text-[clamp(72px,18vw,220px)] font-extrabold uppercase leading-[0.82] tracking-[-0.02em] text-ink">
            Not <Outline>Found</Outline>
          </h1>

          <p className="mt-8 max-w-[44ch] font-editorial text-[clamp(18px,2.4vw,24px)] leading-[1.4] text-quiet">
            This page never made it to print. The link may be broken, or the
            record has been pulled from the catalog.
          </p>

          <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-4 border-t-2 border-rule pt-8">
            <Link
              href="/"
              className="font-press text-[12px] uppercase tracking-[0.26em] text-fever transition-colors hover:text-ink"
            >
              Back Home →
            </Link>
            <Link
              href="/releases"
              className="font-press text-[12px] uppercase tracking-[0.26em] text-quiet transition-colors hover:text-fever"
            >
              Releases →
            </Link>
            <Link
              href="/artists"
              className="font-press text-[12px] uppercase tracking-[0.26em] text-quiet transition-colors hover:text-fever"
            >
              Artists →
            </Link>
          </div>
        </div>
      </section>
    </PressShell>
  );
}
