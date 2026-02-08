// app/blog/page.jsx
import Image from "next/image";
import { sanityClient } from "@/lib/sanity";
import { PortableText } from "@portabletext/react";

export const revalidate = 60;

export const metadata = {
  title: "Blog | Barracks Media",
  description:
    "Episode blog posts and show notes from Barracks Media — full posts displayed on one page.",
};

const POSTS_QUERY = `
  *[_type == "episodePost" && defined(slug.current)]
  | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    body,
    publishedAt,
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
  const posts = await sanityClient.fetch(POSTS_QUERY);

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-5xl px-5 py-12">
        {/* Header */}
        <header className="mb-10 rounded-3xl border border-white/10 bg-black/40 p-6 backdrop-blur">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Barracks Media Blog
          </h1>
          <p className="mt-2 max-w-3xl text-white/80">
            Full episode blog posts and show notes. No “read more.” No broken links.
          </p>
        </header>

        {/* Posts */}
        <div className="space-y-12">
          {posts.map((post) => (
            <article
              key={post._id}
              id={post.slug} // ✅ anchor target for sitemap + internal links
              className="scroll-mt-28 overflow-hidden rounded-3xl border border-white/10 bg-black/30 backdrop-blur"
            >
              {post.imageUrl && (
                <div className="relative aspect-[16/9] w-full bg-white/5">
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 900px"
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
      </div>
    </main>
  );
}
