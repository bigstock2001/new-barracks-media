// app/blog/page.jsx
import Link from "next/link";
import Image from "next/image";
import { sanityClient } from "@/lib/sanity";

export const revalidate = 60; // refresh blog list every 60 seconds

export const metadata = {
  title: "Blog | Barracks Media",
  description:
    "Episode blog posts, show notes, and insights from the Barracks Media Network.",
};

const POSTS_QUERY = `
  *[_type == "episodePost" && defined(slug.current)]
  | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    showName,
    episodeNumber,
    guestName,
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
  } catch (e) {
    // If Sanity is misconfigured, we still render a usable page.
    posts = [];
  }

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-6xl px-5 py-12">
        {/* Header */}
        <div className="mb-8 rounded-3xl border border-white/10 bg-black/40 p-6 backdrop-blur">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Barracks Media Blog
          </h1>
          <p className="mt-2 max-w-3xl text-white/80">
            Episode blog posts and show notes—built for search, built for
            listeners, built to grow the network.
          </p>
        </div>

        {/* Empty state */}
        {(!posts || posts.length === 0) && (
          <div className="rounded-3xl border border-white/10 bg-black/30 p-6 text-white/80">
            No posts yet. Create your first <span className="text-white">Episode Blog Post</span>{" "}
            in Sanity and it will show up here.
          </div>
        )}

        {/* Grid */}
        {posts && posts.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => {
              const metaBits = [
                post.showName ? post.showName : null,
                post.episodeNumber ? `Ep. ${post.episodeNumber}` : null,
                post.guestName ? `Guest: ${post.guestName}` : null,
              ].filter(Boolean);

              return (
                <Link
                  key={post._id}
                  href={`/blog/${post.slug}`}
                  className="group overflow-hidden rounded-3xl border border-white/10 bg-black/30 backdrop-blur transition hover:border-white/20 hover:bg-black/40"
                >
                  {/* Image */}
                  <div className="relative aspect-[16/9] w-full bg-white/5">
                    {post.imageUrl ? (
                      <Image
                        src={post.imageUrl}
                        alt={post.title || "Blog image"}
                        fill
                        className="object-cover transition duration-300 group-hover:scale-[1.02]"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={false}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-white/40">
                        No image
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="text-xs text-white/60">
                      {formatDate(post.publishedAt)}
                    </div>

                    <h2 className="mt-2 line-clamp-2 text-lg font-semibold text-white">
                      {post.title}
                    </h2>

                    {metaBits.length > 0 && (
                      <div className="mt-2 line-clamp-1 text-sm text-white/70">
                        {metaBits.join(" • ")}
                      </div>
                    )}

                    {post.excerpt && (
                      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/75">
                        {post.excerpt}
                      </p>
                    )}

                    <div className="mt-4 text-sm font-medium text-white/80 group-hover:text-white">
                      Read post →
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
