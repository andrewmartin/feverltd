# Fever LTD

The website for **Fever LTD**, an independent record label — a public catalog of
artists & releases plus a small admin CMS to manage them.

## Stack

- **Next.js 16** (App Router) + **Turbopack** + **React 19** + **TypeScript** (strict)
- **Tailwind CSS v4** (CSS-first theme in `src/app/globals.css`)
- **Auth.js v5 / NextAuth** — Google sign-in, JWT sessions, Prisma adapter
- **TanStack React Query v5** (App Router per-request client)
- **Prisma 6** + PostgreSQL (Neon on Vercel)
- **react-hook-form** + **zod** for CMS forms & Server Action validation
- Deployed on **Vercel**

## Getting started

```bash
bun install
cp .env.example .env.local   # then fill in the values (see below)

# With a database configured:
bun run db:push              # create the schema
bun run db:seed              # seed the real roster + catalog

bun run dev                  # http://localhost:7878
```

The dev server runs on the **non-standard port 7878**. The landing page renders
with curated placeholder content even when no database is connected, so you can
boot it before provisioning Postgres.

### Environment variables (`.env.local`)

| Var | Purpose |
| :-- | :-- |
| `DATABASE_URL` / `DIRECT_URL` | Postgres connection (pooled / direct for migrations) |
| `AUTH_SECRET` | Auth.js secret — `openssl rand -base64 32` |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | Google OAuth credentials |
| `ADMIN_EMAILS` | Comma-separated allow-list of CMS admins |

For Google OAuth, set the authorized redirect URI to
`http://localhost:7878/api/auth/callback/google` (and the production equivalent).

## Scripts

| Script | Description |
| :-- | :-- |
| `bun run dev` | Dev server (Turbopack) on port 7878 |
| `bun run build` / `bun run start` | Production build / serve |
| `bun run typecheck` | `tsc --noEmit` |
| `bun run db:push` / `db:migrate` / `db:studio` / `db:seed` | Prisma helpers |

## Project structure

```
src/
  app/
    page.tsx            # landing page
    signin/             # Google sign-in
    releases/           # public catalog (list + [slug] detail)
    artists/            # public artist pages
    admin/              # CMS (gated to ADMIN role) — dashboard + CRUD
    api/auth/[...nextauth]/
  components/
    site/               # header, footer
    marketing/          # landing-page sections
    admin/              # CMS UI primitives
  lib/
    db.ts               # Prisma client singleton
    catalog.ts          # public (PUBLISHED) read helpers
    cms.ts              # admin zod schemas + read helpers
    query-client.ts     # React Query client factory
  auth.ts, auth.config.ts, proxy.ts   # Auth.js wiring + route gating
prisma/
  schema.prisma         # User/Account/Session + Artist/Release/Track
  seed.ts               # real Fever LTD roster + catalog
docs/                   # project brief + artist reference material
```

## Notes

- `/admin` is gated to users whose role is `ADMIN` (derived from `ADMIN_EMAILS`)
  via Auth.js + the edge `proxy.ts` (Next 16's renamed middleware).
- **Apple Silicon dev:** the local `dev`/`build`/`db:*` scripts pin
  `PATH` to the arm64 Homebrew node (`/opt/homebrew/bin`) so native modules
  (lightningcss, Tailwind oxide, Prisma) match the arm64 toolchain when an x64
  node is also installed. This is a no-op on Vercel's Linux build.
- The design (dark / lime) is a starting point; the brand brief calls for a
  **light theme with red accents** and **Shop / News / Artists / Socials** nav —
  see `docs/project-brief.md`.
