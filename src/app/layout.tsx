import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://feverltd.com"),
  title: {
    default: "Fever Ltd — Record Label",
    template: "%s · Fever Ltd",
  },
  description:
    "Fever Ltd is an independent record label. Artists, releases, and sounds from the edge.",
  openGraph: {
    title: "Fever Ltd — Record Label",
    description:
      "An independent record label. Artists, releases, and sounds from the edge.",
    type: "website",
    siteName: "Fever Ltd",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
