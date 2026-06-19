export function NewsletterCta() {
  return (
    <section aria-labelledby="cta-heading" className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_120%,rgba(230,255,58,0.10),transparent_50%)]"
      />
      <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
            Stay close
          </p>
          <h2
            id="cta-heading"
            className="mt-4 text-balance text-4xl font-bold tracking-tighter sm:text-6xl"
          >
            Get the drop before anyone else.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Pressings are small and they go fast. Join the list for first dibs on
            new records, test pressings, and the occasional secret show.
          </p>

          <form
            className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row"
            aria-label="Newsletter signup"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder="you@email.com"
              className="min-w-0 flex-1 border border-border bg-muted px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
            />
            <button
              type="submit"
              className="shrink-0 bg-accent px-6 py-3 font-mono text-xs font-bold uppercase tracking-widest text-accent-foreground transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Subscribe
            </button>
          </form>

          <p className="mt-4 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            No spam. Unsubscribe whenever.
          </p>
        </div>
      </div>
    </section>
  );
}
