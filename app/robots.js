// app/robots.js
export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: "https://barracksmedia.com/sitemap.xml",
  };
}
