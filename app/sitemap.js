// app/sitemap.js
import { sanityClient } from "@/lib/sanity";

export const revalidate = 3600; // update sitemap hourly

const POSTS_QUERY = `
  *[_type == "episodePost" && defined(slug.current)]
  | order(_updatedAt desc) {
    "slug": slug.current,
    _updatedAt
  }
`;

export default async function sitemap() {
  const baseUrl = "https://barracksmedia.com";

  // Static site URLs
  const staticRoutes = [
    { url: `${baseUrl}/`, lastModified: new Date() },
    { url: `${baseUrl}/network`, lastModified: new Date() },
    { url: `${baseUrl}/services`, lastModified: new Date() },
    { url: `${baseUrl}/blog`, lastModified: new Date() },
    { url: `${baseUrl}/apply`, lastModified: new Date() },
    { url: `${baseUrl}/webinars`, lastModified: new Date() },
    { url: `${baseUrl}/advertise`, lastModified: new Date() },
    { url: `${baseUrl}/sponsorship`, lastModified: new Date() },
    { url: `${baseUrl}/testimonials`, lastModified: new Date() },
    { url: `${baseUrl}/privacy`, lastModified: new Date() },
    { url: `${baseUrl}/terms`, lastModified: new Date() },
    { url: `${baseUrl}/copyright`, lastModified: new Date() },
  ];

  // Episode posts
  let posts = [];
  try {
    posts = await sanityClient.fetch(POSTS_QUERY);
    if (!Array.isArray(posts)) posts = [];
  } catch {
    posts = [];
  }

  // ✅ Real, indexable URLs (no #fragments)
  const postRoutes = posts.map((p) => ({
    url: `${baseUrl}/blog/${p.slug}`,
    lastModified: p._updatedAt ? new Date(p._updatedAt) : new Date(),
  }));

  return [...staticRoutes, ...postRoutes];
}