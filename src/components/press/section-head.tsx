import Link from "next/link";
import type { ReactNode } from "react";

/** Numbered kicker + display heading + ruled "view all" row (shared by sections). */
export function PressSectionHead({
  kicker,
  href,
  label,
  children,
}: {
  kicker: string;
  href: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <span className="mb-3 inline-block font-press text-[11px] uppercase tracking-[0.26em] text-fever">
        {kicker}
      </span>
      <div className="flex items-end gap-[22px]">
        <h2 className="shrink-0 font-disp text-[clamp(34px,6vw,74px)] font-extrabold uppercase leading-[0.86] tracking-[-0.01em]">
          {children}
        </h2>
        <span className="mb-[0.32em] h-0 min-w-[30px] flex-1 border-b-2 border-rule max-[560px]:hidden" />
        <Link
          href={href}
          className="mb-[0.36em] shrink-0 whitespace-nowrap font-press text-[11px] uppercase tracking-[0.18em] text-quiet transition-colors hover:text-fever"
        >
          {label}
        </Link>
      </div>
    </div>
  );
}

/** Outline (stroked, transparent fill) word used inside display headings. */
export function Outline({ children }: { children: ReactNode }) {
  return (
    <span className="text-transparent [-webkit-text-stroke:1.6px_var(--ink)]">
      {children}
    </span>
  );
}
