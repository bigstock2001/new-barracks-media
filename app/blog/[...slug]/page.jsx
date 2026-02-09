// app/blog/[...slug]/page.jsx
import Link from "next/link";
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
    featuredImage{
      asset->{
        _id,
        url
      }
    },
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

// Catch-all route helper: prefer LAST segment (e.g. /blog/a/b -> "b")
function getSlugFromParams(params) {
  if (!params || typeof params !== "object") return "";

  const direct = params.slug;
  if (typeof direct === "string") return direct.trim();

  if (Array.isArray(direct)) {
    const last = direct[direct.length - 1];
    if (typeof last === "string" && last.trim()) return last.trim();
  }

  for (const v of Object.values(params)) {
    if (typeof v === "string" && v.trim()) return v.trim();
    if (Array.isArray(v)) {
      const last = v[v.length - 1];
      if (typeof last === "string" && last.trim()) return last.trim();
    }
  }

  return "";
}

export default async function BlogPostCatchAll({ params }) {
  const slug = getSlugFromParams(params);

  if (!slug) {
    return (
      <main className="min-h-screen">
        <div className="mx-auto max-w-3xl px-5 py-12 text-white">
          <h1 className="text-3xl font-bold">Slug not detected</h1>
          <pre className="mt-6 overflow-auto rounded-2xl border border-white/10 bg-black/30 p-4 text-xs text-white/80">
{JSON.stringify(params, null, 2)}
          </pre>
          <Link className="mt-6 inline-block underline" href="/blog">
            Back to Blog
          </Link>
        </div>
      </main>
    );
  }

  const post = await sanityClient.fetch(POST_BY_SLUG_QUERY, { slug });
  if (!post) notFound();

  const imageUrl = typeof post?.imageUrl === "string" ? post.imageUrl.trim() : "";
  const assetUrl =
    typeof post?.featuredImage?.asset?.url === "string"
      ? post.featuredImage.asset.url.trim()
      : "";

  const finalUrl = imageUrl || assetUrl;

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-4xl px-5 py-12">
        <Link href="/blog" className="text-white/70 hover:text-white">
          ← Back to Blog
        </Link>

        <h1 className="mt-6 text-3xl font-bold text-white">{post.title}</h1>
        <div className="mt-2 text-sm text-white/60">{formatDate(post.publishedAt)}</div>

        {/* IMAGE */}
        {finalUrl ? (
          <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            {/* Plain <img> bypasses ALL Next.js image restrictions */}
            <img
              src={finalUrl}
              alt={post.title || "Featured image"}
              className="block w-full h-auto object-cover"
              referrerPolicy="no-referrer"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white/80">
            No featured image URL returned from Sanity for this post.
          </div>
        )}

        {post.excerpt ? <p className="mt-6 text-lg text-white/80">{post.excerpt}</p> : null}

        <article className="prose prose-invert mt-10 max-w-none">
          <PortableText value={post.body} />
        </article>

        {/* DEBUG PANEL (remove after fixed) */}
        <div className="mt-10 rounded-2xl border border-white/10 bg-black/30 p-4">
          <div className="text-sm text-white/70">Debug</div>
          <div className="mt-2 text-xs text-white/80 break-all">
            <div><span className="text-white/60">slug:</span> {slug}</div>
            <div><span className="text-white/60">imageUrl:</span> {imageUrl || "(empty)"}</div>
            <div><span className="text-white/60">featuredImage.asset.url:</span> {assetUrl || "(empty)"}</div>
          </div>
          <pre className="mt-3 overflow-auto text-[11px] text-white/70">
{JSON.stringify(
  {
    hasFeaturedImage: !!post?.featuredImage,
    featuredImage: post?.featuredImage || null,
  },
  null,
  2
)}
          </pre>
        </div>
      </div>
    </main>
  );
}
