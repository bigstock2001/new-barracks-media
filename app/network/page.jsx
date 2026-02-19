// app/network/page.jsx
import Link from "next/link";
import { shows } from "@/lib/shows";

export const metadata = {
  title: "Veteran-Led Podcast Network & Shows | Barracks Media",
  description:
    "Explore the Barracks Media podcast network—veteran-led shows featuring leadership, storytelling, business, history, and culture. Find a show and start listening.",
  alternates: { canonical: "/network" },
  openGraph: {
    title: "Veteran-Led Podcast Network & Shows | Barracks Media",
    description:
      "Explore the Barracks Media podcast network—veteran-led shows featuring leadership, storytelling, business, history, and culture.",
    url: "https://barracksmedia.com/network",
    type: "website",
    siteName: "Barracks Media",
  },
  twitter: {
    card: "summary_large_image",
    title: "Veteran-Led Podcast Network & Shows | Barracks Media",
    description:
      "Explore the Barracks Media podcast network—veteran-led shows featuring leadership, storytelling, business, history, and culture.",
  },
};

export default function NetworkPage() {
  return (
    <>
      <section className="container-card section hero-strip">
        <h1 className="h1">Barracks Media Podcast Network</h1>
        <p className="p" style={{ marginTop: 10 }}>
          Browse veteran-led podcasts and shows built for growth, impact, and authority.
          Click a show to view details and episodes.
        </p>
      </section>

      <section className="container-card section">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
          }}
        >
          {shows.map((s) => (
            <Link
              key={s.slug}
              href={`/network/${s.slug}`}
              className="podCard"
              style={{ width: "100%" }}
              title={`Listen to ${s.title}`}
            >
              <div className="podCoverWrap" style={{ aspectRatio: "16 / 10" }}>
                <img
                  src={s.image}
                  alt={`${s.title} podcast cover`}
                  className="podCover"
                  loading="lazy"
                />
              </div>

              <div className="podMeta">
                <div className="podTitle">{s.title}</div>
                <div className="podCta">{s.tagline}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
