// app/sitemap.js
import { sanityClient } from "@/lib/sanity";

export default async function sitemap() {
  const baseUrl = "https://barracksmedia.com";

  // Core site URLs
  const urls = [
    { url: `${baseUrl}/`, lastModified: new Date() },
    { url: `${baseUrl}/network`, lastModified: new Date() },
    { url: `${baseUrl}/services`, lastModified: new Date() },
    { url: `${baseUrl}/blog`, lastModified: new Date() },
    { url: `${baseUrl}/apply`, lastModified: new Date() },
    { url: `${baseUrl}/advertise`, lastModified: new Date() },
    { url: `${baseUrl}/sponsorship`, lastModified: new Date() },
    { url: `${baseUrl}/testimonials`, lastModified: new Date() },
    { url: `${baseUrl}/webinars`, lastModified: new Date() },
    { url: `${baseUrl}/privacy`, lastModified: new Date() },
    { url: `${baseUrl}/terms`, lastModified: new Date() },
    { url: `${baseUrl}/copyright`, lastModified: new Date() },
  ];

  // Blog post slugs from Sanity (so Google can discover them later if/when we restore slug pages)
  let posts = [];
  try {
    posts = await sanityClient.fetch(`
      *[_type == "episodePost" && defined(slug.current)]{
        "slug": slug.current,
        publishedAt
      }
    `);
  } catch {
    posts = [];
  }

  const postUrls = (posts || [])
    .filter((p) => p?.slug)
    .map((p) => ({
      url: `${baseUrl}/blog#${p.slug}`, // since posts are inline now, use an anchor target
      lastModified: p.publishedAt ? new Date(p.publishedAt) : new Date(),
    }));

  return [...urls, ...postUrls];
}
