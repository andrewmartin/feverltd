import { PrismaClient, ReleaseStatus, PostStatus } from "@prisma/client";

const prisma = new PrismaClient();

// Real Fever LTD roster + physical catalog, distilled from docs/project-brief.md
// and public/reference/artists/*/info.md. Formats (Vinyl/CD/Tape) are folded into
// the release description since the schema has no dedicated format field.
//
// Imagery points at the committed reference assets under `public/reference/...`
// (served at `/reference/...`), URL-encoded. A few covers are press-photo
// placeholders where real artwork is still outstanding — flagged inline.

type ArtistSeed = {
  name: string;
  slug: string;
  bio: string;
  imageUrl: string;
  location: string;
  genre: string;
  website: string;
};

type ReleaseSeed = {
  title: string;
  slug: string;
  catalogNo: string;
  artistSlug: string;
  description: string;
  releaseDate: string;
  coverUrl: string;
};

type NewsSeed = {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  heroImage: string;
  publishedAt: string;
};

const ARTISTS: ArtistSeed[] = [
  {
    name: "The Chain Gang of 1974",
    slug: "the-chain-gang-of-1974",
    bio: "The Chain Gang of 1974 is the solo electronic / synth-rock project of Kamtin Mohager — the songwriter who founded Fever LTD. Across a decade of records he's built a widescreen, synth-forward sound that bridges indie and dance, from festival stages to the vinyl he now presses himself. Recent Fever LTD releases include 'Honey Moon Drips' and 'Besides/Pollen'.",
    imageUrl: "/reference/artists/Chain%20Gang%20of%201974/05-spotify-artist.jpg",
    location: "Los Angeles, CA",
    genre: "Synth-rock / electronic",
    website: "https://chaingangof1974.bandcamp.com",
  },
  {
    name: "Mascara",
    slug: "mascara",
    bio: "Mascara are a four-piece from Paris turning shoegaze heavy — blown-out low end, walls of guitar, and melody buried deep in the haze. Equal parts alt-gaze and post-hardcore, they trade dream-pop prettiness for sheer weight. Their debut LP 'Going Postal' arrived on Fever LTD in March 2026, pressed to a limited run of vinyl.",
    imageUrl: "/reference/artists/Mascara/04-press-photo-releasewave.jpg",
    location: "Paris, France",
    genre: "Alt-gaze / heavy shoegaze",
    website: "https://worshipmascara.bandcamp.com",
  },
  {
    name: "Valley of Doves",
    slug: "valley-of-doves",
    bio: "Valley of Doves are a post-hardcore band from Birmingham, Alabama. Patient and cathartic, they build songs for the room's last moment — slow-burning tension that breaks wide open. Their record 'Constant Remembrance of Wanting Nothing' arrived on CD via Fever LTD in 2026.",
    imageUrl: "/reference/artists/Valley%20of%20Doves/08-promo-r6i9710.jpg",
    location: "Birmingham, AL",
    genre: "Post-hardcore",
    website: "https://linktr.ee/valleyofdoves",
  },
  {
    name: "Teenage Wrist",
    slug: "teenage-wrist",
    bio: "Teenage Wrist are an LA alternative band — Marshall Gallagher and Anthony Salazar — trading in fuzzed-out, melodic shoegaze and grunge. Longtime Epitaph travelers, they pair big hooks with a wall of distortion. Their album 'Dazed' returned as a 2025 remaster on Fever LTD across two color-variant vinyl pressings.",
    imageUrl:
      "/reference/artists/Teenage%20Wrist/01-epitaph-press-photo-joe-calixto.png",
    location: "Los Angeles, CA",
    genre: "Alternative / shoegaze",
    website: "https://teenagewrist.com",
  },
  {
    name: "Muted Color",
    slug: "muted-color",
    bio: "Muted Color are a Chicago five-piece — Tom Aparici, David Bieschke, Tyler Gargula, Brandon Montemayor and Jethro Tacuboy — washing dream-pop melodies in shoegaze haze. Their sound is all reverb-soaked guitars and buried vocals. Fever LTD has pressed their LP 'Take I Lovely You' to vinyl and 'Radial' to cassette.",
    imageUrl: "/reference/artists/Muted%20Color/01-band-photo-bandcamp.jpg",
    location: "Chicago, IL",
    genre: "Shoegaze / dream-pop",
    website: "https://linktr.ee/mutedcolor",
  },
  {
    name: "Fly Over States",
    slug: "fly-over-states",
    bio: "Fly Over States are a Montana screamo / post-hardcore quartet — Gunnar Stephan, Trevin Baker, Caleb Haynes and Jax Sutton. Urgent and raw (and yes, the band — not the country song), they swing between blistering aggression and melodic release. Their EP 'Ghosts' landed on CD via Fever LTD in 2024.",
    imageUrl: "/reference/artists/Fly%20Over%20States/05-press-photo-2024.jpg",
    location: "Billings, MT",
    genre: "Post-hardcore / screamo",
    website: "https://flyoverstatesband.bandcamp.com",
  },
  {
    name: "En Masse",
    slug: "en-masse",
    bio: "En Masse are a Connecticut post-hardcore band fronted by Zack Santiago, with Jari Javier on guitar and Peter Parkes on bass. Direct and unrelenting, they keep things lean and heavy. Their EP 'newviolenttrends' arrived on CD via Fever LTD in June 2025.",
    imageUrl: "/reference/artists/En%20Masse/02-press-photo-frontview.jpg",
    location: "Connecticut",
    genre: "Post-hardcore",
    website: "https://enmasseband.bandcamp.com",
  },
  {
    name: "Dogs Run Free",
    slug: "dogs-run-free",
    bio: "Dogs Run Free are an alt-rock duo from Cleveland, Ohio — Austyn Benyak and Zac Breitbach. Lean and melodic, they make the most of two players and no filler. Their EP 'Normal' got a limited cassette pressing on Fever LTD in 2024.",
    imageUrl: "/reference/artists/Dogs%20Run%20Free/02-bandcamp-band-photo.jpg",
    location: "Cleveland, OH",
    genre: "Alt-rock",
    website: "https://linktr.ee/dogsrunfree",
  },
];

