"use client";

import { useEffect, useState } from "react";

const KEY = "fever-theme";

/**
 * Pressroom light/dark toggle. The initial attribute is set pre-paint by the
 * inline script in `layout.tsx` (no FOUC); this only handles clicks, keeps the
 * button in sync, and follows the OS until the user makes an explicit choice.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const root = document.documentElement;
    const sync = () =>
      setTheme(root.getAttribute("data-theme") === "dark" ? "dark" : "light");
    sync();

    const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
    const onOs = (e: MediaQueryListEvent) => {
      let stored: string | null = null;
      try {
        stored = localStorage.getItem(KEY);
      } catch {
        /* ignore */
      }
      if (!stored) {
        root.setAttribute("data-theme", e.matches ? "dark" : "light");
        sync();
      }
    };
    mq?.addEventListener?.("change", onOs);
    return () => mq?.removeEventListener?.("change", onOs);
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* ignore */
    }
    setTheme(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={theme === "dark"}
      aria-label="Toggle color theme"
      title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      className="inline-flex h-5 w-6 cursor-pointer items-center justify-center text-quiet transition-[color,transform] hover:text-ink active:scale-90 focus-visible:rounded-[3px] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-[3px] focus-visible:outline-fever"
    >
      {theme === "dark" ? (
        <svg
          className="h-3.5 w-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.6 6.6 0 0 0 9.8 9.8z" />
        </svg>
      ) : (
        <svg
          className="h-3.5 w-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
        >
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 2v2.5M12 19.5V22M4.3 4.3l1.8 1.8M17.9 17.9l1.8 1.8M2 12h2.5M19.5 12H22M4.3 19.7l1.8-1.8M17.9 6.1l1.8-1.8" />
        </svg>
      )}
    </button>
  );
}
