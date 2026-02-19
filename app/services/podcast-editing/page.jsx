import Link from "next/link";
import Script from "next/script";
import { getServicesByCategory } from "@/lib/sanity";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Podcast Editing Services | Barracks Media",
  description:
    "Professional podcast editing services: noise reduction, leveling, cleanup, mixing, and delivery—so your show sounds credible and consistent.",
  alternates: { canonical: "/services/podcast-editing" },
  openGraph: {
    title: "Podcast Editing Services | Barracks Media",
    description:
      "Professional podcast editing: cleanup, leveling, mixing, and delivery—built for consistency and growth.",
    url: "https://barracksmedia.com/services/podcast-editing",
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
        name: "What is included in podcast editing?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Podcast editing typically includes cleanup, noise reduction, leveling, removal of long pauses, polishing transitions, and exporting broadcast-ready audio.",
        },
      },
      {
        "@type": "Question",
        name: "How do I send files for editing?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "After checkout, you’ll be directed to an onboarding screen where you can provide the details and file delivery method we need to complete the edit.",
        },
      },
      {
        "@type": "Question",
        name: "Why hire a podcast editor instead of DIY?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Hiring a podcast editor saves time, improves audio consistency, and helps your show sound credible—supporting retention, referrals, and brand trust.",
        },
      },
    ],
  };
}

export default async function PodcastEditingServicesPage() {
  const services = await getServicesByCategory("podcast-editing");
  const faqJsonLd = buildFaqJsonLd();

  return (
    <>
      <Script
        id="podcast-editing-faq"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <section className="container-card section hero-strip">
        <h1 className="h1">Podcast Editing</h1>
        <p className="p" style={{ maxWidth: 980 }}>
          If you’re searching for <strong>podcast editing services</strong>, you
          want one thing: a show that sounds professional and consistent without
          losing your life to a timeline. We handle cleanup, leveling, polishing,
          and delivery—so you can publish on schedule.
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
            DIY editing is “free” until you count the real cost: inconsistent
            audio, missed deadlines, and episodes that don’t represent your brand.
            Professional editing improves listener trust, retention, and shareability.
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
              No podcast editing services found
            </h2>
            <p className="p" style={{ marginTop: 10, opacity: 0.9 }}>
              Make sure your services in Sanity are set to category{" "}
              <strong>podcast-editing</strong> and are <strong>Active</strong>.
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
