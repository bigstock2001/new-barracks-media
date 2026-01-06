"use client";

import Link from "next/link";
import { useMemo, useRef } from "react";

const PODCASTS = [
  { title: "Finding The Why", slug: "finding-the-why", image: "/podcasts/finding-the-why.jpg" },
  { title: "Creators at Work", slug: "creators-at-work", image: "/podcasts/creators-at-work.jpg" },
  { title: "The Healing Side", slug: "the-healing-side", image: "/podcasts/the-healing-side.jpg" },
  { title: "Built from Scratch", slug: "built-from-scratch", image: "/podcasts/built-from-scratch.jpg" },
  { title: "After the Uniform", slug: "after-the-uniform", image: "/podcasts/after-the-uniform.jpg" },
  { title: "History Told Forward", slug: "history-told-forward", image: "/podcasts/history-told-forward.jpg" },
  { title: "Driven: Stories from the Automotive World", slug: "driven-automotive-world", image: "/podcasts/driven-automotive-world.jpg" },
  { title: "The Real Leadership Brief", slug: "the-real-leadership-brief", image: "/podcasts/the-real-leadership-brief.jpg" },
  { title: "Authors After Action", slug: "authors-after-action", image: "/podcasts/authors-after-action.jpg" },
  { title: "Mystery’s at the Windham Inn", slug: "mysterys-at-the-windham-inn", image: "/podcasts/mysterys-at-the-windham-inn.jpg" },
  { title: "The Veterans Spiritual Task Force", slug: "the-veterans-spiritual-task-force", image: "/podcasts/the-veterans-spiritual-task-force.jpg" },
  { title: "Spirits and Stories With Donald Dunn", slug: "spirits-and-stories-with-donald-dunn", image: "/podcasts/spirits-and-stories-with-donald-dunn.jpg" },
];

export default function PodcastCarousel() {
  const scrollerRef = useRef(null);

  const items = useMemo(() => PODCASTS, []);

  const scrollByCards = (dir) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector("[data-card='podcast']");
    const w = card ? card.getBoundingClientRect().width : 260;
    el.scrollBy({ left: dir * (w + 16) * 2, behavior: "smooth" });
  };

  return (
    <section className="container-card section">
      <div className="carouselHeader">
        <div>
          <h2 className="h1" style={{ fontSize: 18 }}>
            Podcast Network
          </h2>
          <p className="p" style={{ marginTop: 8 }}>
            Browse the network. Click a show to open its page.
          </p>
        </div>

        <div className="carouselActions" aria-label="Carousel controls">
          <button
            type="button"
            className="carouselBtn"
            onClick={() => scrollByCards(-1)}
            aria-label="Scroll left"
          >
            ‹
          </button>
          <button
            type="button"
            className="carouselBtn"
            onClick={() => scrollByCards(1)}
            aria-label="Scroll right"
          >
            ›
          </button>
        </div>
      </div>

      <div ref={scrollerRef} className="carouselTrack" aria-label="Podcast carousel">
        {items.map((p) => (
          <Link
            key={p.slug}
            href={`/network/${p.slug}`}
            className="podCard"
            data-card="podcast"
            aria-label={`Open ${p.title}`}
          >
            <div className="podCoverWrap">
              <img
                src={p.image}
                alt={`${p.title} cover`}
                className="podCover"
                loading="lazy"
                onError={(e) => {
                  // If an image is missing, show a clean fallback
                  e.currentTarget.style.display = "none";
                  e.currentTarget.parentElement.setAttribute("data-missing", "true");
                }}
              />
              <div className="podCoverFallback">
                <div className="podFallbackTitle">{p.title}</div>
                <div className="podFallbackSmall">Cover image missing</div>
              </div>
            </div>

            <div className="podMeta">
              <div className="podTitle">{p.title}</div>
              <div className="podCta">View show ›</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