const RELEASES: ReleaseSeed[] = [
  {
    title: "Ghosts",
    slug: "ghosts",
    catalogNo: "FEV001",
    artistSlug: "fly-over-states",
    description: "EP · CD.",
    releaseDate: "2024-05-01",
    coverUrl: "/reference/artists/Fly%20Over%20States/04-ghosts-cover-art.png",
  },
  {
    title: "Normal",
    slug: "normal",
    catalogNo: "FEV002",
    artistSlug: "dogs-run-free",
    description: "EP · Cassette tape.",
    releaseDate: "2024-09-01",
    coverUrl: "/reference/artists/Dogs%20Run%20Free/03-normal-album-art.jpg",
  },
  {
    title: "newviolenttrends",
    slug: "newviolenttrends",
    catalogNo: "FEV003",
    artistSlug: "en-masse",
    description: "EP · CD.",
    releaseDate: "2025-06-20",
    coverUrl: "/reference/artists/En%20Masse/04-album-art-newviolenttrends.jpg",
  },
  {
    title: "Dazed (2025 Remaster)",
    slug: "dazed-2025-remaster",
    catalogNo: "FEV004",
    artistSlug: "teenage-wrist",
    description:
      "Vinyl · two color variants (Neon Green/Black Swirl, Opaque Neon Green).",
    releaseDate: "2025-07-01",
    // TODO: placeholder cover (press photo) — request real artwork.
    coverUrl: "/reference/artists/Teenage%20Wrist/04-newnoise-by-joe-calixto.jpg",
  },
  {
    title: "Honey Moon Drips",
    slug: "honey-moon-drips",
    catalogNo: "FEV005",
    artistSlug: "the-chain-gang-of-1974",
    description: "Vinyl · signed + unsigned editions.",
    releaseDate: "2025-09-01",
    // TODO: placeholder cover (press photo) — request real artwork.
    coverUrl: "/reference/artists/Chain%20Gang%20of%201974/04-bandcamp-profile.jpg",
  },
  {
    title: "Besides/Pollen",
    slug: "besides-pollen",
    catalogNo: "FEV006",
    artistSlug: "the-chain-gang-of-1974",
    description: "Vinyl.",
    releaseDate: "2025-10-01",
    // TODO: placeholder cover (press photo) — request real artwork.
    coverUrl:
      "/reference/artists/Chain%20Gang%20of%201974/01-wikimedia-live-2014.jpg",
  },
  {
    title: "Take I Lovely You",
    slug: "take-i-lovely-you",
    catalogNo: "FEV007",
    artistSlug: "muted-color",
    description: "Vinyl.",
    releaseDate: "2025-11-01",
    coverUrl: "/reference/artists/Muted%20Color/03-take-i-lovely-you-cover.jpg",
  },
  {
    title: "Radial",
    slug: "radial",
    catalogNo: "FEV008",
    artistSlug: "muted-color",
    description: "Cassette tape.",
    releaseDate: "2026-01-15",
    coverUrl: "/reference/artists/Muted%20Color/04-radial-cover.jpg",
  },
  {
    title: "Going Postal",
    slug: "going-postal",
    catalogNo: "FEV009",
    artistSlug: "mascara",
    description: "Debut LP · Vinyl.",
    releaseDate: "2026-03-13",
    coverUrl: "/reference/artists/Mascara/03-going-postal-cover.jpg",
  },
  {
    title: "Constant Remembrance of Wanting Nothing",
    slug: "constant-remembrance-of-wanting-nothing",
    catalogNo: "FEV010",
    artistSlug: "valley-of-doves",
    description: "CD.",
    releaseDate: "2026-03-20",
    coverUrl: "/reference/artists/Valley%20of%20Doves/04-feverltd-cd-product.png",
  },
];

