"use client";

import Image from "next/image";
import { useMemo, useRef } from "react";

export default function PodcastCarousel() {
  const trackRef = useRef(null);

  const items = useMemo(
    () => [
      {
        title: "After the Uniform",
        image: "/podcasts/after-the-uniform.jpg",
        href: "/network",
      },
      {
        title: "Authors After Action",
        image: "/podcasts/authors-after-action.jpg",
        href: "/network",
      },
      {
        title: "Built From Scratch",
        image: "/podcasts/built-from-scratch.jpg",
        href: "/network",
      },
      {
        title: "Creators at Work",
        image: "/podcasts/creators-at-work.jpg",
        href: "/network",
      },
      {
        title: "Driven: Automotive World",
        image: "/podcasts/driven-automotive-world.jpg",
        href: "/network",
      },
      {
        title: "Finding the Why",
        image: "/podcasts/finding-the-why.jpg",
        href: "/network",
      },
      {
        title: "History Told Forward",
        image: "/podcasts/history-told-forward.jpg",
        href: "/network",
      },
      {
        title: "Mystery at the Windham Inn",
        image: "/podcasts/mystery-at-the-windham-inn.jpg",
        href: "/network",
      },
      {
        title: "Spirits and Stories",
        image: "/podcasts/spirits-and-stories-with-donald-dunn.jpg",
        href: "/network",
      },
      {
        title: "The Healing Side",
        image: "/podcasts/the-healing-side.jpg",
        href: "/network",
      },
      {
        title: "The Real Leadership Brief",
        image: "/podcasts/the-real-leadership-brief.jpg",
        href: "/network",
      },
      {
        title: "Veteran Spiritual Task Force",
        image: "/podcasts/the-veterans-spiritual-task-force.jpg",
        href: "/network",
      },
    ],
    []
  );

  function scrollByCards(dir = 1) {
    const el = trackRef.current;
    if (!el) return;
    // scroll by ~1.5 cards
    const card = el.querySelector("[data-card='1']");
    const amount = card ? card.getBoundingClientRect().width * 1.5 : 420;
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  }

  return (
    <section className="section">
      <div className="container-card">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <h2 className="h2">Shows & Podcasts</h2>

          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btnGhost" type="button" onClick={() => scrollByCards(-1)}>
              ‹
            </button>
            <button className="btn btnGhost" type="button" onClick={() => scrollByCards(1)}>
              ›
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          style={{
            marginTop: 14,
            display: "flex",
            gap: 14,
            overflowX: "auto",
            paddingBottom: 6,
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {items.map((item, idx) => (
            <a
              key={item.image + idx}
              href={item.href}
              data-card="1"
              style={{
                flex: "0 0 auto",
                width: 240,
                scrollSnapAlign: "start",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <div
                style={{
                  borderRadius: 16,
                  overflow: "hidden",
                  border: "1px solid rgba(0,0,0,0.08)",
                  background: "rgba(255,255,255,0.6)",
                }}
              >
                <div style={{ position: "relative", width: "100%", height: 320 }}>
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="240px"
                    style={{ objectFit: "cover" }}
                    priority={idx < 4}
                  />
                </div>

                <div style={{ padding: 12 }}>
                  <div style={{ fontWeight: 800, lineHeight: 1.2 }}>{item.title}</div>
                  <div style={{ opacity: 0.75, marginTop: 6, fontSize: 13 }}>
                    Tap to view
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        <div style={{ opacity: 0.65, fontSize: 12, marginTop: 10 }}>
          Tip: scroll sideways or use the arrows.
        </div>
      </div>
    </section>
  );
}
