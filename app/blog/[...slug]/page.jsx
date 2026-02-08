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

// ✅ Pull slug from ANY param key (slug / postSlug / Slug / etc)
function getSlugFromParams(params) {
  if (!params || typeof params !== "object") return "";

  // Prefer the common key first
  const direct = params.slug;
  if (typeof direct === "string") return direct.trim();
  if (Array.isArray(direct) && typeof direct[0] === "string") return direct[0].trim();

  // Otherwise, look through all param values
  for (const v of Object.values(params)) {
    if (typeof v === "string" && v.trim()) return v.trim();
    if (Array.isArray(v) && typeof v[0] === "string" && v[0].trim()) return v[0].trim();
  }

  return "";
}

export default async function BlogPostCatchAll({ params }) {
  const slug = getSlugFromParams(params);

  // ✅ Always show what params really are if slug fails
  if (!slug) {
    return (
      <main className="min-h-screen">
        <div className="mx-auto max-w-3xl px-5 py-12 text-white">
          <h1 className="text-3xl font-bold">Slug not detected</h1>
          <p className="mt-3 text-white/80">
            Your route file is running, but Next did not provide a usable param.
          </p>

          <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4">
            <div className="text-sm text-white/70 mb-2">Raw params object:</div>
            <pre className="text-xs text-white/80 overflow-auto">
{JSON.stringify(params, null, 2)}
            </pre>
          </div>

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

        {post.excerpt && <p className="mt-6 text-lg text-white/80">{post.excerpt}</p>}

        <article className="prose prose-invert mt-10 max-w-none">
          <PortableText value={post.body} />
        </article>
      </div>
    </main>
  );
}