const NEWS: NewsSeed[] = [
  {
    title: "15,000 Streams in 48 Hours",
    slug: "chain-gang-15k-streams",
    excerpt:
      "The Chain Gang of 1974's new single landed on All New Rock and YouTube's Your New Alternative.",
    body: "The Chain Gang of 1974's new single cleared 15,000 streams in its first 48 hours, picking up early adds on Spotify's All New Rock and YouTube's Your New Alternative.\n\nIt's the strongest opening week yet for Kamtin Mohager's synth-rock project — and a good omen for the run of records landing on Fever LTD this year.",
    heroImage: "/reference/artists/Chain%20Gang%20of%201974/05-spotify-artist.jpg",
    publishedAt: "2026-06-17",
  },
  {
    title: "Mascara — 'Going Postal' Out Now",
    slug: "mascara-going-postal-out-now",
    excerpt: "The Paris shoegaze outfit's first full-length, pressed to vinyl.",
    body: "Mascara's debut LP 'Going Postal' is out now on Fever LTD, pressed to vinyl. The Paris four-piece turn shoegaze heavy across ten tracks — all blown-out low end and melody buried in the haze.\n\nThe vinyl is a limited pressing. When it's gone, it's gone.",
    heroImage: "/reference/artists/Mascara/03-going-postal-cover.jpg",
    publishedAt: "2026-03-13",
  },
  {
    title: "Valley of Doves on CD",
    slug: "valley-of-doves-on-cd",
    excerpt:
      "The Birmingham post-hardcore record 'Constant Remembrance of Wanting Nothing' arrives.",
    body: "Valley of Doves' 'Constant Remembrance of Wanting Nothing' arrives on CD via Fever LTD. The Birmingham, Alabama post-hardcore band built this one patient and cathartic — made for the room's last song.\n\nPressed to CD and shipping now from the Fever LTD shop.",
    heroImage: "/reference/artists/Valley%20of%20Doves/04-feverltd-cd-product.png",
    publishedAt: "2026-03-01",
  },
  {
    title: "Muted Color — 'Radial' Lands on Cassette",
    slug: "muted-color-radial-cassette",
    excerpt:
      "The Chicago dream-pop five-piece's 'Radial' gets a limited tape run.",
    body: "Muted Color's 'Radial' is out on cassette via Fever LTD — a limited tape run for the Chicago five-piece washing dream-pop in shoegaze haze.\n\nIt follows their vinyl LP 'Take I Lovely You', also on the label.",
    heroImage: "/reference/artists/Muted%20Color/04-radial-cover.jpg",
    publishedAt: "2026-01-15",
  },
  {
    title: "Muted Color — 'Take I Lovely You' on Vinyl",
    slug: "muted-color-take-i-lovely-you-vinyl",
    excerpt: "The Chicago band's full-length gets a Fever LTD vinyl pressing.",
    body: "Muted Color's 'Take I Lovely You' is out on vinyl via Fever LTD. The Chicago five-piece — Tom Aparici, David Bieschke, Tyler Gargula, Brandon Montemayor and Jethro Tacuboy — turn in their fullest statement yet.\n\nA limited pressing; grab one from the shop.",
    heroImage: "/reference/artists/Muted%20Color/03-take-i-lovely-you-cover.jpg",
    publishedAt: "2025-11-01",
  },
  {
    title: "The Chain Gang of 1974 — 'Honey Moon Drips'",
    slug: "chain-gang-honey-moon-drips",
    excerpt: "Signed and unsigned vinyl editions of the new record, out now.",
    body: "'Honey Moon Drips' is out now on Fever LTD — the latest from label founder Kamtin Mohager's The Chain Gang of 1974, pressed to vinyl in signed and unsigned editions.\n\nSigned copies are strictly limited.",
    heroImage: "/reference/artists/Chain%20Gang%20of%201974/04-bandcamp-profile.jpg",
    publishedAt: "2025-09-01",
  },
  {
    title: "Teenage Wrist — 'Dazed' Returns on Vinyl",
    slug: "teenage-wrist-dazed-remaster",
    excerpt:
      "The 2025 remaster lands in two color variants — Neon Green already sold out.",
    body: "Teenage Wrist's 'Dazed' returns as a 2025 remaster on Fever LTD, pressed in two color variants: a Neon Green / Black Swirl and an Opaque Neon Green.\n\nThe Neon Green / Black Swirl variant has already sold out. Opaque Neon Green remains while supplies last.",
    heroImage: "/reference/artists/Teenage%20Wrist/04-newnoise-by-joe-calixto.jpg",
    publishedAt: "2025-07-01",
  },
  {
    title: "En Masse — 'newviolenttrends' EP",
    slug: "en-masse-newviolenttrends",
    excerpt: "Connecticut post-hardcore from Zack Santiago and co., on CD.",
    body: "En Masse's 'newviolenttrends' EP is out on CD via Fever LTD. The Connecticut post-hardcore band — fronted by Zack Santiago — keep it urgent and direct across the EP.\n\nCDs are shipping now from the shop.",
    heroImage: "/reference/artists/En%20Masse/04-album-art-newviolenttrends.jpg",
    publishedAt: "2025-06-20",
  },
  {
    title: "Dogs Run Free — 'Normal' on Cassette",
    slug: "dogs-run-free-normal-tape",
    excerpt: "The Cleveland alt-rock duo's EP gets a Fever LTD tape pressing.",
    body: "Dogs Run Free's 'Normal' EP is out on cassette via Fever LTD. The Cleveland, Ohio alt-rock duo of Austyn Benyak and Zac Breitbach keep it lean across the tape.\n\nLimited cassette run — available from the Fever LTD shop.",
    heroImage: "/reference/artists/Dogs%20Run%20Free/03-normal-album-art.jpg",
    publishedAt: "2024-09-01",
  },
];

