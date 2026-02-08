// app/sitemap.xml/route.js
export const runtime = "nodejs";

function xmlEscape(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const base = "https://barracksmedia.com";

  const urls = [
    { loc: `${base}/`, changefreq: "weekly", priority: "1.0" },
    { loc: `${base}/network`, changefreq: "weekly", priority: "0.8" },
    { loc: `${base}/services`, changefreq: "weekly", priority: "0.9" },
    { loc: `${base}/blog`, changefreq: "weekly", priority: "0.8" },
    { loc: `${base}/apply`, changefreq: "monthly", priority: "0.7" },
    { loc: `${base}/advertise`, changefreq: "monthly", priority: "0.6" },
    { loc: `${base}/sponsorship`, changefreq: "monthly", priority: "0.6" },
    { loc: `${base}/testimonials`, changefreq: "monthly", priority: "0.6" },
    { loc: `${base}/privacy`, changefreq: "yearly", priority: "0.3" },
    { loc: `${base}/terms`, changefreq: "yearly", priority: "0.3" },
    { loc: `${base}/copyright`, changefreq: "yearly", priority: "0.2" },
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${xmlEscape(u.loc)}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
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
