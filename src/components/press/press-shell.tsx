import type { ReactNode } from "react";
import { PressMasthead } from "./press-masthead";
import { PressFooter } from "./press-footer";

/**
 * The shared Pressroom chrome: the `.pressroom` theme scope, the broadsheet
 * masthead, a `<main>`, and the footer + ticker. Every public page wraps its
 * content in this so the site reads as one consistent design and the
 * light/dark token system applies everywhere.
 */
export function PressShell({ children }: { children: ReactNode }) {
  return (
    <div className="pressroom">
      <PressMasthead />
      <main id="main">{children}</main>
      <PressFooter />
    </div>
  );
}
