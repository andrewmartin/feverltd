/**
 * React Query keys + fetchers for admin collections. Client-side.
 * Mutations go through server actions; after they succeed, invalidate the
 * matching key (e.g. queryClient.invalidateQueries({ queryKey: adminKeys.artists })).
 *
 * Note: values come back as JSON, so Date columns arrive as ISO strings.
 * The Serialized* types below reflect that.
 */
import type { ReleaseStatus, PostStatus } from "@prisma/client";

export const adminKeys = {
  artists: ["admin", "artists"] as const,
  artistOptions: ["admin", "artist-options"] as const,
  releases: ["admin", "releases"] as const,
  news: ["admin", "news"] as const,
};

export type SerializedArtist = {
  id: string;
  name: string;
  slug: string;
  bio: string | null;
  imageUrl: string | null;
  website: string | null;
  createdAt: string;
  updatedAt: string;
  _count: { releases: number };
};

export type SerializedRelease = {
  id: string;
  title: string;
  slug: string;
  catalogNo: string | null;
  description: string | null;
  coverUrl: string | null;
  releaseDate: string | null;
  status: ReleaseStatus;
  createdAt: string;
  updatedAt: string;
  artists: { id: string; name: string }[];
};

export type SerializedNews = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string | null;
  heroImage: string | null;
  status: PostStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ArtistOption = { id: string; name: string };

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export const fetchArtists = () =>
  getJson<SerializedArtist[]>("/api/admin/artists");

export const fetchArtistOptions = () =>
  getJson<ArtistOption[]>("/api/admin/artist-options");

export const fetchReleases = () =>
  getJson<SerializedRelease[]>("/api/admin/releases");

export const fetchNews = () => getJson<SerializedNews[]>("/api/admin/news");
