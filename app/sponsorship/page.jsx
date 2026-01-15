// app/sponsorship/page.jsx

import Link from "next/link";
import { getNetworkMetrics } from "@/lib/sanity";

function formatCompactNumber(n) {
  if (typeof n !== "number") return "0";
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}

function formatDate(d) {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "—";
  }
}

export const metadata = {
  title: "Sponsorship | Barracks Media",
  description:
    "Sponsor the Barracks Media network with rolling 30-day reach metrics, placements, and simple reporting.",
};

export default async function SponsorshipPage() {
  const m = await getNetworkMetrics().catch(() => null);

  const periodDays = m?.periodDays ?? 30;
  const downloads30d = m?.podcastDownloads30d ?? 0;
  const social30d = m?.socialReach30d ?? 0;
  const video30d = m?.videoViews30d ?? 0;
  const includeVideo = m?.includeVideoInTotal === true;
  const estReach30d = m?.estimatedTotalReach30d ?? downloads30d + social30d;
  const lastUpdated = m?.lastUpdated ?? null;

  const mailto = `mailto:ddunn@veteranvoiceradio.com?subject=${encodeURIComponent(
    "Sponsorship Inquiry — Barracks Media"
  )}&body=${encodeURIComponent(
    "Hi Donald,\n\nI’m interested in sponsorship opportunities with Barracks Media.\n\nCompany/Brand:\nBudget Range:\nCampaign Goal:\nTimeline:\nPreferred Package (Bronze/Silver/Gold or Custom):\n\nThanks!"
  )}`;

  return (
    <main className="main">
      <div className="container" style={{ paddingTop: 28, paddingBottom: 40 }}>
        <h1 style={{ margin: 0, fontSize: 34, fontWeight: 900 }}>
          Sponsorship
        </h1>
        <p className="subtle" style={{ marginTop: 10, maxWidth: 860 }}>
          Sponsor a veteran-focused media network with transparent, rolling
          metrics and placements designed to deliver real attention — not fluff.
        </p>

        {/* Big reach block */}
        <section className="container-card" style={{ marginTop: 22 }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900 }}>
              Estimated Monthly Network Reach
            </h2>
            <div style={{ opacity: 0.8, fontSize: 13 }}>
              Rolling {periodDays} days • Updated:{" "}
              <strong>{formatDate(lastUpdated)}</strong>
            </div>
          </div>

          <div style={{ marginTop: 10, fontSize: 46, fontWeight: 950, lineHeight: 1.05 }}>
            {formatCompactNumber(estReach30d)}+
          </div>

          <p className="subtle" style={{ marginTop: 10, maxWidth: 900 }}>
            This figure is calculated from rolling {periodDays}-day podcast
            downloads plus rolling social reach
            {includeVideo ? " plus video views" : ""} across the Barracks Media
            network.
          </p>

          {/* Breakdown */}
          <div
            style={{
              marginTop: 16,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 12,
            }}
          >
            <div
              style={{
                borderRadius: 16,
                padding: 16,
                border: "1px solid rgba(255,255,255,0.10)",
                background: "rgba(255,255,255,0.03)",
              }}
            >
              <div style={{ opacity: 0.8, fontSize: 13 }}>
                Podcast Downloads (Rolling {periodDays} Days)
              </div>
              <div style={{ marginTop: 8, fontSize: 30, fontWeight: 900 }}>
                {formatCompactNumber(downloads30d)}+
              </div>
            </div>

            <div
              style={{
                borderRadius: 16,
                padding: 16,
                border: "1px solid rgba(255,255,255,0.10)",
                background: "rgba(255,255,255,0.03)",
              }}
            >
              <div style={{ opacity: 0.8, fontSize: 13 }}>
                Social Reach (Rolling {periodDays} Days)
              </div>
              <div style={{ marginTop: 8, fontSize: 30, fontWeight: 900 }}>
                {formatCompactNumber(social30d)}+
              </div>
            </div>

            {includeVideo ? (
              <div
                style={{
                  borderRadius: 16,
                  padding: 16,
                  border: "1px solid rgba(255,255,255,0.10)",
                  background: "rgba(255,255,255,0.03)",
                }}
              >
                <div style={{ opacity: 0.8, fontSize: 13 }}>
                  Video Views (Rolling {periodDays} Days)
                </div>
                <div style={{ marginTop: 8, fontSize: 30, fontWeight: 900 }}>
                  {formatCompactNumber(video30d)}+
                </div>
              </div>
            ) : null}
          </div>

          {m?.publicMethodology ? (
            <div style={{ marginTop: 14 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 900 }}>
                Methodology
              </h3>
              <p className="subtle" style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>
                {m.publicMethodology}
              </p>
            </div>
          ) : null}
        </section>

        {/* Packages */}
        <section
          style={{
            marginTop: 18,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 14,
          }}
        >
          <div className="container-card">
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900 }}>
              Bronze Sponsor
            </h3>
            <p className="subtle" style={{ marginTop: 8 }}>
              Best for local brands testing performance: a clean placement + a
              simple report.
            </p>
            <ul style={{ marginTop: 10, paddingLeft: 18, lineHeight: 1.7 }}>
              <li>Podcast mention placement</li>
              <li>Basic social feature</li>
              <li>Monthly reporting</li>
            </ul>
          </div>

          <div className="container-card">
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900 }}>
              Silver Sponsor
            </h3>
            <p className="subtle" style={{ marginTop: 8 }}>
              Best for consistent visibility: higher frequency and better reach.
            </p>
            <ul style={{ marginTop: 10, paddingLeft: 18, lineHeight: 1.7 }}>
              <li>Multiple podcast placements</li>
              <li>Social push campaign</li>
              <li>Creative support</li>
            </ul>
          </div>

          <div className="container-card">
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900 }}>
              Gold Sponsor
            </h3>
            <p className="subtle" style={{ marginTop: 8 }}>
              Best for brand dominance: network-wide bundle with premium placement.
            </p>
            <ul style={{ marginTop: 10, paddingLeft: 18, lineHeight: 1.7 }}>
              <li>Network bundle placement</li>
              <li>Priority social + video support</li>
              <li>Performance recap</li>
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="container-card" style={{ marginTop: 18 }}>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900 }}>
            Request a Sponsorship Package
          </h2>
          <p className="subtle" style={{ marginTop: 8, maxWidth: 860 }}>
            Tell us your budget range and goal (awareness, leads, event promo,
            recruiting, etc.). We’ll reply with a simple package and timeline.
          </p>

          <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a
              className="btn"
              href={mailto}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "10px 14px",
                borderRadius: 14,
                fontWeight: 800,
                border: "1px solid rgba(255,255,255,0.14)",
                background: "rgba(255,255,255,0.06)",
                textDecoration: "none",
              }}
            >
              Email Sponsorship
            </a>

            <Link
              className="btn"
              href="/advertise"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "10px 14px",
                borderRadius: 14,
                fontWeight: 800,
                border: "1px solid rgba(255,255,255,0.14)",
                background: "rgba(255,255,255,0.03)",
                textDecoration: "none",
              }}
            >
              Advertise With Us
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
