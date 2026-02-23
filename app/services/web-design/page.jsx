import Link from "next/link";
import Script from "next/script";
import { getServicesByCategory } from "@/lib/sanity";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Web Design Services for Businesses | Barracks Media",
  description:
    "Professional web design for businesses, coaches, and creators. SEO-ready, fast, conversion-focused websites built to scale—without template limitations.",
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
        name: "Do you build websites for small businesses and coaches?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes. Barracks Media builds professional websites for small businesses, coaches, consultants, and creators—focused on speed, trust, and conversion.",
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
        name: "Can you redesign or rebuild an existing site?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes. We can improve performance, SEO structure, and conversion flow, or rebuild the site cleanly if the current foundation is limiting growth.",
        },
      },
      {
        "@type": "Question",
        name: "How long does a typical web design project take?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Timelines depend on scope. Most projects take one to three weeks once we have your content, brand assets, and direction locked in.",
        },
      },
      {
        "@type": "Question",
        name: "Do you offer ongoing maintenance or updates?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes. Many clients choose ongoing support for updates, improvements, and keeping the site fast and secure over time.",
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

function SectionTitle({ children }) {
  return (
    <h2 className="h1" style={{ fontSize: 18, margin: 0 }}>
      {children}
    </h2>
  );
}

function BulletGrid({ items }) {
  return (
    <div
      style={{
        display: "grid",
        gap: 14,
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        marginTop: 12,
      }}
    >
      {items.map((it) => (
        <div
          key={it.title}
          className="container-card"
          style={{ padding: 16, borderRadius: 16 }}
        >
          <div className="small" style={{ opacity: 0.85 }}>
            {it.kicker}
          </div>
          <div className="p" style={{ marginTop: 6, fontWeight: 700 }}>
            {it.title}
          </div>
          <div className="p" style={{ marginTop: 8, opacity: 0.9 }}>
            {it.body}
          </div>
        </div>
      ))}
    </div>
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
            Templates can be a quick start, but many businesses outgrow them fast.
            The hidden cost shows up as slow performance, limited SEO structure, and
            redesigns you didn’t plan for. Barracks Media builds clean, scalable sites
            designed for long-term growth — not short-term shortcuts.
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
          <Link className="tab" href="/blog">
            Read the Blog
          </Link>
          <Link className="tab" href="https://calendly.com/donalddunn/project-planning">
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
              We build for people who need their website to support revenue — not just exist.
              This includes:
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
            <p className="p" style={{ marginTop: 10, opacity: 0.92 }}>
              Every build is designed to load fast, communicate trust, and convert.
            </p>
            <ul style={{ marginTop: 12, paddingLeft: 18 }}>
              <li className="p" style={{ marginTop: 6 }}>Mobile-first layout</li>
              <li className="p" style={{ marginTop: 6 }}>Conversion-focused structure</li>
              <li className="p" style={{ marginTop: 6 }}>SEO-ready foundations (titles, headings, structure)</li>
              <li className="p" style={{ marginTop: 6 }}>Analytics-ready (GA4 + Search Console friendly)</li>
              <li className="p" style={{ marginTop: 6 }}>Clean performance approach (speed matters)</li>
            </ul>
          </div>

          <div className="container-card" style={{ padding: 18 }}>
            <SectionTitle>Our Process</SectionTitle>
            <p className="p" style={{ marginTop: 10, opacity: 0.92 }}>
              Clear steps. No chaos. No surprises.
            </p>
            <ol style={{ marginTop: 12, paddingLeft: 18 }}>
              <li className="p" style={{ marginTop: 6 }}>
                <strong>Scope + goals:</strong> what the site must achieve.
              </li>
              <li className="p" style={{ marginTop: 6 }}>
                <strong>Structure:</strong> pages, navigation, and conversion flow.
              </li>
              <li className="p" style={{ marginTop: 6 }}>
                <strong>Design:</strong> clean visuals built around your brand.
              </li>
              <li className="p" style={{ marginTop: 6 }}>
                <strong>Build:</strong> fast, scalable implementation.
              </li>
              <li className="p" style={{ marginTop: 6 }}>
                <strong>Launch:</strong> QA + handoff + next steps for growth.
              </li>
            </ol>
          </div>
        </div>

        <div className="container-card" style={{ padding: 18, marginTop: 16 }}>
          <SectionTitle>What “SEO-Ready” Means Here</SectionTitle>
          <p className="p" style={{ marginTop: 10, opacity: 0.92, maxWidth: 980 }}>
            We build websites with SEO fundamentals baked in — not as an afterthought.
            That typically includes:
          </p>

          <BulletGrid
            items={[
              {
                kicker: "Structure",
                title: "Clean headings and page hierarchy",
                body: "H1/H2 structure that matches search intent and makes content easy to scan.",
              },
              {
                kicker: "Indexing",
                title: "Canonical, crawlable pages",
                body: "Clear page structure so Google can understand what each page is about.",
              },
              {
                kicker: "Speed",
                title: "Performance-first approach",
                body: "Fast load times and mobile-first layouts to reduce bounce and improve UX.",
              },
              {
                kicker: "Tracking",
                title: "Analytics-ready foundation",
                body: "Built to work cleanly with GA4 and Google Search Console for measurement.",
              },
            ]}
          />
        </div>
      </section>

      {/* SERVICES GRID (UNCHANGED CORE BEHAVIOR) */}
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

      {/* ON-PAGE FAQ (MATCHES JSON-LD) */}
      <section className="section">
        <div className="container-card" style={{ padding: 18 }}>
          <SectionTitle>Web Design FAQ</SectionTitle>

          <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
            <details className="container-card" style={{ padding: 14 }}>
              <summary className="p" style={{ cursor: "pointer", fontWeight: 700 }}>
                Do you build websites for small businesses and coaches?
              </summary>
              <p className="p" style={{ marginTop: 10, opacity: 0.92 }}>
                Yes. We build professional sites for small businesses, coaches, consultants, and creators—
                focused on speed, trust, and conversion.
              </p>
            </details>

            <details className="container-card" style={{ padding: 14 }}>
              <summary className="p" style={{ cursor: "pointer", fontWeight: 700 }}>
                What makes a website SEO-ready?
              </summary>
              <p className="p" style={{ marginTop: 10, opacity: 0.92 }}>
                Clean structure, fast load time, mobile-first layout, clear headings, internal links,
                and content that matches real search intent.
              </p>
            </details>

            <details className="container-card" style={{ padding: 14 }}>
              <summary className="p" style={{ cursor: "pointer", fontWeight: 700 }}>
                Can you redesign or rebuild an existing site?
              </summary>
              <p className="p" style={{ marginTop: 10, opacity: 0.92 }}>
                Yes. We can improve performance/SEO and conversion flow, or rebuild cleanly if the current
                foundation is limiting growth.
              </p>
            </details>

            <details className="container-card" style={{ padding: 14 }}>
              <summary className="p" style={{ cursor: "pointer", fontWeight: 700 }}>
                How long does a typical web design project take?
              </summary>
              <p className="p" style={{ marginTop: 10, opacity: 0.92 }}>
                Most projects take one to three weeks once we have your content, brand assets, and scope locked in.
              </p>
            </details>

            <details className="container-card" style={{ padding: 14 }}>
              <summary className="p" style={{ cursor: "pointer", fontWeight: 700 }}>
                Do you offer ongoing maintenance or updates?
              </summary>
              <p className="p" style={{ marginTop: 10, opacity: 0.92 }}>
                Yes. Many clients choose ongoing support for updates, improvements, and keeping the site fast over time.
              </p>
            </details>

            <details className="container-card" style={{ padding: 14 }}>
              <summary className="p" style={{ cursor: "pointer", fontWeight: 700 }}>
                How does checkout work?
              </summary>
              <p className="p" style={{ marginTop: 10, opacity: 0.92 }}>
                Stripe handles checkout. After purchase, you’ll be taken to the next screen where we collect the details
                needed to deliver the service.
              </p>
            </details>
          </div>

          <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link className="tab" href="/portfolio">
              See Work Samples
            </Link>
            <Link className="tab" href="https://calendly.com/donalddunn/project-planning">
              Book a Project Call
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}