// app/blog/[slug]/page.jsx
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { sanityClient } from "@/lib/sanity";
import { PortableText } from "@portabletext/react";

export const revalidate = 60;

// If you're using Next static export, this prevents Next from trying unknown slugs.
export const dynamicParams = false;

const ALL_SLUGS_QUERY = `
  *[_type == "episodePost" && defined(slug.current)]{
    "slug": slug.current
  }
`;

const POST_BY_SLUG_QUERY = `
  *[_type == "episodePost" && slug.current == $slug][0]{
    title,
    publishedAt,
    excerpt,
    body,
    "imageUrl": featuredImage.asset->url
  }
`;

// ✅ REQUIRED for static export AND must return only valid strings
export async function generateStaticParams() {
  const rows = await sanityClient.fetch(ALL_SLUGS_QUERY);

  return (rows || [])
    .map((r) => (typeof r?.slug === "string" ? r.slug.trim() : ""))
    .filter((s) => s.length > 0)
    .map((slug) => ({ slug }));
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

export default async function BlogPostPage({ params = {} }) {
  // ✅ Never allow undefined to reach Sanity
  const slug = typeof params.slug === "string" ? params.slug.trim() : "";

  if (!slug) {
    // In export mode, missing slug should just be a 404
    notFound();
  }

  const post = await sanityClient.fetch(POST_BY_SLUG_QUERY, { slug });

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
