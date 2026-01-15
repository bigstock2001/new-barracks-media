// app/advertise/page.jsx

import Link from "next/link";
import { getNetworkMetrics } from "@/lib/sanity";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Advertise With Us | Barracks Media",
  description:
    "Advertise across the Barracks Media network with rolling 30-day audience metrics, sponsor-ready placements, and campaign support.",
};

function formatCompactNumber(n) {
  if (typeof n !== "number" || Number.isNaN(n)) return "0";
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

function toNumber(v) {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : 0;
}

export default async function AdvertiseWithUsPage({ searchParams }) {
  // ✅ If you visit /advertise?debug=1 it will show debug info on the page
  const debugMode = searchParams?.debug === "1";

  let m = null;
  let fetchError = null;

  try {
    m = await getNetworkMetrics();
  } catch (e) {
    fetchError = e?.message || String(e);
    m = null;
  }

  // ✅ Normalize numbers (handles undefined / strings / null)
  const periodDays = toNumber(m?.periodDays) || 30;
  const downloads30d = toNumber(m?.podcastDownloads30d);
  const estReach30d = toNumber(m?.estimatedTotalReach30d);
  const lastUpdated = m?.lastUpdated ?? null;

  const mailto = `mailto:ddunn@veteranvoiceradio.com?subject=${encodeURIComponent(
    "Advertising Inquiry — Barracks Media"
  )}&body=${encodeURIComponent(
    "Hi Donald,\n\nI’m interested in advertising with Barracks Media.\n\nBusiness/Brand:\nBudget Range:\nStart Date:\nPreferred Placement (podcast / social / video / bundle):\nNotes:\n\nThanks!"
  )}`;

  const notFound = !m?._id;

  return (
    <main className="main">
      <div className="container" style={{ paddingTop: 28, paddingBottom: 40 }}>
        <h1 style={{ margin: 0, fontSize: 34, fontWeight: 900 }}>
          Advertise With Us
        </h1>
        <p className="subtle" style={{ marginTop: 10, maxWidth: 820 }}>
          Put your brand in front of a veteran-first audience across the Barracks
          Media network. We offer simple, sponsor-ready placements with clear
          reporting.
        </p>

        {/* ✅ Debug / Status (only shows when notFound OR debug=1) */}
        {(notFound || debugMode) && (
          <section
            className="container-card"
            style={{
              marginTop: 16,
              border: "1px solid rgba(255, 205, 0, 0.35)",
              background: "rgba(255, 205, 0, 0.06)",
            }}
          >
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 900 }}>
              Metrics Status
            </h3>

            {notFound ? (
              <p className="subtle" style={{ marginTop: 8, lineHeight: 1.6 }}>
                Your site is not finding a <strong>published</strong>{" "}
                <code>networkMetrics</code> document in the dataset your website
                is connected to.
                <br />
                <strong>Common causes:</strong> the document is still in draft,
                the site is pointed at a different dataset/project than Studio,
                or the read request is blocked by project CORS settings.
              </p>
            ) : (
              <p className="subtle" style={{ marginTop: 8 }}>
                ✅ Metrics document loaded.
              </p>
            )}

            {fetchError && (
              <p
                className="subtle"
                style={{
                  marginTop: 10,
                  whiteSpace: "pre-wrap",
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                  fontSize: 12,
                  opacity: 0.9,
                }}
              >
                Fetch error: {fetchError}
              </p>
            )}

            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 10,
              }}
            >
              <div
                style={{
                  borderRadius: 14,
                  padding: 12,
                  border: "1px solid rgba(255,255,255,0.10)",
                  background: "rgba(255,255,255,0.03)",
                  fontSize: 13,
                }}
              >
                <div style={{ opacity: 0.8 }}>Doc ID</div>
                <div style={{ marginTop: 6, fontWeight: 800 }}>
                  {m?._id || "—"}
                </div>
              </div>

              <div
                style={{
                  borderRadius: 14,
                  padding: 12,
                  border: "1px solid rgba(255,255,255,0.10)",
                  background: "rgba(255,255,255,0.03)",
                  fontSize: 13,
                }}
              >
                <div style={{ opacity: 0.8 }}>Raw Values</div>
                <div style={{ marginTop: 6, fontWeight: 800 }}>
                  downloads: {downloads30d} • reach: {estReach30d} • updated:{" "}
                  {formatDate(lastUpdated)}
                </div>
              </div>

              <div
                style={{
                  borderRadius: 14,
                  padding: 12,
                  border: "1px solid rgba(255,255,255,0.10)",
                  background: "rgba(255,255,255,0.03)",
                  fontSize: 13,
                }}
              >
                <div style={{ opacity: 0.8 }}>Quick Debug Link</div>
                <div style={{ marginTop: 6 }}>
                  <Link
                    href="/advertise?debug=1"
                    style={{ textDecoration: "underline" }}
                  >
                    Open Debug View
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Metrics */}
        <section className="container-card" style={{ marginTop: 22 }}>
          <div
            style={{
              display: "flex",
              gap: 14,
              alignItems: "baseline",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
            <div>
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900 }}>
                Rolling {periodDays}-Day Audience Snapshot
              </h2>
              <p className="subtle" style={{ marginTop: 6, maxWidth: 820 }}>
                These numbers are updated monthly and reflect rolling {periodDays}
                -day totals across the network.
              </p>
            </div>

            <div style={{ opacity: 0.8, fontSize: 13 }}>
              Updated: <strong>{formatDate(lastUpdated)}</strong>
            </div>
          </div>

          <div
            style={{
              marginTop: 16,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
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
                Estimated Network Reach (Rolling {periodDays} Days)
              </div>
              <div style={{ marginTop: 8, fontSize: 30, fontWeight: 900 }}>
                {formatCompactNumber(estReach30d)}+
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
              <div style={{ opacity: 0.8, fontSize: 13 }}>What you get</div>
              <ul style={{ marginTop: 10, paddingLeft: 18, lineHeight: 1.7 }}>
                <li>Simple placements</li>
                <li>Clear reporting</li>
                <li>Campaign support</li>
              </ul>
            </div>
          </div>

          <p className="subtle" style={{ marginTop: 14 }}>
            *Estimated reach is calculated from rolling {periodDays}-day podcast
            downloads plus rolling social reach, with optional video views if
            enabled.
          </p>
        </section>

        {/* Offer blocks */}
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
              Podcast Sponsorship
            </h3>
            <p className="subtle" style={{ marginTop: 8 }}>
              Host-read mentions, pre-roll and mid-roll placements, and
              sponsorship packages tailored by show or network-wide.
            </p>
          </div>

          <div className="container-card">
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900 }}>
              Social Promotions
            </h3>
            <p className="subtle" style={{ marginTop: 8 }}>
              Featured posts and short-form content pushes across our network’s
              pages with campaign tracking and reporting.
            </p>
          </div>

          <div className="container-card">
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900 }}>
              Bundles (Best Value)
            </h3>
            <p className="subtle" style={{ marginTop: 8 }}>
              Combine podcast + social + video placements for higher frequency
              and better results.
            </p>
          </div>
        </section>

        {/* CTAs */}
        <section className="container-card" style={{ marginTop: 18 }}>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900 }}>
            Get a Quote
          </h2>
          <p className="subtle" style={{ marginTop: 8, maxWidth: 860 }}>
            Tell us your goal, budget range, and start date — we’ll respond with
            a simple package and timeline.
          </p>

          <div
            style={{
              marginTop: 14,
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
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
              Email Us
            </a>

            <Link
              className="btn"
              href="/sponsorship"
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
              View Sponsorship Page
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
