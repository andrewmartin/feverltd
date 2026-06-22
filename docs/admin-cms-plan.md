# Fever LTD — Admin CMS Plan

> Reference for building out the `/admin` CMS. Distilled from the project brief
> and the existing scaffold. Living doc — update as we go.

## 1. Goal

A clean, easy-to-use admin to manage the label's content: **Artists**,
**Releases**, and **News**. Built on the existing Next.js 16 + Prisma + Postgres
stack, using **shadcn/ui**, **React Query** (collections), **react-hook-form +
zod** (forms), and **server actions** (mutations) with **sonner** toasts.

## 2. Key decisions

| Area | Decision |
| :--- | :--- |
| ORM | **Prisma** (already wired). Postgres via **Postgres.app** locally. |
| Local DB | `feverltd` on `postgresql://andrewmartin@localhost:5432/feverltd`. |
| Auth (dev) | **Turned OFF** via `ADMIN_AUTH_DISABLED="true"`. Guard pattern stays wired everywhere; the shared helper short-circuits to a synthetic admin. Hard-fails closed in production. |
| Auth (prod) | Google sign-in + email allowlist: `hello@andrewmart.in`, `kamtin.mohager@gmail.com`. |
| Release ↔ Artist | **Many-to-many** (implicit join `_ArtistToRelease`). A release can credit multiple artists; an artist appears on many releases. |
| Delete safety | **Restrict**: deleting an artist that still has releases is **blocked** (enforced in the server action). |
| Create flow | **Separate sections**: create Artists first, then pick them (multi-select) on the Release form. |
| Owners | **None** — content is not owner-scoped (MVP). |
| Data fetching | Collections/tables → **React Query** against guarded `GET /api/admin/*` route handlers. Mutations → **server actions**, then invalidate queries + toast. |
| UI | **shadcn/ui**, light theme scoped under `.admin`; brand red `#c6352f` as `--primary`. Public site keeps its existing look. |

## 3. Data model (current)

```
Artist (id, name, slug*, bio?, imageUrl?, website?)
  releases  Release[]  @relation("ArtistReleases")   // M:N

Release (id, title, slug*, catalogNo*?, description?, coverUrl?, releaseDate?, status)
  status   DRAFT | PUBLISHED
  artists  Artist[]   @relation("ArtistReleases")     // M:N (>= 1 in the form)
  tracks   Track[]

Track (id, title, position, duration?, releaseId)     // @@unique(releaseId, position)

NewsPost (id, title, slug*, excerpt?, body?, heroImage?, status, publishedAt?)
  status   DRAFT | PUBLISHED                            // PostStatus
```

`*` = unique. Public reads only ever return `PUBLISHED` rows.

## 4. Auth pattern (the important bit)

- `src/lib/admin.ts` → `isAuthDisabled()` (edge-safe) + `DEV_ADMIN` synthetic user.
- `getAdminSession()` (`src/auth.ts`) returns `DEV_ADMIN` when disabled, else the
  real session gated by role/allowlist.
- `authorized()` callback (`src/auth.config.ts`) lets `/admin` through when disabled.
- **Every server action calls `requireAdmin()`** (which uses `getAdminSession()`).
  That call stays in place — flipping `ADMIN_AUTH_DISABLED` back to unset re-arms
  the whole thing. Route handlers under `/api/admin/*` use the same guard.

To re-enable auth: set `ADMIN_AUTH_DISABLED=""` (or remove it) and fill in
`AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET`.

## 5. Shared layer (foundation — build first, then parallelize)

Owned centrally so feature agents don't collide:

- `prisma/schema.prisma` — models (done).
- `src/lib/cms.ts` — zod schemas (`artistSchema`, `releaseSchema`, `newsSchema`)
  + admin read helpers (`listArtists`, `listReleases`, `listNews`, `getX`, stats).
- `src/lib/catalog.ts` — public read helpers (M:N aware).
- `src/app/admin/actions.ts` — server actions (artist/release/news CRUD + restrict).
- `src/app/api/admin/{artists,releases,news}/route.ts` — guarded GET for React Query.
- `src/components/ui/*` — shadcn primitives (done).
- `src/app/admin/layout.tsx` + shell — `.admin` theme wrapper, nav, Toaster.
- `src/lib/admin-queries.ts` — React Query keys + fetchers (client).

## 6. Parallelizable feature work (subagents)

Each agent owns a disjoint set of files. No shared-file writes.

### Agent A — Artists admin
- `src/app/admin/artists/page.tsx` (RQ table), `new/page.tsx`, `[id]/page.tsx`
- `src/components/admin/artist-form.tsx`, `artists-table.tsx`
- Uses: `artistSchema`, artist actions, `/api/admin/artists`.

### Agent B — Releases admin
- `src/app/admin/releases/page.tsx` (RQ table), `new/page.tsx`, `[id]/page.tsx`
- `src/components/admin/release-form.tsx` (multi-select artists), `releases-table.tsx`
- Uses: `releaseSchema`, release actions, `/api/admin/releases`, artist options.

### Agent C — News admin (new)
- `src/app/admin/news/page.tsx` (RQ table), `new/page.tsx`, `[id]/page.tsx`
- `src/components/admin/news-form.tsx`, `news-table.tsx`
- Uses: `newsSchema`, news actions, `/api/admin/news`.

### Agent D — Public-site M:N fixups
- `src/app/page.tsx`, `artists/[slug]`, `releases/[slug]`, `releases/page.tsx`
- `src/components/site/release-card.tsx`, `marketing/*`
- Swap single `release.artist` → `release.artists[]` display.

Shared building blocks every agent reuses:
- `<DataTable>` shell, `<DeleteDialog>` (alert-dialog), `<StatusBadge>`,
  `<FormShell>` (card + actions), toast helpers.

## 7. Build checklist

**Foundation**
- [x] Local Postgres.app DB `feverltd` + env wired
- [x] `ADMIN_AUTH_DISABLED` dev bypass (helper + session + proxy)
- [x] Add `kamtin.mohager@gmail.com` to allowlist
- [x] `NewsPost` + `PostStatus` model, M:N Release↔Artist, `db push`
- [x] shadcn init + core components + `.admin` light theme
- [x] `cms.ts` schemas + admin reads (M:N, news)
- [x] `catalog.ts` public reads (M:N)
- [x] `actions.ts` (M:N release, restrict artist delete, news CRUD)
- [x] `/api/admin/*` guarded GET routes
- [x] React Query query-keys/fetchers + admin shell (Toaster, `.admin`)

**Features (parallel)**
- [x] Artists admin (table + form CRUD) — reference implementation
- [x] Releases admin (table + multi-artist form CRUD)
- [x] News admin (table + form CRUD)
- [x] Public-site M:N display fixups
- [x] Update `prisma/seed.ts` for M:N (not yet run — ask before seeding)
- [x] `typecheck` green (note: `next lint` removed in Next 16; ESLint config is
      pre-existing flat-config debt, unrelated to this work)

**Verified end-to-end (Playwright, dev bypass on):** create artist (auto-slug +
toast), create published release crediting that artist (M:N checkbox + Base UI
status select), admin tables via React Query, Restrict delete blocked the artist
with releases, public `/releases` shows the credited artist. Test rows removed —
DB left empty.
