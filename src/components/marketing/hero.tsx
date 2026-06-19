import Link from "next/link";

export function Hero({ releaseCount }: { releaseCount?: number }) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      {/* Grain / glow backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_-10%,rgba(230,255,58,0.12),transparent_45%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:repeating-linear-gradient(0deg,#fff_0,#fff_1px,transparent_1px,transparent_4px)]"
      />

      <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-24 sm:pt-32">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
          Independent record label · Est. MMXXIV
        </p>

        <h1 className="mt-6 max-w-4xl text-balance text-6xl font-bold leading-[0.92] tracking-tighter sm:text-8xl">
          Sounds from the
          <span className="relative ml-3 inline-block">
            <span className="relative z-10 text-accent">edge</span>
            <span
              aria-hidden
              className="absolute inset-x-0 bottom-1 z-0 h-4 -skew-x-6 bg-accent/20"
            />
          </span>{" "}
          of the dial.
        </h1>

        <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
          Fever Ltd is a small label with loud ideas. We press records for the
          restless — music that doesn&apos;t sit still, by artists who
          don&apos;t either.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            href="/releases"
            className="group inline-flex items-center gap-2 bg-accent px-6 py-3 font-mono text-xs font-bold uppercase tracking-widest text-accent-foreground transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Browse the catalog
            <span aria-hidden className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
          <Link
            href="/artists"
            className="inline-flex items-center gap-2 border border-border px-6 py-3 font-mono text-xs uppercase tracking-widest text-foreground transition-colors hover:border-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            Meet the roster
          </Link>
        </div>

        {releaseCount ? (
          <p className="mt-12 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {releaseCount} release{releaseCount === 1 ? "" : "s"} in the catalog
            and counting
          </p>
        ) : null}
      </div>
    </section>
  );
}
