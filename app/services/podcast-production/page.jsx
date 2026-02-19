import Link from "next/link";
import Script from "next/script";
import { getServicesByCategory } from "@/lib/sanity";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Podcast Production Services | Barracks Media",
  description:
    "Podcast production services for creators and businesses: planning, systems, publishing workflow, consistency support, and professional execution.",
  alternates: { canonical: "/services/podcast-production" },
  openGraph: {
    title: "Podcast Production Services | Barracks Media",
    description:
      "Podcast production systems and support to publish consistently and grow your show.",
    url: "https://barracksmedia.com/services/podcast-production",
    type: "website",
  },
};

function FeatureList({ features }) {
  if (!Array.isArray(features) || features.length === 0) return null;
  return (
    <ul style={{ marginTop: 12, paddingLeft: 18 }}>
      {features.slice(0, 6).map((f, idx) => (
        <li key={idx} className="p" style={{ marginTop: 6 }}>
          {f}
        </li>
      ))}
    </ul>
  );
}

function ServiceBanner({ raw }) {
  const url = raw?.image?.asset?.url || "";
  if (!url) return null;
  const alt = raw?.image?.alt || raw?.title || "Service image";

  return (
    <div
      style={{
        width: "100%",
        height: 180,
        borderRadius: 16,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.10)",
        background: "rgba(255,255,255,0.04)",
        marginBottom: 14,
        position: "relative",
      }}
    >
      <img
        src={url}
        alt={alt}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          transform: "scale(1.02)",
        }}
        loading="lazy"
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0.12), rgba(0,0,0,0))",
        }}
      />
    </div>
  );
}

function buildFaqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the difference between podcast production and podcast editing?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Podcast editing focuses on polishing recorded audio. Podcast production includes the larger system: planning, workflow, publishing support, consistency, and making the whole process repeatable.",
        },
      },
      {
        "@type": "Question",
        name: "Can you help me publish consistently?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes. We help build a repeatable production workflow so episodes get recorded, edited, published, and promoted consistently without chaos.",
        },
      },
      {
        "@type": "Question",
        name: "Do you work with remote recordings?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes. We support common remote workflows and can help you plan a smooth session so recordings stay clean and efficient.",
        },
      },
    ],
  };
}

export default async function PodcastProductionServicesPage() {
  const services = await getServicesByCategory("podcast-production");
  const faqJsonLd = buildFaqJsonLd();

  return (
    <>
      <Script
        id="podcast-production-faq"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <section className="container-card section hero-strip">
        <h1 className="h1">Podcast Production</h1>
        <p className="p" style={{ maxWidth: 980 }}>
          Podcast production isn’t just an edit—it’s the system behind the show.
          If you want consistent publishing, clean workflow, and a process that scales,
          production is what turns “random episodes” into a real media asset.
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
            Barracks Media builds repeatable production workflows: planning, recording support,
            editing coordination, publishing cadence, and quality control—so you can stay consistent
            without burning out.
          </p>
        </div>

        <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link className="tab" href="/services">
            Back to all services
          </Link>
        </div>
      </section>

      <section className="section">
        {services.length === 0 ? (
          <div className="container-card" style={{ padding: 18 }}>
            <h2 className="h1" style={{ fontSize: 18 }}>
              No podcast production services found
            </h2>
            <p className="p" style={{ marginTop: 10, opacity: 0.9 }}>
              Make sure your services in Sanity are set to category{" "}
              <strong>podcast-production</strong> and are <strong>Active</strong>.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gap: 16,
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              alignItems: "stretch",
            }}
          >
            {services.map((raw) => {
              const slug =
                typeof raw?.slug === "string" ? raw.slug : raw?.slug?.current || "";
              const stripeMode = raw?.stripeMode || "payment";
              const ctaLabel = raw?.ctaLabel || "Get Started";

              return (
                <div
                  key={raw._id || slug}
                  className="container-card"
                  style={{
                    padding: 18,
                    display: "flex",
                    flexDirection: "column",
                    minHeight: 0,
                  }}
                >
                  <ServiceBanner raw={raw} />

                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <h2 className="h1" style={{ fontSize: 18, margin: 0 }}>
                      {raw?.title || "Untitled Service"}
                    </h2>
                    <span className="small" style={{ opacity: 0.85, whiteSpace: "nowrap" }}>
                      {stripeMode === "subscription" ? "Monthly" : "One-time"}
                    </span>
                  </div>

                  <p className="p" style={{ marginTop: 10 }}>
                    {raw?.shortDescription || "No description yet."}
                  </p>

                  <FeatureList features={raw?.features} />

                  <div style={{ flex: 1 }} />

                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 16 }}>
                    <Link className="tab" href={slug ? `/services/${slug}` : "/services"}>
                      Details
                    </Link>

                    <form action="/api/checkout/start" method="POST">
                      <input type="hidden" name="slug" value={slug} />
                      <button className="tab" type="submit" disabled={!slug}>
                        {ctaLabel}
                      </button>
                    </form>
                  </div>

                  <p className="small" style={{ marginTop: 10, opacity: 0.8 }}>
                    You’ll be redirected to Stripe Checkout.
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
