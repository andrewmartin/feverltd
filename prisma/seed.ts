import { PrismaClient, ReleaseStatus } from "@prisma/client";

const prisma = new PrismaClient();

// Real Fever LTD roster + physical catalog, distilled from docs/project-brief.md
// and public/reference/artists/*/info.md. Formats (Vinyl/CD/Tape) are folded into
// the release description since the schema has no dedicated format field.

type ArtistSeed = {
  name: string;
  slug: string;
  bio: string;
};

type ReleaseSeed = {
  title: string;
  slug: string;
  catalogNo: string;
  artistSlug: string;
  description: string;
  releaseDate: string;
};

const ARTISTS: ArtistSeed[] = [
  {
    name: "The Chain Gang of 1974",
    slug: "the-chain-gang-of-1974",
    bio: "The solo electronic / synth-rock project of Kamtin Mohager, founder of Fever LTD.",
  },
  {
    name: "Mascara",
    slug: "mascara",
    bio: "Heavy shoegaze / alt-gaze from Paris, France.",
  },
  {
    name: "Valley of Doves",
    slug: "valley-of-doves",
    bio: "Post-hardcore from Birmingham, Alabama.",
  },
  {
    name: "Teenage Wrist",
    slug: "teenage-wrist",
    bio: "Fuzzed-out, melodic alternative / shoegaze from Los Angeles, CA.",
  },
  {
    name: "Muted Color",
    slug: "muted-color",
    bio: "Shoegaze / dream-pop from Chicago, IL.",
  },
  {
    name: "Fly Over States",
    slug: "fly-over-states",
    bio: "Post-hardcore / screamo from Montana.",
  },
  {
    name: "En Masse",
    slug: "en-masse",
    bio: "Post-hardcore from Connecticut.",
  },
  {
    name: "Dogs Run Free",
    slug: "dogs-run-free",
    bio: "Alt-rock duo from Cleveland, Ohio.",
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
  },
  {
    title: "Normal",
    slug: "normal",
    catalogNo: "FEV002",
    artistSlug: "dogs-run-free",
    description: "EP · Cassette tape.",
    releaseDate: "2024-09-01",
  },
  {
    title: "newviolenttrends",
    slug: "newviolenttrends",
    catalogNo: "FEV003",
    artistSlug: "en-masse",
    description: "EP · CD.",
    releaseDate: "2025-06-20",
  },
  {
    title: "Dazed (2025 Remaster)",
    slug: "dazed-2025-remaster",
    catalogNo: "FEV004",
    artistSlug: "teenage-wrist",
    description:
      "Vinyl · two color variants (Neon Green/Black Swirl, Opaque Neon Green).",
    releaseDate: "2025-07-01",
  },
  {
    title: "Honey Moon Drips",
    slug: "honey-moon-drips",
    catalogNo: "FEV005",
    artistSlug: "the-chain-gang-of-1974",
    description: "Vinyl · signed + unsigned editions.",
    releaseDate: "2025-09-01",
  },
  {
    title: "Besides/Pollen",
    slug: "besides-pollen",
    catalogNo: "FEV006",
    artistSlug: "the-chain-gang-of-1974",
    description: "Vinyl.",
    releaseDate: "2025-10-01",
  },
  {
    title: "Take I Lovely You",
    slug: "take-i-lovely-you",
    catalogNo: "FEV007",
    artistSlug: "muted-color",
    description: "Vinyl.",
    releaseDate: "2025-11-01",
  },
  {
    title: "Radial",
    slug: "radial",
    catalogNo: "FEV008",
    artistSlug: "muted-color",
    description: "Cassette tape.",
    releaseDate: "2026-01-15",
  },
  {
    title: "Going Postal",
    slug: "going-postal",
    catalogNo: "FEV009",
    artistSlug: "mascara",
    description: "Debut LP · Vinyl.",
    releaseDate: "2026-03-13",
  },
  {
    title: "Constant Remembrance of Wanting Nothing",
    slug: "constant-remembrance-of-wanting-nothing",
    catalogNo: "FEV010",
    artistSlug: "valley-of-doves",
    description: "CD.",
    releaseDate: "2026-03-20",
  },
];

async function main() {
  console.log("🌱 Seeding Fever LTD…");

  const artistIdBySlug = new Map<string, string>();
  for (const a of ARTISTS) {
    const artist = await prisma.artist.upsert({
      where: { slug: a.slug },
      update: { name: a.name, bio: a.bio },
      create: { name: a.name, slug: a.slug, bio: a.bio },
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
        releaseDate: new Date(r.releaseDate),
        status: ReleaseStatus.PUBLISHED,
        artists: { connect: [{ id: artistId }] },
      },
    });
  }

  console.log(
    `✅ Seed complete — ${ARTISTS.length} artists, ${RELEASES.length} releases.`,
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
