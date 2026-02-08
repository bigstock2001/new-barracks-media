// app/blog/[slug]/page.jsx
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
    seoTitle,
    seoDescription,
    showName,
    episodeNumber,
    guestName,
    episodeEmbedUrl,
    episodeDuration,
    body,
    "imageUrl": featuredImage.asset->url
  }
`;

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export async function generateMetadata({ params }) {
  const slug = params?.slug;
  if (!slug) return {};

  const post = await sanityClient.fetch(POST_BY_SLUG_QUERY, { slug });
  if (!post) return {};

  const title = post.seoTitle || post.title;
  const description =
    post.seoDescription || post.excerpt || "Episode blog post from Barracks Media.";

  return {
    title: `${title} | Barracks Media`,
    description,
    openGraph: {
      title: `${title} | Barracks Media`,
      description,
      images: post.imageUrl ? [{ url: post.imageUrl }] : [],
    },
  };
}

export default async function BlogPostPage({ params }) {
  const slug = params?.slug;
  if (!slug) notFound();

  const post = await sanityClient.fetch(POST_BY_SLUG_QUERY, { slug });
  if (!post) notFound();

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
          <p className="mt-6 text-lg text-white/80">{post.excerpt}</p>
        )}

        <article className="prose prose-invert mt-10 max-w-none">
          <PortableText value={post.body} />
        </article>
      </div>
    </main>
  );
}
