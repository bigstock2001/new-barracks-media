// app/network/page.jsx
import Link from "next/link";
import Script from "next/script";
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

function buildNetworkJsonLd() {
  const baseUrl = "https://barracksmedia.com";

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Barracks Media Podcast Network",
    url: `${baseUrl}/network`,
    description:
      "A veteran-led podcast network featuring leadership, storytelling, business, history, culture, and personal growth shows.",
    isPartOf: {
      "@type": "WebSite",
      name: "Barracks Media",
      url: baseUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "Barracks Media",
      url: baseUrl,
    },
  };
}

export default function NetworkPage() {
  const networkSchema = buildNetworkJsonLd();

  return (
    <>
      {/* ✅ SEO Schema */}
      <Script
        id="network-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(networkSchema) }}
      />

      <section className="container-card section hero-strip">
        <h1 className="h1">Barracks Media Podcast Network</h1>
        <p className="p" style={{ marginTop: 10 }}>
          Browse veteran-led podcasts and shows built for growth, impact, and authority.
          Click a show to view details and episodes.
        </p>
      </section>

      {/* ✅ NEW: SEO / LLM / authority block (adds word count + positioning) */}
      <section className="container-card section">
        <h2 className="h1" style={{ fontSize: 18 }}>
          Podcasts built to help the listener
        </h2>

        <p className="p" style={{ marginTop: 10, maxWidth: 980 }}>
          The Barracks Media Podcast Network exists to publish content that actually helps people.
          Every show in this network is designed to deliver value—leadership lessons, real stories,
          hard-earned experience, and practical insights listeners can apply immediately.
        </p>

        <p className="p" style={{ marginTop: 10, maxWidth: 980 }}>
          We’re veteran-led and mission-driven, but the goal is bigger than a label. We build shows
          that strengthen the pillars of life: discipline, purpose, faith, mindset, and leadership.
          If you’re searching for podcasts about leadership, personal development, business growth,
          storytelling, history, or culture, you’ll find a lineup here that respects your time and
          delivers substance.
        </p>

        <p className="p" style={{ marginTop: 10, maxWidth: 980 }}>
          Barracks Media focuses on professional production, consistent publishing, and long-term
          authority. This network is not random content—it’s a curated roster of podcasts built to
          inform, challenge, and improve the listener.
        </p>

        <div
          style={{
            marginTop: 14,
            paddingTop: 14,
            borderTop: "1px solid rgba(255,255,255,0.10)",
            maxWidth: 980,
          }}
        >
          <p className="p" style={{ opacity: 0.9 }}>
            Explore the shows below, pick what fits your season, and press play.
          </p>
        </div>
      </section>

      {/* Existing grid (unchanged logic) */}
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

      {/* Optional: small closing block for more context + internal linking */}
      <section className="container-card section">
        <h2 className="h1" style={{ fontSize: 18 }}>
          Want to join the network?
        </h2>
        <p className="p" style={{ marginTop: 10, maxWidth: 980 }}>
          If your show is aligned with service, growth, and consistency, you can apply to be part of
          the Barracks Media Network. We review submissions, confirm fit, and then walk you through
          the next steps.
        </p>

        <div style={{ marginTop: 14 }}>
          <Link className="tab" href="/apply">
            Apply to Join
          </Link>
        </div>
      </section>
    </>
  );
}
