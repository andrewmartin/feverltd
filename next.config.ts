import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Google account avatars (NextAuth profile images)
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
  experimental: {
    // Keep server action bodies generous for CMS uploads/long forms.
    serverActions: {
      bodySizeLimit: "4mb",
    },
  },
};

export default nextConfig;
