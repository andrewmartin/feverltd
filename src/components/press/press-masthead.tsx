import Link from "next/link";
import { FeverLogo } from "@/components/site/fever-logo";
import { ThemeToggle } from "./theme-toggle";
import { SocialLinks } from "./social-links";

const WRAP = "mx-auto w-full max-w-[1280px] px-[34px] max-[560px]:px-5";

const NAV = [
  { href: "/shop", label: "Shop" },
  { href: "/news", label: "News" },
  { href: "/artists", label: "Artists" },
  { href: "/releases", label: "Releases" },
];

/** Broadsheet masthead: dateline topline → logo lockup → ruled nav. */
export function PressMasthead() {
  return (
    <header className="sticky top-0 z-50 border-b-2 border-rule bg-canvas">
      <div className={WRAP}>
        <div className="flex items-center justify-between gap-4 border-b border-hair py-[9px] font-press text-[10.5px] uppercase tracking-[0.18em] text-quiet">
          <span className="whitespace-nowrap">Fever LTD — Noise and Culture</span>
          <div className="flex items-center gap-3.5">
            <span className="text-fever max-[560px]:hidden">Est. 2019</span>
            <ThemeToggle />
          </div>
        </div>
        <div className="flex items-end justify-between gap-6 py-[18px] pb-4 max-[600px]:flex-wrap max-[600px]:py-3">
          <Link
            href="/"
            aria-label="Fever LTD — Noise and Culture"
            className="group block min-w-0 shrink text-ink transition-colors hover:text-fever max-[600px]:basis-full"
          >
            <FeverLogo className="block h-[clamp(40px,7.4vw,86px)] w-auto max-[600px]:h-auto max-[600px]:w-full" />
          </Link>
          <div className="max-w-[264px] pb-1.5 text-right max-[860px]:hidden">
            <p className="font-editorial text-[clamp(13px,1.5vw,16px)] italic leading-[1.24] text-quiet">
              Loud records, pressed properly — out of Los Angeles.
            </p>
          </div>
        </div>
      </div>
      <div className={WRAP}>
        <div className="flex items-center justify-between border-t border-rule">
          <nav
            className="flex gap-[clamp(20px,3vw,40px)]"
            aria-label="Primary"
          >
            {NAV.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="relative flex items-center py-[13px] font-press text-[11px] uppercase tracking-[0.2em] text-quiet transition-colors after:absolute after:bottom-2 after:left-0 after:h-0.5 after:w-0 after:bg-fever after:transition-[width] hover:text-ink hover:after:w-full"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <SocialLinks variant="header" />
        </div>
      </div>
    </header>
  );
}