// ⚠️  CLAUDE / DEV NOTE — WE ARE LIVE IN PRODUCTION (since 2026-06).
// This seed UPSERTS by slug. It does not delete rows, but every run OVERWRITES
// the live artist/release/news fields (imageUrl, bio, copy, …) back to the
// hardcoded values below — clobbering any edits made in production (e.g. the
// Valley of Doves photo swap, admin changes). DO NOT reseed prod casually.
//
// As a safeguard, this script refuses to run unless ALLOW_SEED=1 is set:
//   ALLOW_SEED=1 bun run prisma/seed.ts
// Intended only for a fresh/empty database (initial bootstrap or local dev).
async function main() {
  if (process.env.ALLOW_SEED !== "1") {
    console.error(
      "✋ Seed aborted. Fever LTD is LIVE and this seed overwrites production " +
        "content by slug. If you really mean to (re)seed, re-run with " +
        "ALLOW_SEED=1 — and confirm you are NOT pointed at the prod database.",
    );
    process.exit(1);
  }

  console.log("🌱 Seeding Fever LTD…");

  const artistIdBySlug = new Map<string, string>();
  for (const a of ARTISTS) {
    const artist = await prisma.artist.upsert({
      where: { slug: a.slug },
      update: {
        name: a.name,
        bio: a.bio,
        imageUrl: a.imageUrl,
        location: a.location,
        genre: a.genre,
        website: a.website,
      },
      create: {
        name: a.name,
        slug: a.slug,
        bio: a.bio,
        imageUrl: a.imageUrl,
        location: a.location,
        genre: a.genre,
        website: a.website,
      },
    });
    artistIdBySlug.set(a.slug, artist.id);
  }

  for (const r of RELEASES) {
    const artistId = artistIdBySlug.get(r.artistSlug);
    if (!artistId) throw new Error(`Unknown artist slug: ${r.artistSlug}`);
    await prisma.release.upsert({
      where: { slug: r.slug },
      update: {
        title: r.title,
        catalogNo: r.catalogNo,
        description: r.description,
        coverUrl: r.coverUrl,
        releaseDate: new Date(r.releaseDate),
        status: ReleaseStatus.PUBLISHED,
        // Many-to-many: replace credited artists with this one.
        artists: { set: [{ id: artistId }] },
      },
      create: {
        title: r.title,
        slug: r.slug,
        catalogNo: r.catalogNo,
        description: r.description,
        coverUrl: r.coverUrl,
        releaseDate: new Date(r.releaseDate),
        status: ReleaseStatus.PUBLISHED,
        artists: { connect: [{ id: artistId }] },
      },
    });
  }

  for (const n of NEWS) {
    await prisma.newsPost.upsert({
      where: { slug: n.slug },
      update: {
        title: n.title,
        excerpt: n.excerpt,
        body: n.body,
        heroImage: n.heroImage,
        status: PostStatus.PUBLISHED,
        publishedAt: new Date(n.publishedAt),
      },
      create: {
        title: n.title,
        slug: n.slug,
        excerpt: n.excerpt,
        body: n.body,
        heroImage: n.heroImage,
        status: PostStatus.PUBLISHED,
        publishedAt: new Date(n.publishedAt),
      },
    });
  }

  console.log(
    `✅ Seed complete — ${ARTISTS.length} artists, ${RELEASES.length} releases, ${NEWS.length} news posts.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
