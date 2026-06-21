import type { Metadata } from "next";
import { PressShell } from "@/components/press/press-shell";
import { PressPageHead } from "@/components/press/press-page-head";
import { Outline } from "@/components/press/section-head";

const WRAP = "mx-auto w-full max-w-[1280px] px-[34px] max-[560px]:px-5";

const CONTACT_EMAIL = "kamtin.mohager@gmail.com";

export const metadata: Metadata = {
  title: "About",
  description: "A noise and culture label based out of Los Angeles, CA.",
};

export default function AboutPage() {
  return (
    <PressShell>
      <PressPageHead
        kicker="(05) — The Label"
        title={
          <>
            About <Outline>Fever</Outline>
          </>
        }
        lede="An independent record label out of Los Angeles. Noise and culture — loud records, pressed properly."
      />

      <section className="py-[60px] max-[560px]:py-10">
        <div className={WRAP}>
          <div className="grid gap-12 md:grid-cols-[1fr_1.8fr] md:items-end">
            <div>
              <span className="font-press text-[11px] uppercase tracking-[0.26em] text-fever">
                Manifesto
              </span>
            </div>

            <div>
              <p className="font-disp text-[clamp(34px,6vw,72px)] font-extrabold uppercase leading-[0.92] tracking-[-0.01em] text-ink">
                A noise and culture label based out of Los Angeles, CA.
              </p>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="mt-10 inline-block font-press text-[12px] uppercase tracking-[0.26em] text-fever transition-colors hover:text-ink"
              >
                Contact →
              </a>
            </div>
          </div>
        </div>
      </section>
    </PressShell>
  );
}
