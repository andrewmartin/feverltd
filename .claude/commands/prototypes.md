---
description: Work on the Fever LTD homepage design prototypes (context + conventions)
argument-hint: "[optional: what you want to do, e.g. 'roll the masonry grid to A and C']"
---

# Fever LTD — Homepage Prototypes

You're working on **static homepage design prototypes** for **Fever LTD**, an
independent record label. These are throwaway, raw-HTML design explorations used
to vet visual directions *before* building them into the real Next.js app. Read
this whole file before touching anything, then address: **$ARGUMENTS**

## Read first (source of truth)
- `docs/project-brief.md` — consolidated discovery + kickoff brief (audience,
  goals, brand, nav, page list, artists & catalog, open questions).
- `public/reference/artists/<Artist>/info.md` — per-artist facts (origin, genre,
  members, releases) + real press photos and cover art used by the prototypes.

## What exists (`public/prototypes/`)
| File | Concept | Mood | Hero | Type pairing (default) | 2nd accent |
| --- | --- | --- | --- | --- | --- |
| `index.html` | Landing page linking the three | — | — | Bricolage + Fraunces | — |
| `a-editorial-white.html` | **Gallery** | Bright, clean, white + red | Full-screen rotating artist hero (Sunday-Drive style) | Bricolage Grotesque / Fraunces | warm bone |
| `b-dark-moody.html` | **After Midnight** | Near-black, photographic, glowing | Contained minimal carousel + mono `01/06` index | Schibsted Grotesk / Spectral / Space Mono | cold off-white |
| `c-broadsheet.html` | **Front Page** | High-contrast print/zine | Editorial split masthead + ruled grid | Archivo (black) / DM Serif Display | acid yellow |

All three share the **same real content**: 8 artists, 7 physical-release covers,
3 news posts grounded in real facts (e.g. Chain Gang of 1974's single passing
15k streams; Mascara's *Going Postal*; Valley of Doves' CD). Nav is **Shop ·
News · Artists · Releases** with social icons top-right and an "F" footer.
Brand red is **`#c6352f`**.

### Notable per-variant state
- **B is the most-iterated variant** and the current focus. It has:
  - A **broadsheet-style masthead header** (ported from C): mono topline
    (dateline · issue) → big logo lockup + italic tagline → ruled `.navbar`
    (boxed Space Mono nav + socials). This is the agreed header direction.
  - A **light/dark scheme toggle** wired into the switcher (see below). The
    palette is fully variable-driven; light is a `[data-theme="light"]` override
    on `:root`. Photo overlays (hero vignette, release-cover gradients) stay
    dark in both schemes so white overlay text/badges keep contrast.
  - Hero headline "**The bands on Fever LTD.**" (eyebrow "Artists").
  - A **featured mosaic releases grid** (not a horizontal scroll): newest
    release spans a 2×2 tile, the rest are square cover tiles with overlaid
    info, plus a **Load More** button (shows 4 → reveals the rest, live count,
    auto-hides). Square covers make the 2×2 feature line up exactly with two
    stacked tiles.
  - We tried zine/punk accents (grain, tape, stamps, scrawls) and **reverted
    them** — the clean look is preferred for this layout.
- **A and C still use the original horizontal-scroll** releases row. Rolling
  B's masonry + Load More to A and C is an open follow-up (style to each).

### Font switcher (all three)
Each design has a small fixed switcher (bottom-right) that swaps the `--disp`
(display) and `--serif` CSS variables live across 5 pairings: **Grotesque,
Signal, Techno, Editorial, Clean**. Fonts use those variables — when adding
type, reference `var(--disp)` / `var(--serif)`, not hardcoded family names
(Space Mono labels in B are intentionally fixed). A shared Google Fonts link
loads the whole pool. **B's switcher has a second group, "Scheme" (Dark /
Light)**, that toggles `data-theme` on `<html>` — pattern is reusable if A/C
ever want light/dark too.

## Conventions (keep prototypes honest)
- **Self-contained raw HTML**: inline `<style>`, Google Fonts via CDN link,
  **vanilla JS only** (no frameworks/build). Prefer CSS for layout; small IIFEs
  for interactivity.
- **Real images** via relative paths: `../reference/artists/<Artist>/<file>`
  (the files live in `public/reference/`; from a prototype at
  `public/prototypes/*.html` the `../reference/...` path resolves to
  `/reference/...` when served by Next) — **URL-encode spaces as `%20`**.
- **Static only**: nav links are `href="#"`; no backend, no real routing.
- Each variant is independent — a change to one should not silently diverge the
  others. Keep the shared content identical unless intentionally differentiating.
- Avoid the generic "AI" tells: no purple/indigo or blue→purple gradients, no
  glassmorphism, no uniform 16px-radius+faint-shadow cards, no three-icon
  feature grids, no timid type hierarchy.

## How to view
The prototypes are static files under `public/`, **served by the running Next.js
dev app** (`bun dev`, port **7878**) — no separate host needed. Open:
```
http://localhost:7878/prototypes/index.html      # landing page linking the three
http://localhost:7878/prototypes/b-dark-moody.html
```
Next serves files in `public/` verbatim but does **not** auto-index directories,
so use the explicit `…/index.html` (a bare `/prototypes/` 404s). Browsers cache
these aggressively — **append `?v=N` or hard-refresh** after edits. To
screenshot/verify, drive the Playwright MCP browser against the `localhost:7878`
URL (start a fresh session). Clean up any screenshot artifacts afterward.

## Relationship to the real app
- The production site is a **Next.js app in `src/`** (dev: `bun dev`, port
  **7878**; theme is dark — `#0a0a0b` bg, `#ededee` fg, red accent).
- The real logo is a React component: **`src/components/site/fever-logo.tsx`**
  (the `FEVER LTD. / NOISE AND CULTURE` SVG from feverltd.com, `currentColor`),
  used in `src/components/site/header.tsx`. The prototypes use the **same
  artwork** via `public/prototypes/fever-logo.svg`, driven as a CSS `mask` on
  `.wordmark` (`background:currentColor` + `mask:url(fever-logo.svg)`) so it
  recolors per variant — dark on A/C, light on B, and rendered large in C's
  masthead. When porting in, just use the `<FeverLogo/>` component.
- Prototypes are **design exploration only** — do not wire them to the app until
  a direction is chosen. When porting a chosen direction in, translate to the
  app's stack (App Router, Tailwind tokens, real components).

## Open threads / likely next steps
- Pick / refine a single direction to take forward into the real app.
- Roll B's masonry + Load More releases grid to A and C.
- Consider porting C's broadsheet masthead header style (topline → big logo row
  → ruled nav) into the real app header or B.
- Swap placeholder display fonts for the real **Huben** logo font once the
  client supplies the files (pair a compatible secondary face).
- Missing cover art: Teenage Wrist (*Dazed*) and both Chain Gang releases only
  have press photos in `public/reference/` — request artwork.

## Working agreement
- Track multi-step work with a checklist (markdown checkmarks).
- After visual changes, verify in the browser and report honestly (screenshot,
  measured alignment, etc.) — don't claim "done" without looking.
- Ask before large redesigns; prefer accents/iteration on the approved look.
