// app/podcast-editing-for-coaches/page.jsx
import Script from "next/script";

export const metadata = {
  title: "Podcast Editing for Coaches & Consultants | Barracks Media",
  description:
    "Professional podcast editing for coaches and consultants. Audio-only or video + audio, three-business-day turnaround, and monthly plans.",
  alternates: { canonical: "/podcast-editing-for-coaches" },
};

export default function PodcastEditingForCoachesPage() {
  return (
    <div className="stack">
      <section className="container-card section">
        <h1 className="h1">Podcast Editing for Coaches &amp; Consultants</h1>

        <p className="p" style={{ marginTop: 10, maxWidth: 900 }}>
          Clean, brand-ready episodes delivered on time. If you’re coaching and
          using your podcast to build authority, you can’t afford sloppy audio,
          inconsistent video, or missed deadlines.
        </p>

        <div className="grid" style={{ marginTop: 18 }}>
          <div className="card">
            <h2 className="h2">What’s Included</h2>
            <ul className="muted" style={{ marginTop: 10, lineHeight: 1.7 }}>
              <li>Noise reduction + audio cleanup</li>
              <li>Volume leveling + mastering</li>
              <li>EQ + compression for a professional sound</li>
              <li>Intro/outro placement (and consistent formatting)</li>
              <li>Platform-ready exports</li>
            </ul>
          </div>

          <div className="card">
            <h2 className="h2">Turnaround</h2>
            <p className="muted" style={{ marginTop: 10, lineHeight: 1.7 }}>
              <strong>Standard:</strong> 3 business days per episode.
              <br />
              <strong>Monthly clients:</strong> priority scheduling.
            </p>
          </div>

          <div className="card">
            <h2 className="h2">Pricing</h2>

            <div style={{ marginTop: 10 }}>
              <p className="muted" style={{ margin: 0 }}>
                <strong>Audio Only</strong>
              </p>
              <p className="muted" style={{ marginTop: 6, lineHeight: 1.7 }}>
                $125 per episode <br />
                $400/month (up to 4 episodes)
              </p>
            </div>

            <div style={{ marginTop: 14 }}>
              <p className="muted" style={{ margin: 0 }}>
                <strong>Video + Audio</strong>
              </p>
              <p className="muted" style={{ marginTop: 6, lineHeight: 1.7 }}>
                $175 per episode <br />
                $500/month (up to 4 episodes)
              </p>
            </div>

            <p className="muted" style={{ marginTop: 14, lineHeight: 1.6 }}>
              Need a custom plan (two episodes/week, shorts, or multi-cam)?
              Book a call and we’ll map it out.
            </p>
          </div>
        </div>
      </section>

      <section className="container-card section">
        <h2 className="h2">Book a Project Call</h2>
        <p className="muted" style={{ marginTop: 8, maxWidth: 900 }}>
          Pick a time that works for you. We’ll confirm your workflow, episode
          length, and monthly cadence—then I’ll tell you exactly what it’ll take.
        </p>

        {/* Calendly inline embed */}
        <link
          rel="stylesheet"
          href="https://assets.calendly.com/assets/external/widget.css"
        />
        <Script
          src="https://assets.calendly.com/assets/external/widget.js"
          strategy="lazyOnload"
        />

        <div
          className="card"
          style={{ marginTop: 14, padding: 0, overflow: "hidden" }}
        >
          <div
            className="calendly-inline-widget"
            data-url="https://calendly.com/donalddunn/project-planning?hide_gdpr_banner=1"
            style={{ minWidth: "320px", height: "900px" }}
          />
        </div>
      </section>
    </div>
  );
}