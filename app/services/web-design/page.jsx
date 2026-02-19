import Link from "next/link";
import Script from "next/script";
import { getServicesByCategory } from "@/lib/sanity";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Web Design Services | Barracks Media",
  description:
    "Professional web design for small businesses and creators. SEO-ready, fast, conversion-focused websites built to scale—without template limitations.",
  alternates: { canonical: "/services/web-design" },
  openGraph: {
    title: "Web Design Services | Barracks Media",
    description:
      "Professional web design that loads fast, ranks, and converts—built clean, built to scale.",
    url: "https://barracksmedia.com/services/web-design",
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
        name: "What makes a website SEO-ready?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "An SEO-ready website has clean structure, fast load times, mobile-friendly layout, clear headings, internal linking, and content that matches what people search for.",
        },
      },
      {
        "@type": "Question",
        name: "Why can templates become expensive later?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Many templates create limitations: slow performance, rigid layouts, and poor SEO structure. Businesses often end up paying for fixes, redesigns, or complete rebuilds later.",
        },
      },
      {
        "@type": "Question",
        name: "How does checkout work?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Checkout is handled through Stripe. After purchase, you’ll be taken to the next screen where we collect the details needed to deliver the service.",
        },
      },
    ],
  };
}

export default async function WebDesignServicesPage() {
  const services = await getServicesByCategory("web-design");
  const faqJsonLd = buildFaqJsonLd();

  return (
    <>
      <Script
        id="web-design-faq"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <section className="container-card section hero-strip">
        <h1 className="h1">Web Design</h1>

        <p className="p" style={{ maxWidth: 980 }}>
          If you’re searching for <strong>professional web design</strong>, you’re
          not just buying a website — you’re building your digital headquarters.
          A good website loads fast, looks professional on mobile, communicates
          trust, and guides visitors to take action.
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
            Templates can be a quick start, but many businesses outgrow them fast.
            The hidden cost shows up as slow performance, limited SEO structure,
            and redesigns you didn’t plan for. Barracks Media builds clean, scalable
            sites designed for long-term growth — not short-term shortcuts.
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
              No web design services found
            </h2>
            <p className="p" style={{ marginTop: 10, opacity: 0.9 }}>
              Make sure your services in Sanity are:
              <br />• <strong>Active</strong>
              <br />• category set to <strong>web-design</strong>
              <br />• Published (not Draft)
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
