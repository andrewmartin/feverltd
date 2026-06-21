import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Big_Shoulders,
  Fraunces,
  Space_Mono,
} from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/* ------------------------------------------------------------------ */
/* "Pressroom" homepage type system (the chosen d-press-gallery        */
/* direction — the "Poster" pairing: Big Shoulders Display + Fraunces, */
/* with Space Mono for labels). Exposed as CSS variables consumed by   */
/* the `.pressroom` scope in globals.css.                              */
/* ------------------------------------------------------------------ */
const posterDisplay = Big_Shoulders({
  variable: "--font-poster",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

/**
 * Set the Pressroom color scheme before first paint (no FOUC): saved choice
 * first, else OS preference. Sets `data-theme` on <html>; only `.pressroom`
 * styles react to it, so it is inert on the dark admin/marketing pages.
 */
const THEME_INIT = `(function(){try{var s=localStorage.getItem('fever-theme');var d=s==='dark'||(!s&&window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.setAttribute('data-theme',d?'dark':'light');}catch(e){}})();`;

export const metadata: Metadata = {
  metadataBase: new URL("https://feverltd.com"),
  title: {
    default: "Fever Ltd — Record Label",
    template: "%s · Fever Ltd",
  },
  description:
    "Fever Ltd is an independent record label out of Los Angeles — noise and culture, loud records pressed properly.",
  openGraph: {
    title: "Fever Ltd — Record Label",
    description:
      "An independent record label out of Los Angeles — noise and culture, loud records pressed properly.",
    type: "website",
    siteName: "Fever Ltd",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fever Ltd — Record Label",
    description:
      "An independent record label out of Los Angeles — noise and culture, loud records pressed properly.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Set the theme before first paint to avoid a flash. Native inline
            script (not next/script) so it actually executes pre-hydration. */}
        <script
          id="fever-theme-init"
          dangerouslySetInnerHTML={{ __html: THEME_INIT }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${posterDisplay.variable} ${fraunces.variable} ${spaceMono.variable} font-sans antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
