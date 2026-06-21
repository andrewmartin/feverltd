"use server";

import { revalidatePath } from "next/cache";
import { Prisma, SubscriberStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { deleteBlobIfOwned } from "@/lib/blob";
import { getAdminSession } from "@/auth";
import { slugify } from "@/lib/utils";
import {
  artistSchema,
  releaseSchema,
  newsSchema,
  type ActionResult,
  type ArtistInput,
  type ReleaseInput,
  type NewsInput,
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
  revalidatePath("/admin/releases");
  revalidatePath("/");
  revalidatePath("/artists");
}

function revalidateReleases() {
  revalidatePath("/admin");
  revalidatePath("/admin/releases");
  revalidatePath("/");
  revalidatePath("/releases");
}

function revalidateNews() {
  revalidatePath("/admin");
  revalidatePath("/admin/news");
  revalidatePath("/");
  revalidatePath("/news");
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
  const { name, slug, bio, imageUrl, website, location, genre, alumni } = parsed.data;

  try {
    await prisma.artist.create({
      data: { name, slug: slug ?? slugify(name), bio, imageUrl, website, location, genre, alumni },
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
  const { name, slug, bio, imageUrl, website, location, genre, alumni } = parsed.data;

  const previous = await prisma.artist.findUnique({
    where: { id },
    select: { imageUrl: true },
  });

  try {
    await prisma.artist.update({
      where: { id },
      data: {
        name,
        slug: slug ?? slugify(name),
        bio: bio ?? null,
        imageUrl: imageUrl ?? null,
        website: website ?? null,
        location: location ?? null,
        genre: genre ?? null,
        alumni,
      },
    });
  } catch (error) {
    const friendly = uniqueError(error);
    if (friendly) return { ok: false, error: friendly };
    throw error;
  }

  // Clean up a replaced/removed upload once the new value is persisted.
  if (previous?.imageUrl && previous.imageUrl !== imageUrl) {
    await deleteBlobIfOwned(previous.imageUrl);
  }

  revalidateArtists();
  return { ok: true };
}

export async function deleteArtist(id: string): Promise<ActionResult> {
  await requireAdmin();

  // Restrict: block deleting an artist that still credits releases.
  const releaseCount = await prisma.release.count({
    where: { artists: { some: { id } } },
  });
  if (releaseCount > 0) {
    return {
      ok: false,
      error: `Can't delete — this artist is credited on ${releaseCount} ${
        releaseCount === 1 ? "release" : "releases"
      }. Reassign or remove those first.`,
    };
  }

  const existing = await prisma.artist.findUnique({
    where: { id },
    select: { imageUrl: true },
  });

  try {
    await prisma.artist.delete({ where: { id } });
  } catch {
    return { ok: false, error: "Could not delete artist." };
  }
  await deleteBlobIfOwned(existing?.imageUrl);
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
  const { title, slug, catalogNo, description, coverUrl, buyUrl, releaseDate, status, artistIds } =
    parsed.data;

  try {
    await prisma.release.create({
      data: {
        title,
        slug: slug ?? slugify(title),
        catalogNo,
        description,
        coverUrl,
        buyUrl,
        releaseDate: releaseDate ? new Date(releaseDate) : null,
        status,
        artists: { connect: artistIds.map((id) => ({ id })) },
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
  const { title, slug, catalogNo, description, coverUrl, buyUrl, releaseDate, status, artistIds } =
    parsed.data;

  const previous = await prisma.release.findUnique({
    where: { id },
    select: { coverUrl: true },
  });

  try {
    await prisma.release.update({
      where: { id },
      data: {
        title,
        slug: slug ?? slugify(title),
        catalogNo: catalogNo ?? null,
        description: description ?? null,
        coverUrl: coverUrl ?? null,
        buyUrl: buyUrl ?? null,
        releaseDate: releaseDate ? new Date(releaseDate) : null,
        status,
        // `set` replaces the full M:N relation with the submitted artists.
        artists: { set: artistIds.map((id) => ({ id })) },
      },
    });
  } catch (error) {
    const friendly = uniqueError(error);
    if (friendly) return { ok: false, error: friendly };
    throw error;
  }

  if (previous?.coverUrl && previous.coverUrl !== coverUrl) {
    await deleteBlobIfOwned(previous.coverUrl);
  }

  revalidateReleases();
  return { ok: true };
}

export async function deleteRelease(id: string): Promise<ActionResult> {
  await requireAdmin();
  const existing = await prisma.release.findUnique({
    where: { id },
    select: { coverUrl: true },
  });
  try {
    await prisma.release.delete({ where: { id } });
  } catch {
    return { ok: false, error: "Could not delete release." };
  }
  await deleteBlobIfOwned(existing?.coverUrl);
  revalidateReleases();
  return { ok: true };
}

/* ------------------------------------------------------------------ */
/* News                                                               */
/* ------------------------------------------------------------------ */

export async function createNews(input: NewsInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = newsSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const { title, slug, excerpt, body, heroImage, status, publishedAt } = parsed.data;

  try {
    await prisma.newsPost.create({
      data: {
        title,
        slug: slug ?? slugify(title),
        excerpt,
        body,
        heroImage,
        status,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
      },
    });
  } catch (error) {
    const friendly = uniqueError(error);
    if (friendly) return { ok: false, error: friendly };
    throw error;
  }

  revalidateNews();
  return { ok: true };
}

export async function updateNews(
  id: string,
  input: NewsInput,
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = newsSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const { title, slug, excerpt, body, heroImage, status, publishedAt } = parsed.data;

  const previous = await prisma.newsPost.findUnique({
    where: { id },
    select: { heroImage: true },
  });

  try {
    await prisma.newsPost.update({
      where: { id },
      data: {
        title,
        slug: slug ?? slugify(title),
        excerpt: excerpt ?? null,
        body: body ?? null,
        heroImage: heroImage ?? null,
        status,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
      },
    });
  } catch (error) {
    const friendly = uniqueError(error);
    if (friendly) return { ok: false, error: friendly };
    throw error;
  }

  if (previous?.heroImage && previous.heroImage !== heroImage) {
    await deleteBlobIfOwned(previous.heroImage);
  }

  revalidateNews();
  return { ok: true };
}

export async function deleteNews(id: string): Promise<ActionResult> {
  await requireAdmin();
  const existing = await prisma.newsPost.findUnique({
    where: { id },
    select: { heroImage: true },
  });
  try {
    await prisma.newsPost.delete({ where: { id } });
  } catch {
    return { ok: false, error: "Could not delete post." };
  }
  await deleteBlobIfOwned(existing?.heroImage);
  revalidateNews();
  return { ok: true };
}

/* ------------------------------------------------------------------ */
/* Subscribers                                                        */
/* ------------------------------------------------------------------ */

function revalidateSubscribers() {
  revalidatePath("/admin");
  revalidatePath("/admin/subscribers");
}

export async function setSubscriberStatus(
  id: string,
  status: SubscriberStatus,
): Promise<ActionResult> {
  await requireAdmin();
  try {
    await prisma.subscriber.update({ where: { id }, data: { status } });
  } catch {
    return { ok: false, error: "Could not update subscriber." };
  }
  revalidateSubscribers();
  return { ok: true };
}

export async function deleteSubscriber(id: string): Promise<ActionResult> {
  await requireAdmin();
  try {
    await prisma.subscriber.delete({ where: { id } });
  } catch {
    return { ok: false, error: "Could not delete subscriber." };
  }
  revalidateSubscribers();
  return { ok: true };
}
