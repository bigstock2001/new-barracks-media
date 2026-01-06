import Link from "next/link";
import { shows } from "@/lib/shows";

export const metadata = {
  title: "Network | Barracks Media",
  description: "Explore the Barracks Media network of shows and podcasts.",
};

export default function NetworkPage() {
  return (
    <>
      <section className="container-card section hero-strip">
        <h1 className="h1">The Network</h1>
        <p className="p" style={{ marginTop: 10 }}>
          All shows in one place. Click into any show to view details and episodes.
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
            >
              <div className="podCoverWrap" style={{ aspectRatio: "16 / 10" }}>
                <img src={s.image} alt={s.title} className="podCover" loading="lazy" />
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
