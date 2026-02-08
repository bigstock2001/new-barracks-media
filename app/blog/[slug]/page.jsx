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
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ✅ Dynamic metadata per post (fixes duplicate title/meta problems)
export async function generateMetadata({ params }) {
  const slug = params?.slug;
  if (!slug) return {};

  try {
    const post = await sanityClient.fetch(POST_BY_SLUG_QUERY, { slug });
    if (!post) return {};

    const title = post.seoTitle?.trim() || post.title || "Blog Post";
    const description =
      post.seoDescription?.trim() ||
      post.excerpt?.trim() ||
      "Episode blog post and show notes from Barracks Media.";

    return {
      title: `${title} | Barracks Media`,
      description,
      openGraph: {
        title: `${title} | Barracks Media`,
        description,
        images: post.imageUrl ? [{ url: post.imageUrl }] : [],
      },
    };
  } catch (e) {
    return {};
  }
}

const portableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="mt-10 text-2xl font-semibold tracking-tight text-white">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 text-xl font-semibold tracking-tight text-white">
        {children}
      </h3>
    ),
    normal: ({ children }) => (
      <p className="mt-4 leading-relaxed text-white/80">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="mt-6 border-l-4 border-white/20 pl-4 text-white/75">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mt-4 list-disc space-y-2 pl-6 text-white/80">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="mt-4 list-decimal space-y-2 pl-6 text-white/80">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
  },
  marks: {
    link: ({ value, children }) => {
      const href = value?.href || "#";
      const isExternal = href.startsWith("http");
      return (
        <a
          href={href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="underline decoration-white/30 underline-offset-4 hover:decoration-white/70 text-white"
        >
          {children}
        </a>
      );
    },
    strong: ({ children }) => (
      <strong className="font-semibold text-white">{children}</strong>
    ),
  },
};

export default async function BlogPostPage({ params }) {
  const slug = params?.slug;
  if (!slug) notFound();

  const post = await sanityClient.fetch(POST_BY_SLUG_QUERY, { slug });
  if (!post) notFound();

  const metaBits = [
    post.showName ? post.showName : null,
    post.episodeNumber ? `Ep. ${post.episodeNumber}` : null,
    post.guestName ? `Guest: ${post.guestName}` : null,
    post.episodeDuration ? `Duration: ${post.episodeDuration}` : null,
  ].filter(Boolean);

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-4xl px-5 py-12">
        {/* Back link */}
        <div className="mb-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm text-white/80 backdrop-blur hover:border-white/20 hover:bg-black/40"
          >
            ← Back to Blog
          </Link>
        </div>

        {/* Header */}
        <header className="rounded-3xl border border-white/10 bg-black/30 p-6 backdrop-blur">
          <div className="text-sm text-white/60">{formatDate(post.publishedAt)}</div>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
            {post.title}
          </h1>

          {metaBits.length > 0 && (
            <div className="mt-3 text-sm text-white/70">{metaBits.join(" • ")}</div>
          )}

          {post.excerpt && (
            <p className="mt-4 text-white/80 leading-relaxed">{post.excerpt}</p>
          )}

          {/* Optional embed link */}
          {post.episodeEmbedUrl && (
            <div className="mt-5">
              <a
                href={post.episodeEmbedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/15"
              >
                Listen / Watch Episode ↗
              </a>
            </div>
          )}
        </header>

        {/* Featured image */}
        {post.imageUrl && (
          <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-3xl border border-white/10 bg-white/5">
            <Image
              src={post.imageUrl}
              alt={post.title || "Blog image"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
              priority={false}
            />
          </div>
        )}

        {/* Body */}
        <article className="mt-8 rounded-3xl border border-white/10 bg-black/20 p-6 backdrop-blur">
          {post.body ? (
            <PortableText value={post.body} components={portableTextComponents} />
          ) : (
            <p className="text-white/70">No content yet.</p>
          )}
        </article>

        {/* Footer CTA */}
        <div className="mt-10 rounded-3xl border border-white/10 bg-black/30 p-6 text-white/80 backdrop-blur">
          <h2 className="text-lg font-semibold text-white">Want help growing your show?</h2>
          <p className="mt-2">
            Barracks Media helps creators and brands launch, edit, and scale podcasts with
            professional production and a real growth plan.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/services"
              className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/15"
            >
              Explore Services
            </Link>
            <Link
              href="/apply"
              className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/15"
            >
              Apply to the Network
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
