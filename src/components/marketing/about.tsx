export function About() {
  return (
    <section
      id="about"
      className="scroll-mt-16 border-b border-border"
      aria-labelledby="about-heading"
    >
      <div className="mx-auto max-w-7xl px-6 py-20 sm:py-28">
        <div className="grid gap-12 md:grid-cols-[1fr_2fr]">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
              Manifesto
            </p>
            <h2
              id="about-heading"
              className="mt-3 text-4xl font-bold tracking-tighter sm:text-5xl"
            >
              What we&apos;re about
            </h2>
          </div>

          <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
            <p>
              We started Fever Ltd because the records we wanted to hear
              weren&apos;t getting made. So we make them. No focus groups, no
              algorithm-chasing, no committee — just a room, a few obsessives,
              and a deadline we usually miss.
            </p>
            <p>
              Every release gets the full treatment: mastered properly, pressed
              on heavyweight vinyl, sleeved in artwork built to be stared at.
              We&apos;d rather put out{" "}
              <span className="text-foreground">six records we love</span> than
              sixty we forget.
            </p>
            <p className="text-foreground">
              If it makes your neck hair stand up, it&apos;s a Fever record.
            </p>
          </div>
        </div>

        <dl className="mt-16 grid grid-cols-2 gap-8 border-t border-border pt-12 sm:grid-cols-4">
          {[
            { k: "Founded", v: "2024" },
            { k: "Pressings", v: "180g" },
            { k: "Approach", v: "Hands-on" },
            { k: "Format", v: "Wax + DSP" },
          ].map((item) => (
            <div key={item.k}>
              <dt className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                {item.k}
              </dt>
              <dd className="mt-1 text-2xl font-bold tracking-tight text-foreground">
                {item.v}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
