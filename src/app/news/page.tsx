import type { Metadata } from "next";
import { PressShell } from "@/components/press/press-shell";
import { PressPageHead } from "@/components/press/press-page-head";
import { PressNewsList } from "@/components/press/press-news-list";
import { PressNewsGrid } from "@/components/press/press-news-grid";
import { PressNewsPagination } from "@/components/press/press-news-pagination";
import { Outline } from "@/components/press/section-head";
import { newsFrom } from "@/components/press/press-adapters";
import { getAllNews } from "@/lib/catalog";
import type { NewsPost } from "@prisma/client";

const WRAP = "mx-auto w-full max-w-[1280px] px-[34px] max-[560px]:px-5";

// Once the archive grows past PAGINATE_OVER posts, switch the Load More reveal
// for numbered pagination of PER_PAGE posts each.
const PAGINATE_OVER = 18;
const PER_PAGE = 18;

export const metadata: Metadata = {
  title: "News",
  description:
    "Dispatches from Fever LTD — new records, pressings and signings, newest first.",
};

type PageProps = { searchParams: Promise<{ page?: string }> };

export default async function NewsPage({ searchParams }: PageProps) {
  let posts: NewsPost[] = [];

  try {
    posts = await getAllNews();
  } catch {
    // DB empty or unreachable — the adapter falls through to curated content.
  }

  const items = newsFrom(posts);
  const paginate = items.length > PAGINATE_OVER;

  let body: React.ReactNode;
  if (!paginate) {
    body = <PressNewsList items={items} />;
  } else {
    const totalPages = Math.max(1, Math.ceil(items.length / PER_PAGE));
    const requested = Number.parseInt((await searchParams).page ?? "", 10);
    const current = Math.min(
      Math.max(Number.isNaN(requested) ? 1 : requested, 1),
      totalPages,
    );
    const start = (current - 1) * PER_PAGE;
    const pageItems = items.slice(start, start + PER_PAGE);
    body = (
      <>
        <PressNewsGrid items={pageItems} />
        <PressNewsPagination current={current} totalPages={totalPages} />
      </>
    );
  }

  return (
    <PressShell>
      <PressPageHead
        kicker="(03) — Dispatches"
        title={
          <>
            All <Outline>News</Outline>
          </>
        }
        lede="Everything off the Fever LTD wire — new records, limited pressings and signings, newest first."
      />

      <section className="py-[60px] max-[560px]:py-10">
        <div className={WRAP}>{body}</div>
      </section>
    </PressShell>
  );
}
