import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";
import { isAdminEmail } from "@/lib/admin";
import { authConfig } from "@/auth.config";

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
export async function getAdminSession() {
  const session = await auth();
  if (!session?.user) return null;
  if (session.user.role !== "ADMIN" && !isAdminEmail(session.user.email)) {
    return null;
  }
  return session;
}
