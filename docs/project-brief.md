# Fever LTD — Project Brief

> Consolidated reference distilled from the discovery questionnaire and the
> kickoff meeting (Jun 19, 2026). Source of truth for the website rebuild.

## 1. Overview

Fever LTD is a **record label**. The goal is to replace the current site —
which the client feels is "too simple, nothing operates, not professional or
legit" — with a polished, professional record-label site that drives sales.

- **Audience:** Music lovers.
- **Primary visitor actions:** Stream music, buy records/physical media,
  subscribe to a mailing list.
- **Success looks like:** More sales, a cleaner site, easy to edit, and fun to
  navigate. _"Look like an actual record label site, feel more polished, drive
  more traffic for sales."_

### Top 3 must-haves
1. Look like an actual record label site.
2. Feel more polished.
3. Drive more traffic for sales.

## 2. Key Decisions (from kickoff meeting)

- **Build new, not fix.** A completely new site rather than patching the broken
  current one.
- **Design aesthetic:** Bright, clean, professional. White background with red
  accents.
- **Navigation simplified:** Top-level nav is **Shop, News, Artists, Socials**.
  No standalone "About" or "Contact" / "Culture" pages.
  - Note: the questionnaire originally listed About + Releases as pages. The
    meeting trimmed the nav to the four above. "Releases" still exists as a
    page/section (catalog), and About info can fold in elsewhere. Confirm final
    placement of About/contact info and Releases in nav.
- **Shop** is the e-commerce section name (distinct from the label name); links
  out to Big Cartel.
- **Releases page** included to showcase the label catalog, managed via admin.
- **Hosting:** Migrate to **Vercel** (~$20/mo total, client pays $10/mo).
  Decommission the existing **DigitalOcean** instance after migration.

## 3. Site Structure & Pages

| Page | Purpose |
| :--- | :--- |
| **Homepage** | Artist carousel + latest releases + recent news (see layout below). |
| **Shop** | Links to Big Cartel store (`feverltd.bigcartel.com`). Physical media only. |
| **News** | Admin-editable posts about the label. Supports embeds (YouTube video, audio), images, and one hero image per post. Separate page per post. |
| **Artists** | List of all bands w/ thumbnails + social links. "Listen" section linking to Spotify. Include band location. Tie in that artist's releases. Explore showing their Big Cartel shop items on the page. |
| **Releases** | Full list of all Fever LTD releases (past + present), managed in an admin. |
| **About** | Label info + contact info. (Removed from top nav — fold in elsewhere; confirm.) |
| **Socials** | Social icons in the header (right side). |

### Homepage layout
1. **Artist carousel** — rotates between artists, links to artist pages.
   Two options to prototype: (a) full-screen artist hero like Sunday Drive, or
   (b) a more minimal carousel.
2. **Latest Releases carousel** — newest label releases.
3. **News** — 3 most recent posts with thumbnails + link to the full News page.
4. **Footer** — links to all pages, with an **"F" logo**.

## 4. Content Management Requirements

- Client will publish **2–4 news posts per month**, typically around a new
  release.
- Posts must support **embedded YouTube video and audio**, plus images and a
  hero image.
- Move **away from the previous single-column scroll layout** toward a more
  engaging format.
- Releases and Artists are managed through an **admin** interface.
- **CMS approach:** Custom solution or a service like Contentful — TBD. Start on
  free tiers to control cost (accepting slightly slower performance initially).

## 5. Branding & Visual Direction

- **Feel:** Bright, clean, professional, minimalist.
- **Colors:** White background, **red accent `#c6352f`**. Background colors open
  to adjustment.
- **Typography:** Logo uses the **Huben** font
  ([misterfonts.com/huben](https://www.misterfonts.com/huben/)). Pair it with a
  compatible body/secondary font. Client to supply raw font files.
  - _Note: meeting notes transcribed this as "Human" font — actual font is Huben._
- **Imagery direction:** Bright, clean, and professional.
- **Assets needed from client:** Logo + footer **SVG** files, font files, band
  photography, and album artwork.

### Inspiration (likes)
- **[sundaydrive-records.com](https://sundaydrive-records.com)** — minimalist
  style, fonts, full-screen artist homepage, artist→shop integration
  ([collection example](https://sundaydrive-records.com/collections/mad-honey)),
  [news post example](https://sundaydrive-records.com/blogs/news/welcome-tuffie-to-sunday-drive-records).
- **[releasewave.com](https://releasewave.com)**

### Anti-inspiration (avoid)
- **purenoise.net** — sloppy; confusing which artists are which.
- **newmoralityzine.com** — cluttered.

## 6. Technical & Infrastructure

- **Hosting:** Vercel (under Andrew's account). Migrating off Contentful +
  DigitalOcean. Decommission DigitalOcean post-migration.
- **Domain:** `feverltd.com`, registered at **GoDaddy** (controlled by Kamtin).
- **Store:** **Big Cartel** (`feverltd.bigcartel.com`), used for **physical
  releases only**. Not every release has a physical component, so no full API
  integration is required for all releases. Explore surfacing shop items on
  artist pages.
- **Newsletter:** Needs a simple, cost-effective solution (TBD).
- **Recent traction:** "Chain Gang" single hit 15,000+ streams in two days,
  with placements on "All New Rock" and YouTube's "Your New Alternative" —
  signals the site should be ready to convert release momentum into sales.

## 7. Access & Accounts

| Account | Provider | Controlled by |
| :--- | :--- | :--- |
| Domain registrar | GoDaddy | Kamtin |
| Hosting (current → new) | Contentful + DigitalOcean → Vercel | Kamtin / Andrew |
| Online store / payments | Big Cartel | Kamtin |
| Business email | `kamtinmohager@gmail.com` | Kamtin |
| Newsletter | TBD | — |

## 8. Action Items / Next Steps

**Andrew**
- [ ] Gather registration info; query team for missing details.
- [ ] Propose 3 distinct homepage design concepts (screenshots for selection).
- [ ] Initialize the backend database for the project.
- [ ] Research cost-effective newsletter solutions.
- [ ] Begin prototype work.

**Kamtin (client)**
- [ ] Send band photography and album artwork.
- [ ] Send logo + footer **SVG** files.
- [ ] Send font files.
- [ ] Send Big Cartel + GoDaddy logins.
- [ ] Cancel DigitalOcean once migration is complete.

## 9. Open Questions

- Final placement of **About / contact info** and **Releases** now that nav is
  trimmed to Shop / News / Artists / Socials.
- **CMS choice:** custom vs. Contentful.
- **Newsletter** provider/tool.
- Confirm **secondary font** that pairs with Huben.
- Where the current site is actually **hosted** (client unsure beyond GoDaddy
  domain + DigitalOcean).

---

_Sources: `Fever LTD - Discovery.md` (discovery questionnaire),
`Meeting started 2026_06_19 12_08 PDT - Notes by Gemini.md` (kickoff meeting,
Jun 19, 2026)._
