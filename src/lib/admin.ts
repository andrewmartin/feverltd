/**
 * Allow-list of admin emails, sourced from the ADMIN_EMAILS env var
 * (comma-separated). Edge-safe — no Node/Prisma imports.
 */
export function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return getAdminEmails().includes(email.toLowerCase());
}

/**
 * DEV ONLY escape hatch. When ADMIN_AUTH_DISABLED is "true", the auth guard is
 * bypassed: getAdminSession() returns a synthetic admin and the /admin proxy
 * gate is skipped. The protection *pattern* stays wired up everywhere — this
 * just turns it off while building the CMS. Hard-fails closed in production.
 */
export function isAuthDisabled(): boolean {
  if (process.env.NODE_ENV === "production") return false;
  return process.env.ADMIN_AUTH_DISABLED === "true";
}

/** The synthetic admin user used when auth is disabled in dev. */
export const DEV_ADMIN = {
  id: "dev-admin",
  name: "Dev Admin",
  email: "dev@feverltd.local",
  image: null,
  role: "ADMIN" as const,
};
