/**
 * Big Cartel storefront integration (read-only).
 *
 * We use Big Cartel's *public storefront JSON* — the same data their hosted
 * shop renders from — rather than the OAuth-gated v1 API. That means:
 *
 *   - No API key / OAuth token required. The only config is the store
 *     subdomain (BIGCARTEL_STORE in env).
 *   - Whatever the label edits in the Big Cartel admin appears here on the
 *     next cache revalidation. No syncing, no webhooks.
 *   - It is READ ONLY. Carts, checkout and payment all stay on Big Cartel's
 *     hosted product pages — we just link out to them.
 *
 * Endpoints (all GET, JSON, unauthenticated):
 *   https://{store}.bigcartel.com/store.json            store meta + currency
 *   https://{store}.bigcartel.com/products.json         all active products
 *   https://{store}.bigcartel.com/products.json?page=N  paginated (10/page)
 *   https://{store}.bigcartel.com/product/{slug}.json   single product
 *   https://{store}.bigcartel.com/category/{slug}/products.json
 *
 * Limitations to keep in mind:
 *   - This is a legacy, lightly-documented surface. Treat the shape as
 *     best-effort and degrade gracefully (see normalizeProduct).
 *   - Inactive / hidden products are not returned at all. Sold-out products
 *     ARE returned with status "sold-out".
 *   - No exact stock counts — only per-option sold_out booleans.
 *   - Image URLs are historically protocol-relative ("//...") — we normalise
 *     them to https.
 *
 * If we ever need inventory counts, draft products, or write access, swap the
 * fetch layer for the v1 API (https://api.bigcartel.com/v1) which needs an
 * OAuth access token — the normalized types below would stay the same.
 */

const STORE = process.env.BIGCARTEL_STORE?.trim();

/** Minutes between background revalidations of Big Cartel data. */
const REVALIDATE_SECONDS = 60 * 5;

/** Cache tag so we can revalidateTag("bigcartel") from a webhook/admin button. */
export const BIGCARTEL_CACHE_TAG = "bigcartel";

export function isBigCartelConfigured(): boolean {
  return Boolean(STORE);
}

function storeBase(): string {
  if (!STORE) {
    throw new Error(
      "BIGCARTEL_STORE is not set — add your Big Cartel store subdomain to .env",
    );
  }
  return `https://${STORE}.bigcartel.com`;
}

// ---------------------------------------------------------------------------
// Raw response shapes (best-effort — fields are optional on purpose)
// ---------------------------------------------------------------------------

interface RawImage {
  url?: string;
  width?: number;
  height?: number;
}

interface RawOption {
  id?: number | string;
  name?: string;
  price?: number | string;
  sold_out?: boolean;
}

interface RawProduct {
  id?: number | string;
  name?: string;
  permalink?: string;
  url?: string;
  status?: string; // "active" | "sold-out" | "coming-soon" | ...
  on_sale?: boolean;
  price?: number | string;
  default_price?: number | string;
  description?: string;
  images?: RawImage[];
  options?: RawOption[];
  categories?: { id?: number | string; name?: string; permalink?: string }[];
}

interface RawStore {
  subdomain?: string;
  name?: string;
  description?: string;
  url?: string;
  currency?: { sign?: string; name?: string };
}

// ---------------------------------------------------------------------------
// Normalized types (what the rest of the app consumes)
// ---------------------------------------------------------------------------

export interface ShopImage {
  url: string;
  width: number | null;
  height: number | null;
}

export interface ShopOption {
  id: string;
  name: string;
  price: number | null;
  soldOut: boolean;
}

export interface ShopProduct {
  id: string;
  name: string;
  /** Slug used in the Big Cartel product URL. */
  permalink: string;
  /** Absolute URL to the product's hosted Big Cartel page (for checkout). */
  url: string;
  /** True when every option is sold out (or the product status says so). */
  soldOut: boolean;
  onSale: boolean;
  /** Lowest option price, in major currency units. */
  price: number | null;
  description: string | null;
  images: ShopImage[];
  options: ShopOption[];
  categories: { id: string; name: string; permalink: string }[];
}

export interface ShopStore {
  subdomain: string;
  name: string | null;
  description: string | null;
  currencySign: string;
  currencyName: string | null;
}

// ---------------------------------------------------------------------------
// Normalization
// ---------------------------------------------------------------------------

function toHttps(url: string | undefined): string | null {
  if (!url) return null;
  if (url.startsWith("//")) return `https:${url}`;
  if (url.startsWith("http://")) return url.replace(/^http:/, "https:");
  return url;
}

function toNumber(value: number | string | undefined): number | null {
  if (value == null) return null;
  const n = typeof value === "number" ? value : parseFloat(value);
  return Number.isFinite(n) ? n : null;
}

