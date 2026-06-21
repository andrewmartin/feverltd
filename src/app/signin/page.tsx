import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signIn } from "@/auth";
import { Outline } from "@/components/press/section-head";

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
    <div className="pressroom">
      <main className="flex min-h-screen flex-col items-center justify-center bg-canvas px-6 text-ink">
        <div className="w-full max-w-[420px]">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 focus-visible:outline-none"
            aria-label="Fever Ltd — home"
          >
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-fever" />
            <span className="font-press text-[13px] font-bold uppercase tracking-[0.26em]">
              Fever Ltd
            </span>
          </Link>

          <h1 className="mt-10 font-disp text-[clamp(44px,9vw,76px)] font-extrabold uppercase leading-[0.88] tracking-[-0.01em]">
            Welcome <Outline>Back</Outline>
          </h1>

          <form
            className="mt-8"
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/admin" });
            }}
          >
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-3 border-2 border-ink bg-ink px-6 py-3.5 font-press text-[12px] font-bold uppercase tracking-[0.22em] text-canvas transition-colors hover:bg-fever hover:border-fever focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fever focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
            >
              <GoogleMark />
              Continue with Google
            </button>
          </form>

          <p className="mt-9 border-t-2 border-rule pt-7 font-press text-[11px] uppercase tracking-[0.26em] text-quiet">
            <Link href="/" className="transition-colors hover:text-fever">
              ← Back home
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
