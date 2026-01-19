// app/apply/page.jsx

export const metadata = {
  title: "Apply to Join the Barracks Media Network",
  description:
    "Apply to join the Barracks Media Network — a professional, values-driven podcast ecosystem built for growth and credibility.",
};

const FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSfmKm2Pq0TmS1hV6tOc1wuLfZzEAPll9CwnVSABvi3UwANkTw/viewform?usp=header";

const EMBED_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSfmKm2Pq0TmS1hV6tOc1wuLfZzEAPll9CwnVSABvi3UwANkTw/viewform?embedded=true";

export default function ApplyPage() {
  return (
    <main className="relative overflow-hidden">
      {/* Background polish */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-neutral-950 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.06),transparent_55%)]" />
      </div>

      <div className="mx-auto w-full max-w-6xl px-5 py-16">
        {/* HERO */}
        <section className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur p-8 md:p-12">
          <span className="inline-block text-xs uppercase tracking-widest text-white/60">
            Barracks Media Network
          </span>

          <h1 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">
            Apply to Join the Network
          </h1>

          <p className="mt-5 text-lg text-white/80 max-w-3xl leading-relaxed">
            A curated podcast and media ecosystem built for creators who value
            integrity, purpose, and long-term growth — without giving up ownership
            or creative control.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <a
              href="#apply"
              className="rounded-xl bg-white text-black px-6 py-3 text-sm font-semibold hover:bg-white/90 transition"
            >
              Start Application
            </a>
            <a
              href="#terms"
              className="rounded-xl border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/5 transition"
            >
              View Terms
            </a>
          </div>
        </section>

        {/* VALUE BLOCK */}
        <section className="mt-20">
          <SectionTitle
            title="Why Creators Join Barracks Media"
            subtitle="This isn’t a directory. It’s infrastructure."
          />

          <div className="mt-10 grid md:grid-cols-2 gap-6">
            <Card
              title="Full Ownership. Always."
              text="You retain full ownership and intellectual property rights to your podcast. Barracks Media never claims ownership of your content."
            />
            <Card
              title="Professional, Values-Driven Network"
              text="We protect creators, audiences, and sponsors by enforcing standards around professionalism, integrity, and alignment."
            />
            <Card
              title="Growth Without Hype"
              text="No fake promises. We provide systems for discovery, analytics, and promotion that support long-term growth."
            />
            <Card
              title="Eligibility-Based Network Benefits"
              text="Cross-promotion, AI-powered discovery, website listings, social promotion, and sponsorship opportunities as your show grows."
            />
            <Card
              title="Simple Network Credit"
              text='A short spoken acknowledgment such as “Proud member of the Barracks Media Network” — no logos or forced branding.'
            />
            <Card
              title="Freedom to Exit"
              text="Leave at any time unless actively under a Barracks-arranged sponsorship. Clean exits. No lock-ins."
            />
          </div>
        </section>

        {/* WHO IT'S FOR */}
        <section className="mt-24 rounded-3xl border border-white/10 bg-white/[0.02] p-10">
          <SectionTitle
            title="Who This Network Is Built For"
            subtitle="Not everyone is a fit — by design."
          />

          <ul className="mt-8 grid md:grid-cols-2 gap-y-4 text-white/80">
            <li>• Podcasters releasing consistent, meaningful content</li>
            <li>• Creators who want growth without surrendering control</li>
            <li>• Shows built on credibility, education, or impact</li>
            <li>• Voices aligned with purpose, service, or storytelling</li>
          </ul>
        </section>

        {/* APPLY */}
        <section
          id="apply"
          className="mt-24 rounded-3xl border border-white/10 bg-white/[0.03] p-10"
        >
          <SectionTitle
            title="Submit Your Application"
            subtitle="Each show is reviewed individually."
          />

          <p className="mt-4 max-w-3xl text-white/80">
            Submitting an application does not guarantee acceptance. We evaluate
            quality, intent, alignment, and long-term fit within the network.
          </p>

          <div className="mt-8 overflow-hidden rounded-2xl border border-white/10">
            <iframe
              src={EMBED_URL}
              title="Barracks Media Network Application"
              width="100%"
              height="1650"
              frameBorder="0"
              loading="lazy"
            />
          </div>

          <div className="mt-4">
            <a
              href={FORM_URL}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-white/70 underline hover:text-white"
            >
              Open application in a new tab
            </a>
          </div>
        </section>

        {/* TERMS */}
        <section
          id="terms"
          className="mt-24 rounded-3xl border border-white/10 bg-black/40 p-10"
        >
          <SectionTitle
            title="Application Terms & Conditions"
            subtitle="Clear expectations protect everyone."
          />

          <div className="mt-8 space-y-6 text-white/80 leading-relaxed text-sm">
            {TERMS.map((t) => (
              <div key={t.n}>
                <h3 className="font-semibold text-white">
                  {t.n}. {t.title}
                </h3>
                <ul className="mt-2 space-y-1">
                  {t.body.map((b, i) => (
                    <li key={i}>• {b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="mt-24 text-center">
          <h2 className="text-3xl font-bold">
            Build Something That Lasts
          </h2>
          <p className="mt-3 text-white/80 max-w-2xl mx-auto">
            If your show values professionalism, integrity, and long-term growth,
            we’d be proud to review your application.
          </p>
          <a
            href="#apply"
            className="inline-block mt-6 rounded-xl bg-white text-black px-7 py-3 text-sm font-semibold hover:bg-white/90 transition"
          >
            Apply Now
          </a>
        </section>
      </div>
    </main>
  );
}

/* ---------- Components ---------- */

function SectionTitle({ title, subtitle }) {
  return (
    <>
      <h2 className="text-3xl font-bold">{title}</h2>
      <p className="mt-2 text-white/60">{subtitle}</p>
    </>
  );
}

function Card({ title, text }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 hover:bg-white/[0.06] transition">
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="mt-2 text-white/80 leading-relaxed">{text}</p>
    </div>
  );
}

/* ---------- Terms Data ---------- */

const TERMS = [
  {
    n: 1,
    title: "Professional Standards & Content Guidelines",
    body: [
      "No explicit sexual or pornographic content",
      "Content must align with network values",
      "Applications may be declined at Barracks Media’s discretion",
    ],
  },
  {
    n: 2,
    title: "Application & Acceptance",
    body: [
      "Submitting an application does not guarantee approval",
      "Each show is reviewed individually",
    ],
  },
  {
    n: 3,
    title: "Ownership & Rights",
    body: [
      "Creators retain full ownership and IP rights",
      "Barracks Media does not claim ownership of shows",
    ],
  },
  {
    n: 4,
    title: "Monetization & Sponsorships",
    body: [
      "No revenue or sponsorship guarantees",
      "Opportunities depend on performance and growth",
    ],
  },
  {
    n: 5,
    title: "Removal & Compliance",
    body: [
      "Shows may be removed for violations or misalignment",
      "Removal carries no financial obligation",
    ],
  },
  {
    n: 6,
    title: "Network Benefits",
    body: [
      "Cross-promotion, discovery tools, analytics, and listings",
      "Benefits are not guaranteed",
    ],
  },
  {
    n: 7,
    title: "Network Attribution",
    body: [
      "Simple verbal acknowledgment required",
      "No logos or visual branding required",
    ],
  },
  {
    n: 8,
    title: "Content Responsibility",
    body: [
      "Creators are solely responsible for their content",
    ],
  },
  {
    n: 9,
    title: "Distribution Rights (Non-Exclusive)",
    body: [
      "Barracks Media may feature and promote content",
      "Creators remain free to distribute elsewhere",
    ],
  },
  {
    n: 10,
    title: "Professional Conduct",
    body: [
      "Harassment, hate speech, or illegal activity may result in removal",
    ],
  },
  {
    n: 11,
    title: "Program Changes",
    body: [
      "Network policies may evolve over time",
    ],
  },
  {
    n: 12,
    title: "Active Participation",
    body: [
      "Shows must maintain an ongoing release schedule",
      "Dormant shows may be removed",
    ],
  },
  {
    n: 13,
    title: "RSS Feed Integration & Analytics",
    body: [
      "Shows transition to a Barracks-managed RSS feed",
      "No ownership transfer occurs",
      "Used solely for analytics, discovery, and monetization support",
    ],
  },
  {
    n: 14,
    title: "Voluntary Exit",
    body: [
      "Creators may exit at any time barring active sponsorship contracts",
      "All obligations must be fulfilled prior to exit",
    ],
  },
];
