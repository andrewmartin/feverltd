<!-- molt-checkpoint: last_run=2026-07-03T11:03:46Z last_commit=34ad0f9bf92d6715849d850eff66aab7501ad6a5 hash=bc6275dbd5b1db9252509ef907162e0ef59d10ff8801bb921e259396f037dd98 -->
# Fever LTD

Website for **Fever LTD**, an independent record label — a public catalog of
artists & releases plus a small admin CMS to manage them.

## Stack

- **Next.js 16** (App Router) + **Turbopack** + **React 19** + **TypeScript** (strict)
- **Tailwind CSS v4** (CSS-first theme in `src/app/globals.css`)
- **Auth.js v5 / NextAuth** — Google sign-in, JWT sessions, Prisma adapter
- **TanStack React Query v5** (App Router per-request client)
- **Prisma 6** + PostgreSQL (Neon via the Vercel Marketplace integration)
- **react-hook-form** + **zod** for CMS forms & Server Action validation
- Deployed on **Vercel**

## Commands

- `bun run dev` — dev server (Turbopack), **port 7878** (non-standard)
- `bun run build` / `bun run start` — production build / serve
- `bun run typecheck` — `tsc --noEmit`
- `bun run lint` — flat ESLint config (`eslint.config.mjs`); Next 16 removed `next lint`
- `bun run db:push` / `db:migrate` / `db:studio` — Prisma helpers
- `bun run db:seed` — seeds the real roster + catalog (**ask before running** — see global seeding rule)
- Use **Bun**, not npm, for all local dev commands.
- **Apple Silicon:** `dev`/`build`/`start`/`db:*` scripts pin `PATH` to
  `/opt/homebrew/bin` so native modules (lightningcss, Tailwind oxide, Prisma)
  match the arm64 toolchain when an x64 node is also on PATH. No-op on Vercel.
- The landing page renders with curated placeholder/fallback content even
  with no database connected, so the app boots before Postgres is provisioned.

## Environment variables

DB vars are `FEVER_`-prefixed (Neon via Vercel Marketplace) — `prisma/schema.prisma`
reads `FEVER_POSTGRES_PRISMA_URL` (pooled) / `FEVER_POSTGRES_URL_NON_POOLING` (direct).
Blob token is `FEVER_READ_WRITE_TOKEN`. Full list + purpose: `.env.example`.
`ADMIN_AUTH_DISABLED=true` bypasses auth to leave `/admin` open locally — dev only.

## Project structure

```
src/
  app/            # routes: releases/, artists/, news/, shop/, admin/ (CMS), api/
  components/
    press/        # Pressroom design system — the live public-site chrome (see below)
    admin/        # CMS UI primitives
    site/         # legacy dark header/footer, being retired as pages convert to press/
  lib/            # db.ts (Prisma singleton), catalog.ts (public reads), cms.ts
                  # (admin zod schemas), admin-queries.ts, blob.ts, optimize-image.ts,
                  # bigcartel.ts, newsletter.ts, api-guard.ts
  auth.ts, auth.config.ts, proxy.ts   # Auth.js wiring + route gating (Next 16 "proxy")
prisma/
  schema.prisma   # Auth.js models + Artist/Release/Track/NewsPost/Subscriber
  seed.ts
docs/             # project brief + per-artist reference material
```

## Conventions

- `/admin` is gated to users whose role is `ADMIN` (derived from `ADMIN_EMAILS`)
  via Auth.js `authorized` callback in `src/auth.config.ts` + edge `src/proxy.ts`.
  Route handlers use `guardAdminRoute()` (`src/lib/api-guard.ts`); server actions
  use `getAdminSession()` from `src/auth.ts`.
- `src/proxy.ts` also 404s `/prototypes/*` when `VERCEL_ENV === "production"`
  (kept in preview/dev for design reference).
- Admin image uploads are optimized client-side (`src/lib/optimize-image.ts`,
  via `browser-image-compression`) before going to Vercel Blob.
- Use react-hook-form + zod + Server Actions for CMS forms — not API route handlers.
- `Artist.alumni` — formerly-signed artists, surfaced as an "Alumni" badge (vs.
  "On the label" for current roster) across the roster carousel and Artists grid.

## Public site design — "Pressroom"

The live homepage/site chrome is the **Pressroom** design (light-first newsprint
grey + dark toggle, brand red `#c6352f`, Big Shoulders/Fraunces/Space Mono type),
built in `src/components/press/` and wrapped by `<PressShell>`. It was ported
from the frozen prototype `public/prototypes/d-press-gallery.html`.
> Working on the homepage or `press/` components: use the `/pressroom` skill.
> Working on the raw-HTML design explorations in `public/prototypes/`: use the
> `/prototypes` skill.
