import type { ShopProduct } from "@/lib/bigcartel";

function formatPrice(price: number | null, sign: string) {
  if (price == null) return null;
  // Big Cartel prices are whole numbers far more often than not; only show
  // decimals when they're actually present.
  const formatted = Number.isInteger(price) ? price.toString() : price.toFixed(2);
  return `${sign}${formatted}`;
}

export function ProductCard({
  product,
  currencySign = "$",
}: {
  product: ShopProduct;
  currencySign?: string;
}) {
  const image = product.images[0];
  const price = formatPrice(product.price, currencySign);

  return (
    <a
      href={product.url}
      target="_blank"
      rel="noreferrer"
      className="group block focus-visible:outline-none"
    >
      <div className="relative aspect-square overflow-hidden border border-border bg-muted">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element -- Big Cartel CDN host is arbitrary
          <img
            src={image.url}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_30%_30%,#1d1d22,#0a0a0b)]">
            <span className="font-mono text-4xl font-bold tracking-tighter text-border">
              FVR
            </span>
          </div>
        )}
        <div className="absolute inset-0 ring-1 ring-inset ring-white/0 transition-all duration-300 group-hover:ring-accent" />
        {product.soldOut && (
          <span className="absolute left-3 top-3 bg-background/80 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground backdrop-blur">
            Sold out
          </span>
        )}
        {!product.soldOut && product.onSale && (
          <span className="absolute left-3 top-3 bg-accent px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-accent-foreground">
            On sale
          </span>
        )}
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-3">
        <h3 className="text-balance text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-accent">
          {product.name}
        </h3>
        {price && (
          <span className="shrink-0 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {product.soldOut ? "—" : price}
          </span>
        )}
      </div>
    </a>
  );
}
