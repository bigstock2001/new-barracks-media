// app/blog/[slug]/page.jsx
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { sanityClient } from "@/lib/sanity";
import { PortableText } from "@portabletext/react";

export const revalidate = 60;

// ✅ REQUIRED FOR STATIC EXPORT
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

// ✅ THIS IS WHY IT WAS 404ING
export async function generateStaticParams() {
  const slugs = await sanityClient.fetch(ALL_SLUGS_QUERY);
  return (slugs || []).map((s) => ({
    slug: s.slug,
  }));
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({ params }) {
  const { slug } = params;

  const post = await sanityClient.fetch(POST_BY_SLUG_QUERY, { slug });
  if (!post) notFound();

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-4xl px-5 py-12">
        <Link href="/blog" className="text-white/70 hover:text-white">
          ← Back to Blog
        </Link>

        <h1 className="mt-6 text-3xl font-bold text-white">
          {post.title}
        </h1>

        <div className="mt-2 text-sm text-white/60">
          {formatDate(post.publishedAt)}
        </div>

        {post.imageUrl && (
          <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-2xl">
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {post.excerpt && (
          <p className="mt-6 text-lg text-white/80">
            {post.excerpt}
          </p>
        )}

        <article className="prose prose-invert mt-10 max-w-none">
          <PortableText value={post.body} />
        </article>
      </div>
    </main>
  );
}
