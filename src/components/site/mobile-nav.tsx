"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type NavLink = { href: string; label: string };

/** Hamburger menu for small screens. */
export function MobileNav({ links }: { links: NavLink[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <span className="relative block h-3 w-5">
          <span
            className={cn(
              "absolute left-0 top-0 h-0.5 w-5 bg-current transition-transform",
              open && "translate-y-[5px] rotate-45",
            )}
          />
          <span
            className={cn(
              "absolute bottom-0 left-0 h-0.5 w-5 bg-current transition-transform",
              open && "-translate-y-[5px] -rotate-45",
            )}
          />
        </span>
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full border-b border-border bg-background">
          <nav className="flex flex-col px-6 py-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-border/60 py-3 font-mono text-sm uppercase tracking-widest text-foreground last:border-0"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
