"use client";

import WebsitePortfolioCarousel from "@/components/WebsitePortfolioCarousel";
import PodcastCarousel from "@/components/PodcastCarousel";

export default function HomePage() {
  return (
    <>
      {/* NEW: Web Design Portfolio Carousel (auto-advancing) */}
      <WebsitePortfolioCarousel variant="home" autoMs={4500} />

      {/* Existing podcast carousel */}
      <PodcastCarousel />

      {/* Main intro content (SEO-safe, visible, styled with your existing classes) */}
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

      {/* Supporting content block (prevents low-word-count penalty) */}
      <section className="container-card section">
        <h2 className="h1" style={{ fontSize: 18 }}>
          What we do
        </h2>

        <p className="p" style={{ marginTop: 10 }}>
          • Podcast editing with clean, professional audio  
          • Podcast production systems for consistent releases  
          • Web design and landing pages built for SEO and conversion  
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
