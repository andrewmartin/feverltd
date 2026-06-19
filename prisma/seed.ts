import { PrismaClient, ReleaseStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Fever Ltd…");

  const aphelion = await prisma.artist.upsert({
    where: { slug: "aphelion" },
    update: {},
    create: {
      name: "Aphelion",
      slug: "aphelion",
      bio: "Glacial techno from the northern reaches.",
      website: "https://example.com/aphelion",
    },
  });

  const velour = await prisma.artist.upsert({
    where: { slug: "velour" },
    update: {},
    create: {
      name: "Velour",
      slug: "velour",
      bio: "Dream-pop with a fever.",
    },
  });

  await prisma.release.upsert({
    where: { slug: "event-horizon" },
    update: {},
    create: {
      title: "Event Horizon",
      slug: "event-horizon",
      catalogNo: "FEV001",
      description: "The debut EP. Four tracks pulled toward the edge.",
      status: ReleaseStatus.PUBLISHED,
      releaseDate: new Date("2026-03-14"),
      artistId: aphelion.id,
      tracks: {
        create: [
          { title: "Singularity", position: 1, duration: 327 },
          { title: "Redshift", position: 2, duration: 254 },
          { title: "Accretion", position: 3, duration: 401 },
          { title: "Escape Velocity", position: 4, duration: 288 },
        ],
      },
    },
  });

  await prisma.release.upsert({
    where: { slug: "soft-static" },
    update: {},
    create: {
      title: "Soft Static",
      slug: "soft-static",
      catalogNo: "FEV002",
      description: "A hazy debut single.",
      status: ReleaseStatus.PUBLISHED,
      releaseDate: new Date("2026-05-02"),
      artistId: velour.id,
      tracks: {
        create: [{ title: "Soft Static", position: 1, duration: 219 }],
      },
    },
  });

  console.log("✅ Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
