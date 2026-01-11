// app/services/page.jsx
import Link from "next/link";
import { getServices } from "@/lib/sanity";

export const dynamic = "force-dynamic"; // ✅ prevents Next from caching this page
export const revalidate = 0; // ✅ always fetch fresh

export const metadata = {
  title: "Services | Barracks Media",
  description: "Services offered by Barracks Media.",
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

  return (
    <>
      <section className="container-card section hero-strip">
        <h1 className="h1">Services</h1>
        <p className="p">
          Pick what you need. Checkout is quick — then we collect details on the
          next screen.
        </p>
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
      </section>
    </>
  );
}
