// app/sitemap.xml/route.js
export const runtime = "nodejs";

import { sanityClient } from "@/lib/sanity";

function xmlEscape(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

const POSTS_QUERY = `
  *[_type == "episodePost" && defined(slug.current)]
  | order(_updatedAt desc) {
    "slug": slug.current,
    _updatedAt
  }
`;

export async function GET() {
  const base = "https://barracksmedia.com";

  // Static URLs (keep your priorities if you want)
  const urls = [
    { loc: `${base}/`, changefreq: "weekly", priority: "1.0" },
    { loc: `${base}/network`, changefreq: "weekly", priority: "0.8" },
    { loc: `${base}/services`, changefreq: "weekly", priority: "0.9" },
    { loc: `${base}/blog`, changefreq: "weekly", priority: "0.8" },
    { loc: `${base}/apply`, changefreq: "monthly", priority: "0.7" },
    { loc: `${base}/webinars`, changefreq: "monthly", priority: "0.6" },
    { loc: `${base}/advertise`, changefreq: "monthly", priority: "0.6" },
    { loc: `${base}/sponsorship`, changefreq: "monthly", priority: "0.6" },
    { loc: `${base}/testimonials`, changefreq: "monthly", priority: "0.6" },
    { loc: `${base}/privacy`, changefreq: "yearly", priority: "0.3" },
    { loc: `${base}/terms`, changefreq: "yearly", priority: "0.3" },
    { loc: `${base}/copyright`, changefreq: "yearly", priority: "0.2" },
  ];

  // Blog post URLs (real indexable URLs)
  let posts = [];
  try {
    posts = await sanityClient.fetch(POSTS_QUERY);
    if (!Array.isArray(posts)) posts = [];
  } catch {
    posts = [];
  }

  const postUrls = posts
    .filter((p) => p?.slug)
    .map((p) => ({
      loc: `${base}/blog/${p.slug}`,
      changefreq: "monthly",
      priority: "0.7",
      lastmod: p._updatedAt ? new Date(p._updatedAt).toISOString() : null,
    }));

  const all = [...urls, ...postUrls];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${all
  .map((u) => `  <url>
    <loc>${xmlEscape(u.loc)}</loc>
    ${u.lastmod ? `<lastmod>${xmlEscape(u.lastmod)}</lastmod>` : ""}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`)
  .join("\n")}
</urlset>`;

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}