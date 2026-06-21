---
description: Work on the Fever LTD "Pressroom" homepage (the chosen design — context, styles, conventions)
argument-hint: "[optional: what to change, e.g. 'tighten the hero meta panel on mobile']"
---

# Fever LTD — Pressroom (live homepage)

The homepage design direction has been **chosen and built**. It is the
**"Pressroom"** look — light-first newsprint grey with a dark toggle, a
broadsheet masthead, brand red `#c6352f`, and the **"Poster"** type pairing
(**Big Shoulders** display + **Fraunces** serif, **Space Mono** labels). It was
ported from the `d-press-gallery` prototype. Read this whole file before
touching anything, then address: **$ARGUMENTS**

## Source of truth (read these first)
- **Prototype reference (frozen):** `public/prototypes/d-press-gallery.html` —
  the exact static design that was approved. This is the visual + interaction
  spec. View at `http://localhost:7878/prototypes/d-press-gallery.html` in dev
  (it is **404'd in production** by `src/proxy.ts` but kept for reference).
- `docs/project-brief.md` — audience, goals, brand, nav, catalog.
- `public/reference/artists/<Artist>/info.md` — per-artist facts + the real
  press photos / cover art used as curated fallback content.
- `/prototypes` (the older slash command) — context on the a/b/c/d explorations.

## Where the real implementation lives
- **Page:** `src/app/page.tsx` — server component. Fetches real data
  (`getFeaturedReleases`, `getAllArtists`, `getLatestNews` from
  `src/lib/catalog.ts`) and renders its sections inside `<PressShell>`.
- **Shared chrome:** `src/components/press/press-shell.tsx` — `PressShell`
  wraps page content in the `.pressroom` scope + masthead + `<main>` + footer.
  **Every public page should use it** (it is the site-wide chrome; the old
  dark `SiteHeader`/`SiteFooter` are being retired as pages convert).
- **Components:** `src/components/press/`
  - `press-masthead.tsx` — topline + logo lockup + ruled nav (server).
  - `theme-toggle.tsx` — light/dark button (client); sets `data-theme` on
    `<html>` + persists to `localStorage['fever-theme']`.
  - `press-hero.tsx` — rotating artist hero carousel (client).
  - `press-releases.tsx` — gallery-placard grid + Load More (client).
  - `press-news.tsx` — three-up dispatch cards (server).
  - `press-footer.tsx` — big "F" mark, newsletter, columns, ticker (server).
  - `section-head.tsx` — shared numbered kicker + heading + `Outline` word.
  - `social-links.tsx`, `newsletter-form.tsx` — shared bits.
  - `press-content.ts` — **curated fallback content** (mirrors the prototype's
    real artists / releases / news, with `/reference/...` imagery).
  - `press-adapters.ts` — maps DB rows → Pressroom props, falling back to the
    curated content when the DB is empty/unreachable or rows lack imagery.
- **Styling = Tailwind utilities** (house style). The components use utility
  classes (`bg-canvas text-ink font-disp border-rule …`) — **not** a parallel
  CSS file. The Pressroom palette is wired into Tailwind in
  `src/app/globals.css` under the `PRESSROOM` section:
  - The light-first palette is defined as CSS vars on `.pressroom`, with a
    `:root[data-theme="dark"] .pressroom` override. Those vars are exposed to
    Tailwind via `@theme inline` color tokens (`--color-canvas --color-surface
    --color-hair --color-rule --color-ink --color-quiet --color-fever`) — so
    every color utility **flips with the theme automatically** (no per-utility
    dark variant needed). For the rare case you need a scheme-specific value
    beyond a token, use the `pdark:` custom variant.
  - Type tokens: `font-disp` (Big Shoulders), `font-editorial` (Fraunces),
    `font-press` (Space Mono) — mapped from the next/font vars in `layout.tsx`.
  - Motion tokens (keyframes in globals): `animate-ticker`, `animate-rise`,
    `animate-pulse-led`.
  - The container width pattern is the local `WRAP` const in each section file.
- **Fonts + no-FOUC theme script:** `src/app/layout.tsx` (next/font wires
  `--font-poster`, `--font-fraunces`, `--font-space-mono`; an inline script sets
  `data-theme` before first paint).

## Conventions (keep the port honest)
- **Match the prototype.** It is the spec — measure against it, don't redesign.
  Ask before any large change; prefer accents / iteration on the approved look.
- **Style with Tailwind utilities + the Pressroom tokens** (`bg-canvas`,
  `text-ink`, `text-quiet`, `border-rule`/`border-hair`, `bg-surface`,
  `text-fever`/`bg-fever`, `font-disp`/`font-editorial`/`font-press`). Don't
  hardcode greys/reds and don't add a parallel `.pressroom .foo` CSS file —
  add new palette/type/motion **tokens** in the `PRESSROOM` `@theme` block and
  consume them as utilities. Keep raw CSS to keyframes + genuinely un-utility
  things only.
- **Theme parity:** anything you add must read correctly in **both** light and
  dark. Photo overlays (hero vignette, cover gradients) intentionally stay dark
  in both schemes so white caption text keeps contrast.
- **Real data first, curated fallback always.** Wire new sections through
  `press-adapters.ts` so the public site never renders empty/broken when the DB
  is empty. Keep curated content in `press-content.ts` in sync with the brief.
- **Images:** use plain `<img loading="lazy">` (hosts are mixed: local
  `/reference/...` + arbitrary Vercel Blob). URL-encode spaces (`%20`).
- The prototype stays **frozen** — iterate on the React app, not the HTML, unless
  you're re-vetting a brand-new direction.
- Avoid the generic "AI" tells: no purple/indigo gradients, glassmorphism,
  uniform rounded+shadow cards, timid type hierarchy.

## How to view / verify
Dev server runs on **port 7878** (`bun dev`). The homepage is `/`. To check
visual fidelity, drive the Playwright MCP browser against
`http://localhost:7878/` (start a fresh session), screenshot **both schemes**
(toggle in the top-right), and compare against the prototype. Clean up any
screenshot artifacts afterward.

## Validation — REQUIRED before reporting changes done
After any change, and **before** you tell the user it's ready/done, run and make
pass (use the `/opt/homebrew/bin` PATH per the Node-arch note):

1. `bun run typecheck` — must be clean.
2. `bun run build` — must complete (the homepage should stay `○ Static`; a
   `DATABASE_URL not found` line from `prisma generate` is expected noise and is
   non-fatal — the build still finishes and the route table prints).
3. **Look at it** in the browser (both light and dark) and report honestly —
   screenshot / measured alignment. Don't claim "done" without looking.

> Note: `next lint` is removed in Next 16 and this repo has no `eslint.config.*`,
> so there is no separate lint step — typecheck + build are the gates.
