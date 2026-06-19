import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signIn } from "@/auth";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to Fever Ltd.",
};

function GoogleMark() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="h-5 w-5"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47a5.53 5.53 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.57-5.17 3.57-8.86Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.08 7.95-2.91l-3.88-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29a7.2 7.2 0 0 1 0-4.58V6.62H1.29a12 12 0 0 0 0 10.76l3.98-3.09Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.43-3.43C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75Z"
      />
    </svg>
  );
}

export default async function SignInPage() {
  const session = await auth().catch(() => null);
  if (session?.user) redirect("/");

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(230,255,58,0.12),transparent_50%)]"
      />

      <div className="relative w-full max-w-sm">
        <Link
          href="/"
          className="inline-flex items-center gap-2 focus-visible:outline-none"
          aria-label="Fever Ltd — home"
        >
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-accent" />
          <span className="font-mono text-sm font-bold uppercase tracking-[0.2em]">
            Fever Ltd
          </span>
        </Link>

        <h1 className="mt-10 text-4xl font-bold tracking-tighter">
          Welcome back.
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Sign in to manage the label. Access is limited to label staff — if
          you&apos;re a fan, just{" "}
          <Link href="/releases" className="text-accent hover:underline">
            browse the catalog
          </Link>
          .
        </p>

        <form
          className="mt-8"
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/admin" });
          }}
        >
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-3 border border-border bg-foreground px-6 py-3 font-mono text-xs font-bold uppercase tracking-widest text-background transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <GoogleMark />
            Continue with Google
          </button>
        </form>

        <p className="mt-8 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          <Link href="/" className="transition-colors hover:text-foreground">
            ← Back home
          </Link>
        </p>
      </div>
    </main>
  );
}
