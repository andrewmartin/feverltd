import { cn } from "@/lib/utils";
import type { ShopProduct } from "@/lib/bigcartel";

/** "$24.00" — best-effort price formatting in the store's currency sign. */
function formatPrice(sign: string, price: number | null): string | null {
  if (price == null) return null;
  return `${sign}${price.toFixed(2)}`;
}

/**
 * Gallery-placard product card for the Big Cartel storefront. Mirrors the
 * release card's square cover + museum-placard caption, but links out to the
 * hosted Big Cartel product page (checkout lives there) and shows price /
 * sold-out / sale state instead of a release date.
 */
export function PressProductCard({
  product,
  currencySign,
}: {
  product: ShopProduct;
  currencySign: string;
}) {
  const cover = product.images[0]?.url ?? null;
  const price = formatPrice(currencySign, product.price);

  return (
    <a
      href={product.url}
      target="_blank"
      rel="noreferrer"
      className="group flex flex-col border border-hair bg-surface transition-[border-color,transform,box-shadow] hover:-translate-y-1 hover:border-ink hover:[box-shadow:0_22px_40px_-28px_rgba(0,0,0,0.5)]"
    >
      <div className="relative aspect-square overflow-hidden border-b border-hair bg-black">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element -- Big Cartel CDN host is arbitrary
          <img
            src={cover}
            alt={product.name}
            loading="lazy"
            className={cn(
              "h-full w-full object-cover transition-transform duration-[600ms] group-hover:scale-105",
              product.soldOut && "opacity-70 saturate-[0.6]",
            )}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-disp text-5xl font-extrabold uppercase tracking-tight text-[rgba(244,239,230,0.16)]">
              Fever
            </span>
          </div>
        )}
        {product.soldOut ? (
          <span className="absolute left-2.5 top-2.5 z-[2] border border-[rgba(244,239,230,0.28)] bg-[rgba(8,7,6,0.62)] px-2 py-1 font-press text-[9px] uppercase tracking-[0.18em] text-[#f4efe6]">
            Sold out
          </span>
        ) : product.onSale ? (
          <span className="absolute left-2.5 top-2.5 z-[2] bg-fever px-[9px] py-1 font-press text-[9px] uppercase tracking-[0.2em] text-white">
            Sale
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col px-[15px] pb-4 pt-3.5">
        <div className="font-disp text-[18px] font-bold uppercase leading-[0.96] tracking-[0.005em] text-ink">
          {product.name}
        </div>
        <div className="mt-3.5 flex items-center justify-between gap-2.5">
          <span className="font-press text-[10px] uppercase tracking-[0.16em] text-quiet">
            {product.soldOut ? "Sold out" : (price ?? "View")}
          </span>
          <span className="-translate-x-1 whitespace-nowrap font-press text-[10px] uppercase tracking-[0.16em] text-quiet opacity-0 transition group-hover:translate-x-0 group-hover:text-ink group-hover:opacity-100">
            Shop →
          </span>
        </div>
      </div>
    </a>
  );
}
