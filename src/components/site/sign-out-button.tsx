"use client";

import { useFormStatus } from "react-dom";

/** Submit button for the sign-out server-action form. Client-only for pending UI. */
export function SignOutButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-none disabled:opacity-50"
    >
      {pending ? "…" : "Sign out"}
    </button>
  );
}
