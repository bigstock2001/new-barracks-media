// app/robots.js
export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Keep private portal/auth areas out of search
        disallow: ["/portal", "/api", "/onboarding"],
      },
    ],
    sitemap: "https://barracksmedia.com/sitemap.xml",
    host: "https://barracksmedia.com",
  };
}
