import { cn } from "@/lib/utils";

/** Inline social icon set shared by the Pressroom masthead + footer. */

// Official Fever LTD accounts, confirmed from the label's own Bandcamp links
// (feverltd.bandcamp.com lists website + Twitter + Instagram). No verified
// label Spotify/YouTube profile, so those are intentionally omitted.
const SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com/feverltd/" },
  { label: "X", href: "https://twitter.com/feverltd" },
  { label: "Bandcamp", href: "https://feverltd.bandcamp.com/" },
] as const;

function Icon({ name }: { name: (typeof SOCIALS)[number]["label"] }) {
  switch (name) {
    case "Instagram":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "X":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case "Bandcamp":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M2 16.5L6.2 7.5H22l-4.2 9H2z" />
        </svg>
      );
  }
}

export function SocialLinks({
  variant = "header",
  className,
}: {
  variant?: "header" | "footer";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center",
        variant === "header" ? "gap-0.5 pr-0.5 max-[560px]:hidden" : "gap-4",
        className,
      )}
    >
      {SOCIALS.map((s) => (
        <a
          key={s.label}
          href={s.href}
          aria-label={s.label}
          target="_blank"
          rel="noreferrer"
          className={cn(
            "flex items-center justify-center text-ink opacity-70 transition-[color,opacity] hover:text-fever hover:opacity-100 [&_svg]:h-[17px] [&_svg]:w-[17px]",
            variant === "header" && "h-[42px] w-[38px]",
          )}
        >
          <Icon name={s.label} />
        </a>
      ))}
    </div>
  );
}
