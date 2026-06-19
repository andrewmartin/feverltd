import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/auth";
import { AdminNav } from "@/components/admin/admin-nav";
import { SignOutButton } from "@/components/admin/sign-out-button";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getAdminSession();
  if (!session) redirect("/signin");

  const { name, email, image } = session.user;
  const initial = (name ?? email ?? "?").charAt(0).toUpperCase();

  return (
    <div className="min-h-dvh bg-background text-foreground md:grid md:grid-cols-[16rem_1fr]">
      <aside className="flex flex-col gap-6 border-b border-border bg-muted/30 p-4 md:sticky md:top-0 md:h-dvh md:border-b-0 md:border-r">
        <div className="flex items-center justify-between">
          <Link href="/admin" className="font-mono text-sm font-bold tracking-tight">
            FEVER<span className="text-accent">.</span>LTD
            <span className="ml-2 text-muted-foreground">CMS</span>
          </Link>
        </div>

        <AdminNav />

        <div className="mt-auto flex flex-col gap-3 border-t border-border pt-4">
          <Link
            href="/"
            className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            View site ↗
          </Link>

          <div className="flex items-center gap-3 px-3">
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image}
                alt=""
                className="h-8 w-8 shrink-0 rounded-full border border-border object-cover"
              />
            ) : (
              <span
                aria-hidden
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-foreground"
              >
                {initial}
              </span>
            )}
            <span className="truncate text-xs text-muted-foreground" title={email ?? undefined}>
              {email}
            </span>
          </div>

          <SignOutButton />
        </div>
      </aside>

      <main className="min-w-0 p-5 md:p-8">{children}</main>
    </div>
  );
}
