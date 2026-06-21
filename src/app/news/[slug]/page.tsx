import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PressShell } from "@/components/press/press-shell";
import { newsDetailFrom } from "@/components/press/press-adapters";
import { AdminEditButton } from "@/components/admin/admin-edit-button";
import { getNewsBySlug } from "@/lib/catalog";
import type { NewsPost } from "@prisma/client";

const WRAP = "mx-auto w-full max-w-[760px] px-[34px] max-[560px]:px-5";

type PageProps = { params: Promise<{ slug: string }> };

async function loadPost(slug: string): Promise<NewsPost | null> {
  try {
    return await getNewsBySlug(slug);
  } catch {
    // DB unreachable — fall through to curated content / not found.
    return null;
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = newsDetailFrom(await loadPost(slug), slug);

  if (!item) return { title: "Dispatch not found" };

  const description = item.excerpt || `${item.title} — a Fever LTD dispatch.`;
  return {
    title: item.title,
    description,
    openGraph: {
      title: item.title,
      description,
      type: "article",
      images: [{ url: item.thumb }],
    },
  };
}

export default async function NewsDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await loadPost(slug);
  const item = newsDetailFrom(post, slug);

  if (!item) notFound();

  const paragraphs = (item.body ?? item.excerpt)
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <PressShell>
      {post ? <AdminEditButton kind="news" id={post.id} /> : null}
      <article className={WRAP}>
        <div className="py-[44px] max-[560px]:py-8">
          <Link
            href="/news"
            className="font-press text-[11px] uppercase tracking-[0.2em] text-quiet transition-colors hover:text-fever"
          >
            ← All news
          </Link>

          <h1 className="mt-9 text-balance font-disp text-[clamp(38px,6.5vw,76px)] font-extrabold uppercase leading-[0.86] tracking-[-0.01em]">
            {item.title}
            <span className="text-fever">.</span>
          </h1>

          <div className="mt-8 aspect-[16/9] overflow-hidden border border-hair bg-black">
            {/* eslint-disable-next-line @next/next/no-img-element -- mixed local/blob hosts */}
            <img
              src={item.thumb}
              alt={item.title}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="mt-10 space-y-6">
            {paragraphs.map((p, i) => (
              <p
                key={i}
                className="font-editorial text-[clamp(17px,2vw,20px)] leading-relaxed text-quiet"
              >
                {p}
              </p>
            ))}
          </div>

          <div className="mt-12 border-t border-hair pt-8">
            <Link
              href="/news"
              className="font-press text-[11px] uppercase tracking-[0.2em] text-quiet transition-colors hover:text-fever"
            >
              ← Back to all news
            </Link>
          </div>
        </div>
      </article>
    </PressShell>
  );
}
