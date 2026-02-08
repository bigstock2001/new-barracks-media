// app/blog/[...slug]/page.jsx
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { sanityClient } from "@/lib/sanity";
import { PortableText } from "@portabletext/react";

export const revalidate = 60;

const POST_BY_SLUG_QUERY = `
  *[_type == "episodePost" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    excerpt,
    body,
    "imageUrl": featuredImage.asset->url
  }
`;

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

export default async function BlogPostCatchAll({ params }) {
  // ✅ Catch-all ALWAYS gives array
  const parts = Array.isArray(params?.slug) ? params.slug : [];
  const slug = parts[0] ? String(parts[0]).trim() : "";

  if (!slug) {
    return (
      <main className="min-h-screen">
        <div className="mx-auto max-w-3xl px-5 py-12 text-white">
          <h1 className="text-3xl font-bold">Slug not detected</h1>
          <p className="mt-3 text-white/80">
            Your route is working, but no slug segment was found.
          </p>
          <p className="mt-2 text-white/70">
            params.slug = <span className="font-mono text-white">{JSON.stringify(params?.slug)}</span>
          </p>
          <Link className="mt-6 inline-block underline" href="/blog">
            Back to Blog
          </Link>
        </div>
      </main>
    );
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
