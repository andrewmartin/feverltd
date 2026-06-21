import type { Metadata } from "next";
import { PressShell } from "@/components/press/press-shell";
import { PressPageHead } from "@/components/press/press-page-head";
import { PressProductCard } from "@/components/press/press-product-card";
import { Outline } from "@/components/press/section-head";
import {
  getProducts,
  getStore,
  isBigCartelConfigured,
  type ShopProduct,
  type ShopStore,
} from "@/lib/bigcartel";

const WRAP = "mx-auto w-full max-w-[1280px] px-[34px] max-[560px]:px-5";

export const metadata: Metadata = {
  title: "Shop",
  description: "Merch, vinyl and limited runs — fulfilled through Big Cartel.",
};

export default async function ShopPage() {
  const configured = isBigCartelConfigured();

  let products: ShopProduct[] = [];
  let store: ShopStore | null = null;
  let unreachable = false;

  if (configured) {
    try {
      [products, store] = await Promise.all([getProducts(), getStore()]);
    } catch {
      unreachable = true;
    }
  }

  const currencySign = store?.currencySign ?? "$";

  return (
    <PressShell>
      <PressPageHead
        kicker="(04) — Store"
        title={
          <>
            The <Outline>Shop</Outline>
          </>
        }
        lede={
          store?.description ??
          "Records, merch and limited runs."
        }
      />

      <section className="py-[60px] max-[560px]:py-10">
        <div className={WRAP}>
          {products.length > 0 ? (
            <div className="grid grid-cols-4 gap-4 max-[1040px]:grid-cols-3 max-[680px]:grid-cols-2">
              {products.map((product) => (
                <PressProductCard
                  key={product.id}
                  product={product}
                  currencySign={currencySign}
                />
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-rule px-6 py-24 text-center">
              <p className="font-press text-[11px] uppercase tracking-[0.2em] text-quiet">
                {!configured
                  ? "Shop not connected yet."
                  : unreachable
                    ? "The shop is briefly offline."
                    : "Nothing in stock."}
              </p>
              <p className="mt-3 font-editorial text-sm text-quiet">
                {!configured
                  ? "Set BIGCARTEL_STORE in your environment to pull products from Big Cartel."
                  : unreachable
                    ? "Try again in a moment."
                    : "New drops are on the way — check back soon."}
              </p>
            </div>
          )}
        </div>
      </section>
    </PressShell>
  );
}
