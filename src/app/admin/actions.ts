"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getAdminSession } from "@/auth";
import { slugify } from "@/lib/utils";
import {
  artistSchema,
  releaseSchema,
  type ActionResult,
  type ArtistInput,
  type ReleaseInput,
} from "@/lib/cms";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");
  return session;
}

/** Map a Prisma unique-constraint error to a friendly field message. */
function uniqueError(error: unknown): string | null {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    const target = error.meta?.target;
    const fields = Array.isArray(target) ? target.join(", ") : String(target);
    if (fields.includes("slug")) {
      return "That slug is already taken. Try a different one.";
    }
    if (fields.includes("catalogNo")) {
      return "That catalog number is already in use.";
    }
    return "A record with these details already exists.";
  }
  return null;
}

function revalidateArtists() {
  revalidatePath("/admin");
  revalidatePath("/admin/artists");
  revalidatePath("/");
}

function revalidateReleases() {
  revalidatePath("/admin");
  revalidatePath("/admin/releases");
  revalidatePath("/");
  revalidatePath("/releases");
}

/* ------------------------------------------------------------------ */
/* Artists                                                            */
/* ------------------------------------------------------------------ */

export async function createArtist(input: ArtistInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = artistSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const { name, slug, bio, imageUrl, website } = parsed.data;

  try {
    await prisma.artist.create({
      data: {
        name,
        slug: slug ?? slugify(name),
        bio,
        imageUrl,
        website,
      },
    });
  } catch (error) {
    const friendly = uniqueError(error);
    if (friendly) return { ok: false, error: friendly };
    throw error;
  }

  revalidateArtists();
  return { ok: true };
}

export async function updateArtist(
  id: string,
  input: ArtistInput,
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = artistSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const { name, slug, bio, imageUrl, website } = parsed.data;

  try {
    await prisma.artist.update({
      where: { id },
      data: {
        name,
        slug: slug ?? slugify(name),
        bio: bio ?? null,
        imageUrl: imageUrl ?? null,
        website: website ?? null,
      },
    });
  } catch (error) {
    const friendly = uniqueError(error);
    if (friendly) return { ok: false, error: friendly };
    throw error;
  }

  revalidateArtists();
  return { ok: true };
}

export async function deleteArtist(id: string): Promise<ActionResult> {
  await requireAdmin();
  try {
    await prisma.artist.delete({ where: { id } });
  } catch {
    return { ok: false, error: "Could not delete artist." };
  }
  revalidateArtists();
  return { ok: true };
}

/* ------------------------------------------------------------------ */
/* Releases                                                           */
/* ------------------------------------------------------------------ */

export async function createRelease(
  input: ReleaseInput,
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = releaseSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const { title, slug, catalogNo, description, coverUrl, releaseDate, status, artistId } =
    parsed.data;

  try {
    await prisma.release.create({
      data: {
        title,
        slug: slug ?? slugify(title),
        catalogNo,
        description,
        coverUrl,
        releaseDate: releaseDate ? new Date(releaseDate) : null,
        status,
        artistId,
      },
    });
  } catch (error) {
    const friendly = uniqueError(error);
    if (friendly) return { ok: false, error: friendly };
    throw error;
  }

  revalidateReleases();
  return { ok: true };
}

export async function updateRelease(
  id: string,
  input: ReleaseInput,
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = releaseSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const { title, slug, catalogNo, description, coverUrl, releaseDate, status, artistId } =
    parsed.data;

  try {
    await prisma.release.update({
      where: { id },
      data: {
        title,
        slug: slug ?? slugify(title),
        catalogNo: catalogNo ?? null,
        description: description ?? null,
        coverUrl: coverUrl ?? null,
        releaseDate: releaseDate ? new Date(releaseDate) : null,
        status,
        artistId,
      },
    });
  } catch (error) {
    const friendly = uniqueError(error);
    if (friendly) return { ok: false, error: friendly };
    throw error;
  }

  revalidateReleases();
  return { ok: true };
}

export async function deleteRelease(id: string): Promise<ActionResult> {
  await requireAdmin();
  try {
    await prisma.release.delete({ where: { id } });
  } catch {
    return { ok: false, error: "Could not delete release." };
  }
  revalidateReleases();
  return { ok: true };
}
