import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";
import { isAdminEmail, isAuthDisabled, DEV_ADMIN } from "@/lib/admin";
import { authConfig } from "@/auth.config";
import type { Session } from "next-auth";

export const {
  handlers,
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  ...authConfig,
});

/**
 * Throws-style guard for server components / server actions in the CMS.
 * Returns the authenticated admin session or null.
 */
export async function getAdminSession(): Promise<Session | null> {
  // DEV bypass — return a synthetic admin so the CMS is usable without login.
  if (isAuthDisabled()) {
    return { user: DEV_ADMIN, expires: "" } as Session;
  }

  const session = await auth();
  if (!session?.user) return null;
  if (session.user.role !== "ADMIN" && !isAdminEmail(session.user.email)) {
    return null;
  }
  return session;
}
