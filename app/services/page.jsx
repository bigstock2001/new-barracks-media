import Link from "next/link";
import { getServices } from "@/lib/sanity";

export const metadata = {
  title: "Services | Barracks Media",
  description: "Services offered by Barracks Media.",
};

function FeatureList({ features }) {
  if (!Array.isArray(features) || features.length === 0) return null;
  return (
    <ul style={{ marginTop: 10, paddingLeft: 18 }}>
      {features.slice(0, 6).map((f, idx) => (
        <li key={idx} className="p" style={{ marginTop: 6 }}>
          {f}
        </li>
      ))}
    </ul>
  );
}

export default async function ServicesPage() {
  const services = await getServices();

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
        <div
          style={{
            display: "grid",
            gap: 16,
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          }}
        >
          {(services || []).map((s) => (
            <div key={s._id} className="container-card" style={{ padding: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h2 className="h1" style={{ fontSize: 18 }}>
                  {s.title}
                </h2>
                <span className="small" style={{ opacity: 0.85 }}>
                  {s.stripeMode === "subscription" ? "Monthly" : "One-time"}
                </span>
              </div>

              <p className="p" style={{ marginTop: 10 }}>
                {s.shortDescription}
              </p>

              <FeatureList features={s.features} />

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 16 }}>
                <Link className="tab" href={`/services/${s.slug}`}>
                  Details
                </Link>

                <form action="/api/checkout/start" method="POST">
                  <input type="hidden" name="slug" value={s.slug} />
                  <button className="tab" type="submit">
                    {s.ctaLabel || "Get Started"}
                  </button>
                </form>
              </div>

              <p className="small" style={{ marginTop: 10, opacity: 0.8 }}>
                You’ll be redirected to Stripe Checkout.
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
