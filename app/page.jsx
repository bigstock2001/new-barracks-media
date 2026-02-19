"use client";

import WebsitePortfolioCarousel from "@/components/WebsitePortfolioCarousel";
import PodcastCarousel from "@/components/PodcastCarousel";

export default function HomePage() {
  return (
    <>
      {/* Web Design Portfolio Carousel (auto-advancing) */}
      <WebsitePortfolioCarousel variant="home" autoMs={4500} />

      {/* Web design authority block (under portfolio carousel) */}
      <section className="container-card section">
        <h2 className="h1">Professional Website Design That Builds Trust</h2>

        <p className="p" style={{ marginTop: 10, maxWidth: 950 }}>
          If you're looking for a <strong>professional website designer</strong>{" "}
          or <strong>small business website development</strong>, your website
          can’t just “look good.” It has to load fast, work on mobile, guide
          visitors to take action, and be built with a structure search engines
          can understand. Your website is your digital headquarters — and it’s
          often the first place a customer decides whether to trust you.
        </p>

        <p className="p" style={{ marginTop: 10, maxWidth: 950 }}>
          That’s why experience matters. A good build isn’t just design — it’s
          strategy: page structure, SEO fundamentals, performance, and clear
          messaging that turns visitors into leads. At Barracks Media Inc, we
          build <strong>custom websites</strong> that are designed to scale as
          your business grows.
        </p>

        <h3 className="h1" style={{ fontSize: 18, marginTop: 18 }}>
          Why templates can become a financial burden
        </h3>

        <p className="p" style={{ marginTop: 10, maxWidth: 950 }}>
          Templates can be a quick starting point, but many businesses outgrow
          them fast. Template sites often come with bloated code, limited SEO
          structure, and design constraints that force awkward workarounds. The
          hidden cost shows up later as slow performance, poor conversions, and
          rebuilds you didn’t plan for.
        </p>

        <p className="p" style={{ marginTop: 10, maxWidth: 950 }}>
          A custom build is an investment in stability: cleaner structure,
          stronger SEO, and a website that can evolve without breaking every
          time you add a new service, landing page, or content strategy.
        </p>

        <p className="p" style={{ marginTop: 12 }}>
          <a href="/services/web-design" className="btn">
            View Website Design Services
          </a>
        </p>
      </section>

      {/* Podcast carousel (network shows) */}
      <PodcastCarousel />

      {/* NEW: Podcast editing authority block (under podcast carousel) */}
      <section className="container-card section">
        <h2 className="h1">Podcast Editing That Sounds Expensive</h2>

        <p className="p" style={{ marginTop: 10, maxWidth: 950 }}>
          If you’re searching for <strong>podcast editing services</strong> or a{" "}
          <strong>podcast editor</strong>, you already know the problem:
          recording is the easy part — the edit is where time disappears. Great
          editing doesn’t just make audio “clean.” It keeps listeners engaged,
          improves retention, and makes your show sound credible from the first
          thirty seconds.
        </p>

        <p className="p" style={{ marginTop: 10, maxWidth: 950 }}>
          Barracks Media edits podcasts for creators and business owners who
          want professional quality without spending nights and weekends inside
          a timeline. We handle the details that most people don’t hear — but
          they absolutely feel.
        </p>

        <h3 className="h1" style={{ fontSize: 18, marginTop: 18 }}>
          What professional podcast editing includes
        </h3>

        <p className="p" style={{ marginTop: 10 }}>
          • Noise reduction, EQ, and compression for a clear, consistent voice{" "}
          <br />
          • Remove long pauses, mistakes, and “uh/um” clutter (without sounding
          robotic) <br />
          • Leveling so your guest and host don’t jump in volume <br />
          • Clean intros/outros, music placement, and smooth transitions <br />
          • Final mix and export in broadcast-ready formats
        </p>

        <h3 className="h1" style={{ fontSize: 18, marginTop: 18 }}>
          Why DIY editing can slow your growth
        </h3>

        <p className="p" style={{ marginTop: 10, maxWidth: 950 }}>
          DIY editing is usually “free” until you calculate the real cost: time,
          inconsistency, missed publishing deadlines, and episodes that don’t
          represent your brand. If your show supports a business, your audio is
          part of your reputation — and reputation is revenue.
        </p>

        <p className="p" style={{ marginTop: 12 }}>
          <a href="/services/podcast-editing" className="btn">
            View Podcast Editing Services
          </a>
        </p>

        {/* If you don't have /services/podcast-editing yet, change the link above to the correct page */}
      </section>

      {/* Main intro content */}
      <section className="container-card section">
        <h1 className="h1">Built clean. Built to scale.</h1>

        <p className="p" style={{ marginTop: 10, maxWidth: 900 }}>
          Barracks Media helps creators and veteran-led brands launch, grow, and
          monetize podcasts and digital media. We focus on clean production,
          consistent publishing, and systems that scale without chaos.
        </p>

        <p className="p" style={{ marginTop: 10, maxWidth: 900 }}>
          Whether you’re starting your first show or tightening an existing
          workflow, our podcast production, editing, and web design services are
          built to support long-term growth — not one-off episodes.
        </p>
      </section>

      {/* Supporting content block */}
      <section className="container-card section">
        <h2 className="h1" style={{ fontSize: 18 }}>
          What we do
        </h2>

        <p className="p" style={{ marginTop: 10 }}>
          • Podcast editing with clean, professional audio <br />
          • Podcast production systems for consistent releases <br />
          • Web design and landing pages built for SEO and conversion <br />
          • Network support for aligned creators
        </p>

        <p className="p" style={{ marginTop: 10 }}>
          Everything we build is designed to be repeatable, reliable, and easy
          to maintain — so you can focus on content instead of tech problems.
        </p>
      </section>
    </>
  );
}
