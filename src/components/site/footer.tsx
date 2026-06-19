import Link from "next/link";

const SOCIALS = [
  { label: "Bandcamp", href: "#" },
  { label: "Instagram", href: "#" },
  { label: "SoundCloud", href: "#" },
  { label: "YouTube", href: "#" },
];

const NAV = [
  { label: "Releases", href: "/releases" },
  { label: "Artists", href: "/artists" },
  { label: "About", href: "/#about" },
  { label: "Sign in", href: "/signin" },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-[2fr_1fr_1fr]">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 focus-visible:outline-none"
            >
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-accent" />
              <span className="font-mono text-sm font-bold uppercase tracking-[0.2em]">
                Fever Ltd
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              An independent record label releasing forward-leaning music from
              the edge of the dial. Pressed with care, played loud.
            </p>
          </div>

          <nav aria-label="Footer">
            <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Navigate
            </h2>
            <ul className="mt-4 space-y-2">
              {NAV.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-foreground transition-colors hover:text-accent focus-visible:text-accent focus-visible:outline-none"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Social">
            <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Elsewhere
            </h2>
            <ul className="mt-4 space-y-2">
              {SOCIALS.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-sm text-foreground transition-colors hover:text-accent focus-visible:text-accent focus-visible:outline-none"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-16 flex flex-col gap-2 border-t border-border pt-8 font-mono text-xs uppercase tracking-widest text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Fever Ltd. All rights reserved.</p>
          <p>Made in the dark · Pressed on wax</p>
        </div>
      </div>
    </footer>
  );
}