function normalizeProduct(raw: RawProduct, base: string): ShopProduct | null {
  if (!raw?.id || !raw?.name) return null;

  const options: ShopOption[] = (raw.options ?? []).map((o, i) => ({
    id: String(o.id ?? i),
    name: o.name?.trim() || "Default",
    price: toNumber(o.price),
    soldOut: Boolean(o.sold_out),
  }));

  const optionPrices = options
    .map((o) => o.price)
    .filter((p): p is number => p != null);
  const price =
    toNumber(raw.price) ??
    toNumber(raw.default_price) ??
    (optionPrices.length ? Math.min(...optionPrices) : null);

  const statusSoldOut = (raw.status ?? "").toLowerCase().includes("sold");
  const allOptionsSoldOut =
    options.length > 0 && options.every((o) => o.soldOut);

  const permalink = raw.permalink ?? "";
  const path = raw.url ?? (permalink ? `/product/${permalink}` : "");

  return {
    id: String(raw.id),
    name: raw.name.trim(),
    permalink,
    url: path ? `${base}${path}` : base,
    soldOut: statusSoldOut || allOptionsSoldOut,
    onSale: Boolean(raw.on_sale),
    price,
    description: raw.description?.trim() || null,
    images: (raw.images ?? [])
      .map((img) => {
        const url = toHttps(img.url);
        return url ? { url, width: img.width ?? null, height: img.height ?? null } : null;
      })
      .filter((img): img is ShopImage => img != null),
    options,
    categories: (raw.categories ?? [])
      .filter((c) => c.name && c.permalink)
      .map((c, i) => ({
        id: String(c.id ?? i),
        name: c.name!.trim(),
        permalink: c.permalink!,
      })),
  };
}

// ---------------------------------------------------------------------------
// Fetching
// ---------------------------------------------------------------------------

async function bcFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${storeBase()}${path}`, {
    headers: { Accept: "application/json" },
    // Cache at the data layer: serve fast, revalidate in the background, and
    // allow targeted invalidation via revalidateTag(BIGCARTEL_CACHE_TAG).
    next: { revalidate: REVALIDATE_SECONDS, tags: [BIGCARTEL_CACHE_TAG] },
  });

  if (!res.ok) {
    throw new Error(
      `Big Cartel request failed (${res.status} ${res.statusText}) for ${path}`,
    );
  }
  return (await res.json()) as T;
}

/** Store metadata (name, description, currency). Null when not configured. */
export async function getStore(): Promise<ShopStore | null> {
  if (!isBigCartelConfigured()) return null;
  // Big Cartel's legacy /store.json is no longer exposed on every storefront
  // (feverltd.bigcartel.com returns 404 while /products.json still works).
  // Treat store metadata as best-effort: degrade to sensible defaults so a
  // missing endpoint never takes down the product listing.
  try {
    const raw = await bcFetch<RawStore>("/store.json");
    return {
      subdomain: raw.subdomain ?? STORE!,
      name: raw.name ?? null,
      description: raw.description ?? null,
      currencySign: raw.currency?.sign ?? "$",
      currencyName: raw.currency?.name ?? null,
    };
  } catch {
    return {
      subdomain: STORE!,
      name: null,
      description: null,
      currencySign: "$",
      currencyName: null,
    };
  }
}

/**
 * All active products in the shop. Big Cartel paginates at ~10/page; we walk
 * pages until one comes back short. Returns [] when not configured.
 */
export async function getProducts(): Promise<ShopProduct[]> {
  if (!isBigCartelConfigured()) return [];
  const base = storeBase();
  const all: ShopProduct[] = [];

  // Hard page cap so a malformed response can never loop forever.
  for (let page = 1; page <= 50; page++) {
    const raw = await bcFetch<RawProduct[]>(`/products.json?page=${page}`);
    if (!Array.isArray(raw) || raw.length === 0) break;
    for (const p of raw) {
      const norm = normalizeProduct(p, base);
      if (norm) all.push(norm);
    }
    if (raw.length < 10) break; // last (partial) page
  }
  return all;
}

/** Products within a single category (by permalink). */
export async function getProductsByCategory(
  categoryPermalink: string,
): Promise<ShopProduct[]> {
  if (!isBigCartelConfigured()) return [];
  const base = storeBase();
  const raw = await bcFetch<RawProduct[]>(
    `/category/${categoryPermalink}/products.json`,
  );
  if (!Array.isArray(raw)) return [];
  return raw
    .map((p) => normalizeProduct(p, base))
    .filter((p): p is ShopProduct => p != null);
}

/** A single product by its permalink/slug, or null if not found. */
export async function getProduct(
  permalink: string,
): Promise<ShopProduct | null> {
  if (!isBigCartelConfigured()) return null;
  const base = storeBase();
  try {
    const raw = await bcFetch<RawProduct>(`/product/${permalink}.json`);
    return normalizeProduct(raw, base);
  } catch {
    return null;
  }
}
