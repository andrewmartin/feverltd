import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import { isAdminEmail, isAuthDisabled } from "@/lib/admin";

/**
 * Edge-safe Auth.js config. Contains only what middleware needs — no database
 * adapter or Node-only imports. The full config (with the Prisma adapter) lives
 * in `src/auth.ts`.
 */
export const authConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  session: { strategy: "jwt" },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = isAdminEmail(user.email) ? "ADMIN" : "USER";
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as "USER" | "ADMIN") ?? "USER";
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");
      if (!isOnAdmin) return true;
      // DEV bypass — leave /admin open while building the CMS.
      if (isAuthDisabled()) return true;
      return auth?.user?.role === "ADMIN";
    },
  },
} satisfies NextAuthConfig;
