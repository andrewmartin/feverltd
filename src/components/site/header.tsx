import Link from "next/link";
import Image from "next/image";
import { auth, signOut } from "@/auth";
import { isAdminEmail } from "@/lib/admin";
import { SignOutButton } from "./sign-out-button";
import { MobileNav } from "./mobile-nav";
import { FeverLogo } from "./fever-logo";

const NAV_LINKS = [
  { href: "/releases", label: "Releases" },
  { href: "/artists", label: "Artists" },
  { href: "/#about", label: "About" },
];

export async function SiteHeader() {
  const session = await auth().catch(() => null);
  const user = session?.user;
  const isAdmin = user
    ? user.role === "ADMIN" || isAdminEmail(user.email)
    : false;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="relative mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-6">
        <Link
          href="/"
          className="group flex shrink-0 items-center focus-visible:outline-none"
          aria-label="Fever Ltd — home"
        >
          <FeverLogo className="h-9 w-auto text-foreground transition-colors group-hover:text-accent sm:h-11" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-none"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="hidden items-center gap-4 md:flex">
              <Link
                href={isAdmin ? "/admin" : "/"}
                className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                title={isAdmin ? "Dashboard" : user.name ?? "Account"}
              >
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name ?? "Account"}
                    width={28}
                    height={28}
                    className="rounded-full border border-border"
                  />
                ) : (
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-muted font-mono text-xs">
                    {(user.name ?? user.email ?? "?").charAt(0).toUpperCase()}
                  </span>
                )}
                {isAdmin && (
                  <span className="font-mono text-xs uppercase tracking-widest text-accent">
                    Dashboard
                  </span>
                )}
              </Link>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <SignOutButton />
              </form>
            </div>
          ) : (
            <Link
              href="/signin"
              className="hidden font-mono text-xs uppercase tracking-widest text-foreground transition-colors hover:text-accent focus-visible:text-accent focus-visible:outline-none md:inline-block"
            >
              Sign in
            </Link>
          )}

          <MobileNav links={NAV_LINKS} />
        </div>
      </div>
    </header>
  );
}
