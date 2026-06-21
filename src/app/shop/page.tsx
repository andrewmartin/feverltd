import type { Metadata } from "next";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { ProductCard } from "@/components/site/product-card";
import {
  getProducts,
  getStore,
  isBigCartelConfigured,
  type ShopProduct,
  type ShopStore,
} from "@/lib/bigcartel";

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
    <>
      <SiteHeader />
      <main id="main">
        <section className="border-b border-border">
          <div className="mx-auto max-w-7xl px-6 pb-12 pt-20 sm:pt-28">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
              Store
            </p>
            <h1 className="mt-4 text-5xl font-bold tracking-tighter sm:text-7xl">
              Shop
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              {store?.description ??
                "Records, merch and limited runs. Checkout is handled securely through our Big Cartel store."}
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-16">
          {products.length > 0 ? (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  currencySign={currencySign}
                />
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-border px-6 py-24 text-center">
              <p className="font-mono text-sm uppercase tracking-widest text-muted-foreground">
                {!configured
                  ? "Shop not connected yet."
                  : unreachable
                    ? "The shop is briefly offline."
                    : "Nothing in stock."}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {!configured
                  ? "Set BIGCARTEL_STORE in your environment to pull products from Big Cartel."
                  : unreachable
                    ? "Try again in a moment."
                    : "New drops are on the way — check back soon."}
              </p>
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
