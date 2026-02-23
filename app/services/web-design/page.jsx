import Link from "next/link";
import Script from "next/script";
import { getServicesByCategory } from "@/lib/sanity";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const CALENDLY_URL = "https://calendly.com/donalddunn/project-planning";

export const metadata = {
  title: "Web Design Services for Businesses | Barracks Media",
  description:
    "Professional web design for businesses, coaches, and creators. SEO-ready, fast, conversion-focused websites built to scale—without template limitations. Book a project call to get started.",
  alternates: { canonical: "/services/web-design" },
  openGraph: {
    title: "Web Design Services for Businesses | Barracks Media",
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
        name: "Do I need a call before starting a web design project?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes. We start with a project call to understand your goals, pages, content, and timeline so we can recommend the right build and pricing before you commit.",
        },
      },
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
        name: "How long does a typical web design project take?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Most projects take one to three weeks once the scope, content, and brand assets are confirmed.",
        },
      },
      {
        "@type": "Question",
        name: "Can you redesign or rebuild an existing site?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes. We can improve performance, SEO structure, and conversion flow, or rebuild the site cleanly if the current foundation is limiting growth.",
        },
      },
    ],
  };
}

function SectionTitle({ children }) {
  return (
    <h2 className="h1" style={{ fontSize: 18, margin: 0 }}>
      {children}
    </h2>
  );
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

      {/* HERO */}
      <section className="container-card section hero-strip">
        <h1 className="h1">Web Design Services for Businesses</h1>

        <p className="p" style={{ maxWidth: 980 }}>
          If you’re searching for <strong>professional web design services</strong>,
          you’re not just buying a website — you’re building your digital headquarters.
          A great site loads fast, looks sharp on mobile, communicates trust, and guides
          visitors to take action.
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
            We start with a short project call so you can explain what you want and we
            can recommend the right build. No guessing. No buying blind.
          </p>
        </div>

        <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link className="tab" href="/services">
            Back to all services
          </Link>
          <Link className="tab" href="/portfolio">
            View Portfolio
          </Link>
          <Link className="tab" href="/testimonials">
            Testimonials
          </Link>
          <Link className="tab" href={CALENDLY_URL}>
            Book a Project Call
          </Link>
        </div>
      </section>

      {/* SEO SUPPORT SECTIONS */}
      <section className="section">
        <div
          style={{
            display: "grid",
            gap: 16,
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            alignItems: "stretch",
          }}
        >
          <div className="container-card" style={{ padding: 18 }}>
            <SectionTitle>Who This Is For</SectionTitle>
            <p className="p" style={{ marginTop: 10, opacity: 0.92 }}>
              We build sites for clients who need their website to support revenue and credibility:
            </p>
            <ul style={{ marginTop: 12, paddingLeft: 18 }}>
              <li className="p" style={{ marginTop: 6 }}>Small businesses</li>
              <li className="p" style={{ marginTop: 6 }}>Coaches and consultants</li>
              <li className="p" style={{ marginTop: 6 }}>Creators and podcasters</li>
              <li className="p" style={{ marginTop: 6 }}>Nonprofits and veteran-led brands</li>
            </ul>
          </div>

          <div className="container-card" style={{ padding: 18 }}>
            <SectionTitle>What You Get</SectionTitle>
            <ul style={{ marginTop: 12, paddingLeft: 18 }}>
              <li className="p" style={{ marginTop: 6 }}>Mobile-first layout</li>
              <li className="p" style={{ marginTop: 6 }}>Conversion-focused structure</li>
              <li className="p" style={{ marginTop: 6 }}>SEO-ready foundations (titles, headings, structure)</li>
              <li className="p" style={{ marginTop: 6 }}>Analytics-ready (GA4 + Search Console friendly)</li>
              <li className="p" style={{ marginTop: 6 }}>Performance-first approach (speed matters)</li>
            </ul>
          </div>

          <div className="container-card" style={{ padding: 18 }}>
            <SectionTitle>Our Process</SectionTitle>
            <ol style={{ marginTop: 12, paddingLeft: 18 }}>
              <li className="p" style={{ marginTop: 6 }}>
                <strong>Project call:</strong> goals, pages, content, and timeline.
              </li>
              <li className="p" style={{ marginTop: 6 }}>
                <strong>Structure:</strong> sitemap + conversion flow.
              </li>
              <li className="p" style={{ marginTop: 6 }}>
                <strong>Design:</strong> clean visuals built around your brand.
              </li>
              <li className="p" style={{ marginTop: 6 }}>
                <strong>Build:</strong> fast, scalable implementation.
              </li>
              <li className="p" style={{ marginTop: 6 }}>
                <strong>Launch:</strong> QA + handoff + next steps.
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* SERVICES GRID (CTA = BOOK A CALL) */}
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

                  <h2 className="h1" style={{ fontSize: 18, margin: 0 }}>
                    {raw?.title || "Untitled Service"}
                  </h2>

                  <p className="p" style={{ marginTop: 10 }}>
                    {raw?.shortDescription || "No description yet."}
                  </p>

                  <FeatureList features={raw?.features} />

                  <div style={{ flex: 1 }} />

                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 16 }}>
                    <Link className="tab" href={slug ? `/services/${slug}` : "/services"}>
                      Details
                    </Link>

                    <Link className="tab" href={CALENDLY_URL}>
                      Book a Call
                    </Link>
                  </div>

                  <p className="small" style={{ marginTop: 10, opacity: 0.8 }}>
                    We’ll confirm scope and recommend the right build before you commit.
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ON-PAGE FAQ */}
      <section className="section">
        <div className="container-card" style={{ padding: 18 }}>
          <SectionTitle>Web Design FAQ</SectionTitle>

          <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
            <details className="container-card" style={{ padding: 14 }}>
              <summary className="p" style={{ cursor: "pointer", fontWeight: 700 }}>
                Do I need a call before starting?
              </summary>
              <p className="p" style={{ marginTop: 10, opacity: 0.92 }}>
                Yes. We start with a project call to confirm goals, pages, content, and timeline—
                then we recommend the right build and pricing.
              </p>
            </details>

            <details className="container-card" style={{ padding: 14 }}>
              <summary className="p" style={{ cursor: "pointer", fontWeight: 700 }}>
                What makes a website SEO-ready?
              </summary>
              <p className="p" style={{ marginTop: 10, opacity: 0.92 }}>
                Clean structure, fast performance, mobile-first layout, clear headings, internal links,
                and content that matches real search intent.
              </p>
            </details>

            <details className="container-card" style={{ padding: 14 }}>
              <summary className="p" style={{ cursor: "pointer", fontWeight: 700 }}>
                How long does a typical project take?
              </summary>
              <p className="p" style={{ marginTop: 10, opacity: 0.92 }}>
                Most projects take one to three weeks once scope, content, and brand assets are confirmed.
              </p>
            </details>

            <details className="container-card" style={{ padding: 14 }}>
              <summary className="p" style={{ cursor: "pointer", fontWeight: 700 }}>
                Can you redesign an existing site?
              </summary>
              <p className="p" style={{ marginTop: 10, opacity: 0.92 }}>
                Yes. We can improve performance and conversion flow, or rebuild cleanly if the current
                foundation is limiting growth.
              </p>
            </details>
          </div>

          <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link className="tab" href="/portfolio">
              See Work Samples
            </Link>
            <Link className="tab" href={CALENDLY_URL}>
              Book a Project Call
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}