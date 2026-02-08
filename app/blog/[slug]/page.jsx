// app/blog/[slug]/page.jsx
import Link from "next/link";
import Image from "next/image";
import { sanityClient } from "@/lib/sanity";
import { PortableText } from "@portabletext/react";

export const revalidate = 60;
export const dynamicParams = true; // allow runtime slugs now that you're not exporting

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

export default async function BlogPostPage({ params }) {
  const slug = typeof params?.slug === "string" ? params.slug.trim() : "";

  if (!slug) {
    return (
      <main className="min-h-screen">
        <div className="mx-auto max-w-3xl px-5 py-12 text-white">
          <h1 className="text-3xl font-bold">Missing slug</h1>
          <p className="mt-3 text-white/80">
            This page was loaded without a slug param.
          </p>
          <Link className="mt-6 inline-block underline" href="/blog">
            Back to Blog
          </Link>
        </div>
      </main>
    );
  }

  let post = null;
  let errMsg = "";

  try {
    post = await sanityClient.fetch(POST_BY_SLUG_QUERY, { slug });
  } catch (err) {
    errMsg = err?.message || String(err);
    post = null;
  }

  // ✅ If Sanity returns nothing, show the REAL reason (instead of 404)
  if (!post) {
    return (
      <main className="min-h-screen">
        <div className="mx-auto max-w-3xl px-5 py-12 text-white">
          <h1 className="text-3xl font-bold">Post not loading from Sanity</h1>

          <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-4">
            <div className="text-sm text-white/70">Slug requested:</div>
            <div className="mt-1 font-mono text-white">{slug}</div>

            <div className="mt-4 text-sm text-white/70">Query type:</div>
            <div className="mt-1 font-mono text-white">episodePost</div>

            {errMsg && (
              <>
                <div className="mt-4 text-sm text-white/70">Sanity error:</div>
                <div className="mt-1 font-mono text-white break-words">
                  {errMsg}
                </div>
              </>
            )}

            {!errMsg && (
              <p className="mt-4 text-white/70">
                No error was thrown — Sanity just returned <span className="text-white">null</span>.
                That usually means the post exists in a different dataset/project than the one your site is using,
                or the document type isn’t actually <span className="text-white">episodePost</span>.
              </p>
            )}
          </div>

          <div className="mt-6 flex gap-4">
            <Link className="underline" href="/blog">
              Back to Blog
            </Link>
            <Link className="underline" href="/">
              Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-4xl px-5 py-12">
        <Link href="/blog" className="text-white/70 hover:text-white">
          ← Back to Blog
        </Link>

        <h1 className="mt-6 text-3xl font-bold text-white">{post.title}</h1>

        <div className="mt-2 text-sm text-white/60">
          {formatDate(post.publishedAt)}
        </div>

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
