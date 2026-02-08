// app/services/page.jsx
import Link from "next/link";
import Script from "next/script";
import { getServices } from "@/lib/sanity";

export const dynamic = "force-dynamic"; // ✅ prevents Next from caching this page
export const revalidate = 0; // ✅ always fetch fresh

export const metadata = {
  title: "Podcast Services & Web Design | Barracks Media",
  description:
    "Barracks Media offers podcast production, podcast editing, podcast launch support, and web design services. Built clean. Built to scale.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Podcast Services & Web Design | Barracks Media",
    description:
      "Podcast production, editing, launch support, and web design services—built clean, built to scale.",
    url: "https://barracksmedia.com/services",
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
        name: "What services does Barracks Media offer?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Barracks Media provides podcast production, podcast editing, podcast launch support, and web design services to help creators and businesses publish consistently and grow.",
        },
      },
      {
        "@type": "Question",
        name: "Do you work with remote recordings and livestreams?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes. We support common remote workflows and can help you plan a smooth session so your recording stays clean and efficient.",
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
      {
        "@type": "Question",
        name: "What if a service shows “missing slug”?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "That means the service entry in Sanity is missing a published slug. Publish the slug to enable the Details and Checkout buttons for that service.",
        },
      },
    ],
  };
}

export default async function ServicesPage() {
  let services = [];
  let sanityError = "";

  try {
    services = await getServices();
    if (!Array.isArray(services)) services = [];
  } catch (e) {
    sanityError = e?.message || "Failed to load services.";
    services = [];
  }

  const faqJsonLd = buildFaqJsonLd();

  return (
    <>
      {/* ✅ SEO: FAQ schema (safe, no behavior change) */}
      <Script
        id="services-faq-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <section className="container-card section hero-strip">
        <h1 className="h1">Services</h1>
        <p className="p">
          Pick what you need. Checkout is quick — then we collect details on the
          next screen.
        </p>

        {/* ✅ SEO context block (safe, indexable text; does not change cards) */}
        <div
          style={{
            marginTop: 14,
            paddingTop: 14,
            borderTop: "1px solid rgba(255,255,255,0.10)",
            maxWidth: 980,
          }}
        >
          <p className="p" style={{ opacity: 0.9 }}>
            Barracks Media offers <strong>podcast editing</strong>,{" "}
            <strong>podcast production</strong>, <strong>podcast launch</strong>, and{" "}
            <strong>web design</strong> services designed to help creators publish consistently
            and look professional. If you want a clean workflow—record, edit, publish, promote—we’ll
            help you build it and keep it running.
          </p>
        </div>
      </section>

      <section className="section">
        {sanityError ? (
          <div className="container-card" style={{ padding: 18, marginBottom: 16 }}>
            <h2 className="h1" style={{ fontSize: 18 }}>
              Services failed to load
            </h2>
            <p className="p" style={{ marginTop: 10, opacity: 0.9 }}>
              {sanityError}
            </p>
            <p className="small" style={{ marginTop: 10, opacity: 0.8 }}>
              Check that NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET
              are set in both .env.local and Vercel (Production).
            </p>
          </div>
        ) : null}

        {services.length === 0 ? (
          <div className="container-card" style={{ padding: 18 }}>
            <h2 className="h1" style={{ fontSize: 18 }}>
              No services found
            </h2>
            <p className="p" style={{ marginTop: 10, opacity: 0.9 }}>
              If you just created services in Sanity, make sure they are{" "}
              <strong>Published</strong> (not Draft), and that your site is pointing to
              the same dataset as your Studio.
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
                typeof raw?.slug === "string"
                  ? raw.slug
                  : raw?.slug?.current || "";

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

                  {raw?.shortDescription ? (
                    <p className="p" style={{ marginTop: 10 }}>
                      {raw.shortDescription}
                    </p>
                  ) : (
                    <p className="p" style={{ marginTop: 10, opacity: 0.85 }}>
                      No description yet.
                    </p>
                  )}

                  <FeatureList features={raw?.features} />

                  <div style={{ flex: 1 }} />

                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      flexWrap: "wrap",
                      marginTop: 16,
                      alignItems: "center",
                    }}
                  >
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

                  {!slug ? (
                    <p className="small" style={{ marginTop: 8, opacity: 0.75 }}>
                      This service is missing a slug in Sanity — publish the slug to enable
                      Details / Checkout.
                    </p>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}

        {/* ✅ Visible FAQ (safe: adds content only, does not affect existing grid) */}
        <div className="container-card" style={{ padding: 18, marginTop: 18 }}>
          <h2 className="h1" style={{ fontSize: 18, margin: 0 }}>
            FAQ
          </h2>

          <div style={{ marginTop: 12 }}>
            <p className="p" style={{ marginTop: 10 }}>
              <strong>What services does Barracks Media offer?</strong>
              <br />
              Podcast production, podcast editing, podcast launch support, and web design—built to help
              you publish consistently and grow.
            </p>

            <p className="p" style={{ marginTop: 10 }}>
              <strong>Do you work with remote recordings and livestreams?</strong>
              <br />
              Yes. We support common remote workflows and can help you plan a smooth session so your
              recording stays clean and efficient.
            </p>

            <p className="p" style={{ marginTop: 10 }}>
              <strong>How does checkout work?</strong>
              <br />
              Checkout is handled through Stripe. After purchase, you’ll be taken to the next screen
              where we collect the details needed to deliver the service.
            </p>

            <p className="p" style={{ marginTop: 10 }}>
              <strong>What if a service shows “missing slug”?</strong>
              <br />
              That means the service entry in Sanity is missing a published slug. Publish the slug to
              enable the Details and Checkout buttons for that service.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
