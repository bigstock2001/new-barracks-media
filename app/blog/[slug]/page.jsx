// app/blog/[slug]/page.jsx
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { sanityClient } from "@/lib/sanity";
import { PortableText } from "@portabletext/react";

export const revalidate = 60;
export const dynamicParams = false;

const ALL_SLUGS_QUERY = `
  *[_type == "episodePost" && defined(slug.current)]{
    "slug": slug.current
  }
`;

// ✅ Escape double-quotes so a weird slug can't break the GROQ string.
function escSlug(s) {
  return String(s || "").replace(/"/g, '\\"').trim();
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ✅ REQUIRED for static export
export async function generateStaticParams() {
  const rows = await sanityClient.fetch(ALL_SLUGS_QUERY);

  return (rows || [])
    .map((r) => (typeof r?.slug === "string" ? r.slug.trim() : ""))
    .filter((s) => s.length > 0)
    .map((slug) => ({ slug }));
}

export default async function BlogPostPage({ params = {} }) {
  const slug = typeof params.slug === "string" ? params.slug.trim() : "";
  if (!slug) notFound();

  // ✅ IMPORTANT: no $slug param used anywhere, so Sanity cannot throw "param not provided"
  const query = `
    *[_type == "episodePost" && slug.current == "${escSlug(slug)}"][0]{
      title,
      publishedAt,
      excerpt,
      body,
      "imageUrl": featuredImage.asset->url
    }
  `;

  const post = await sanityClient.fetch(query);

  if (!post) notFound();

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-4xl px-5 py-12">
        <Link href="/blog" className="text-white/70 hover:text-white">
          ← Back to Blog
        </Link>

        <h1 className="mt-6 text-3xl font-bold text-white">{post.title}</h1>

        <div className="mt-2 text-sm text-white/60">{formatDate(post.publishedAt)}</div>

        {post.imageUrl && (
          <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            <Image src={post.imageUrl} alt={post.title} fill className="object-cover" />
          </div>
        )}

        {post.excerpt && (
          <p className="mt-6 text-lg text-white/80">{post.excerpt}</p>
        )}

        <article className="prose prose-invert mt-10 max-w-none">
          <PortableText value={post.body} />
        </article>
      </div>
    </main>
  );
}
