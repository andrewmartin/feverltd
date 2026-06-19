import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

// Next.js 16 "proxy" convention (the renamed middleware). Edge-safe: uses the
// `authorized` callback in auth.config.ts to gate /admin behind an ADMIN role.
const { auth } = NextAuth(authConfig);

export default auth;

export const config = {
  matcher: ["/admin/:path*"],
};
