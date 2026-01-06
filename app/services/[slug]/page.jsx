import Link from "next/link";
import { notFound } from "next/navigation";
import { getServiceBySlug } from "@/lib/sanity";

export async function generateMetadata({ params }) {
  const p = await params;
  const service = await getServiceBySlug(p?.slug);
  if (!service || service.active === false) return { title: "Service Not Found" };

  return {
    title: `${service.title} | Barracks Media`,
    description: service.shortDescription,
  };
}

export default async function ServiceDetailPage({ params }) {
  const p = await params;
  const service = await getServiceBySlug(p?.slug);

  if (!service || service.active === false) return notFound();

  return (
    <>
      <section className="container-card section">
        <Link className="link" href="/services">
          ← Back to Services
        </Link>

        <h1 className="h1" style={{ marginTop: 12 }}>
          {service.title}
        </h1>
        <p className="p" style={{ marginTop: 10 }}>
          {service.shortDescription}
        </p>

        {Array.isArray(service.features) && service.features.length > 0 ? (
          <>
            <div className="divider" style={{ marginTop: 16, marginBottom: 16 }} />
            <ul style={{ paddingLeft: 18 }}>
              {service.features.map((f, idx) => (
                <li key={idx} className="p" style={{ marginTop: 8 }}>
                  {f}
                </li>
              ))}
            </ul>
          </>
        ) : null}

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 18 }}>
          <form action="/api/checkout/start" method="POST">
            <input type="hidden" name="slug" value={service.slug} />
            <button className="tab" type="submit">
              {service.ctaLabel || "Get Started"}
            </button>
          </form>

          <Link className="tab" href="/network">
            Explore the Network
          </Link>
        </div>
      </section>
    </>
  );
}
