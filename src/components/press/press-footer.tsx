import Link from "next/link";
import { auth, getAdminSession, signOut } from "@/auth";
import { FeverF } from "@/components/site/fever-f";
import { SocialLinks } from "./social-links";
import { NewsletterForm } from "./newsletter-form";

const WRAP = "mx-auto w-full max-w-[1280px] px-[34px] max-[560px]:px-5";

const EXPLORE = [
  { href: "/shop", label: "Shop" },
  { href: "/news", label: "News" },
  { href: "/artists", label: "Artists" },
  { href: "/releases", label: "Releases" },
];

const LABEL = [
  { href: "/about", label: "About" },
  { href: "mailto:feverltdnoise@gmail.com", label: "Contact" },
];

function FootCol({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h4 className="mb-4 font-press text-[10px] uppercase tracking-[0.2em] text-quiet">
        {title}
      </h4>
      <ul className="list-none">
        {links.map((l) => {
          const cls =
            "font-disp text-[16px] font-semibold uppercase tracking-[0.01em] text-ink transition-colors hover:text-fever";
          const external = /^(mailto:|https?:)/.test(l.href);
          return (
            <li key={l.label} className="mb-[11px]">
              {external ? (
                <a href={l.href} className={cls}>
                  {l.label}
                </a>
              ) : (
                <Link href={l.href} className={cls}>
                  {l.label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export async function PressFooter() {
  const isAdmin = Boolean(await getAdminSession());
  const isSignedIn = Boolean((await auth().catch(() => null))?.user);
  return (
    <>
      <footer className="relative overflow-hidden border-t-2 border-rule pb-[38px] pt-[72px]">
        <FeverF
          aria-hidden
          className="pointer-events-none absolute bottom-[-40px] right-[-90px] h-[clamp(160px,27vw,360px)] w-auto select-none text-fever opacity-[0.92] max-[900px]:opacity-45"
        />
        <div className={WRAP}>
          <div className="relative z-[2] mb-[58px] grid grid-cols-[1.5fr_1fr_1fr] gap-10 max-[900px]:grid-cols-1 max-[900px]:gap-[34px]">
            <div>
              <h3 className="mb-3.5 max-w-[14ch] font-disp text-[clamp(28px,3.4vw,42px)] font-extrabold uppercase leading-[0.9] tracking-[-0.01em]">
                On the Frequency<span className="text-fever">.</span>
              </h3>
              <p className="mb-[18px] max-w-[34ch] font-editorial text-[15px] text-quiet">
                New pressings and dispatches — sent rarely, never noise.
              </p>
              <NewsletterForm />
            </div>
            <FootCol title="Explore" links={EXPLORE} />
            <FootCol title="Label" links={LABEL} />
          </div>
          <div className="relative z-[2] flex flex-wrap items-center justify-between gap-4 border-t border-hair pt-6">
            <span className="flex flex-wrap items-center gap-x-4 gap-y-1 font-press text-[11px] uppercase tracking-[0.22em] text-quiet">
              © 2026 Fever LTD — Noise and Culture
              {isAdmin ? (
                <Link
                  href="/admin"
                  className="text-fever transition-colors hover:text-ink"
                >
                  Admin →
                </Link>
              ) : null}
              {isSignedIn ? (
                <form
                  action={async () => {
                    "use server";
                    await signOut({ redirectTo: "/" });
                  }}
                  className="inline"
                >
                  <button
                    type="submit"
                    className="font-press text-[11px] uppercase tracking-[0.22em] text-quiet transition-colors hover:text-fever"
                  >
                    Sign out →
                  </button>
                </form>
              ) : null}
            </span>
            <SocialLinks variant="footer" />
          </div>
        </div>
      </footer>

      <div className="group overflow-hidden border-t-2 border-rule bg-canvas" aria-hidden>
        <div className="inline-flex animate-ticker whitespace-nowrap will-change-transform group-hover:[animation-play-state:paused]">
          {[0, 1].map((u) => (
            <span
              key={u}
              className="inline-flex items-center py-2 font-press text-[10.5px] uppercase tracking-[0.24em] text-quiet"
            >
              Fever LTD<i className="px-6 not-italic text-fever">✶</i>Los Angeles
              <i className="px-6 not-italic text-fever">✶</i>Noise and Culture
              <i className="px-6 not-italic text-fever">✶</i>Loud records, pressed
              properly<i className="px-6 not-italic text-fever">✶</i>Est. 2019
              <i className="px-6 not-italic text-fever">✶</i>
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
