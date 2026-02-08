// app/blog/page.jsx
import Image from "next/image";
import { sanityClient } from "@/lib/sanity";
import { PortableText } from "@portabletext/react";

export const revalidate = 60;

export const metadata = {
  title: "Blog | Barracks Media",
  description:
    "Episode blog posts and show notes from Barracks Media — all posts displayed in full on one page.",
};

const POSTS_QUERY = `
  *[_type == "episodePost" && defined(slug.current)]
  | order(publishedAt desc) {
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

export default async function BlogPage() {
  let posts = [];
  try {
    posts = await sanityClient.fetch(POSTS_QUERY);
  } catch {
    posts = [];
  }

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-5xl px-5 py-12">
        <header className="mb-8 rounded-3xl border border-white/10 bg-black/40 p-6 backdrop-blur">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Barracks Media Blog
          </h1>
          <p className="mt-2 max-w-3xl text-white/80">
            Full episode blog posts and show notes — no “read more,” no 404s. Everything is right here.
          </p>
        </header>

        {(!posts || posts.length === 0) && (
          <div className="rounded-3xl border border-white/10 bg-black/30 p-6 text-white/80">
            No posts yet. Create your first <span className="text-white">Episode Blog Post</span>{" "}
            in Sanity and it will show up here.
          </div>
        )}

        {posts && posts.length > 0 && (
          <div className="space-y-10">
            {posts.map((post) => (
              <article
                key={post._id}
                className="overflow-hidden rounded-3xl border border-white/10 bg-black/30 backdrop-blur"
              >
                {post.imageUrl && (
                  <div className="relative aspect-[16/9] w-full bg-white/5">
                    <Image
                      src={post.imageUrl}
                      alt={post.title || "Blog image"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 900px"
                      priority={false}
                    />
                  </div>
                )}

                <div className="p-6 md:p-8">
                  <div className="text-sm text-white/60">
                    {formatDate(post.publishedAt)}
                  </div>

                  <h2 className="mt-2 text-2xl font-bold text-white">
                    {post.title}
                  </h2>

                  {post.excerpt && (
                    <p className="mt-4 text-white/80">
                      {post.excerpt}
                    </p>
                  )}

                  <div className="prose prose-invert mt-6 max-w-none">
                    <PortableText value={post.body || []} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
