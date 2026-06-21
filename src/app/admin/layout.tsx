import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ExternalLinkIcon } from "lucide-react";
import { getAdminSession } from "@/auth";
import { isAuthDisabled } from "@/lib/admin";
import { AdminNav } from "@/components/admin/admin-nav";
import { SignOutButton } from "@/components/admin/sign-out-button";
import { Toaster } from "@/components/ui/sonner";
import { Separator } from "@/components/ui/separator";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getAdminSession();
  if (!session) redirect("/signin");

  const authOff = isAuthDisabled();
  const { name, email, image } = session.user;
  const initial = (name ?? email ?? "?").charAt(0).toUpperCase();

  return (
    <div className="admin bg-background text-foreground min-h-dvh md:grid md:grid-cols-[16rem_1fr]">
      <aside className="bg-card flex flex-col gap-6 border-b-2 border-foreground p-4 md:sticky md:top-0 md:h-dvh md:border-r-2 md:border-b-0">
        <div className="flex flex-col gap-2 border-b border-border pb-4">
          <span className="font-press text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Fever LTD — Pressroom
          </span>
          <Link
            href="/admin"
            className="font-disp text-2xl font-extrabold uppercase leading-none tracking-tight"
          >
            FEVER<span className="text-primary">.</span>LTD
            <span className="text-muted-foreground ml-2 align-middle font-press text-[10px] tracking-[0.2em]">
              CMS
            </span>
          </Link>
        </div>

        {authOff ? (
          <p className="border-primary/30 bg-primary/5 text-primary rounded-md border px-2.5 py-1.5 font-press text-[0.65rem] uppercase tracking-wider leading-tight">
            Dev mode — auth disabled
          </p>
        ) : null}

        <AdminNav />

        <div className="mt-auto flex flex-col gap-3">
          <Separator />
          <Link
            href="/"
            className="text-muted-foreground hover:bg-muted hover:text-foreground flex items-center gap-2 rounded-md px-3 py-2 font-press text-[11px] uppercase tracking-[0.18em] transition-colors"
          >
            <ExternalLinkIcon className="size-4" />
            View site
          </Link>

          <div className="flex items-center gap-3 px-3">
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image}
                alt=""
                className="size-8 shrink-0 rounded-full border object-cover"
              />
            ) : (
              <span
                aria-hidden
                className="bg-primary text-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-full font-disp text-sm font-bold"
              >
                {initial}
              </span>
            )}
            <span
              className="text-muted-foreground truncate text-xs"
              title={email ?? undefined}
            >
              {email}
            </span>
          </div>

          {!authOff ? <SignOutButton /> : null}
        </div>
      </aside>

      <main className="min-w-0 p-5 md:p-8">{children}</main>
      <Toaster position="top-right" richColors />
    </div>
  );
}
