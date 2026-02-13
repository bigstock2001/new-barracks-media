"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(!!mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  return reduced;
}

export default function WebsitePortfolioCarousel({ autoMs = 4500 }) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  // ✅ ONLY website images from /public/websiteimages
  // Note: your filenames are *.jpg.png (using exactly what you showed)
  const slides = useMemo(
    () => [
      {
        src: "/websiteimages/barracksmediainc.jpg",
        title: "Barracks Media Inc",
        subtitle: "Built clean • built to scale",
        href: "/services/web-design",
      },
      {
        src: "/websiteimages/briellasteiner.jpg",
        title: "Client Website",
        subtitle: "Clean layout • clear CTA",
        href: "/portfolio",
      },
      {
        src: "/websiteimages/juliewebsite.jpg",
        title: "Client Website",
        subtitle: "Mobile-first • polished design",
        href: "/portfolio",
      },
      {
        src: "/websiteimages/vetforce1.jpg",
        title: "Vet-Force 1",
        subtitle: "Brand hub • built to scale",
        href: "/portfolio",
      },
    ],
    []
  );

  const total = slides.length;

  useEffect(() => {
    if (prefersReducedMotion || paused) return;

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setIndex((cur) => (cur + 1) % total);
    }, autoMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [autoMs, paused, prefersReducedMotion, total]);

  const s = slides[index];

  const go = (dir) => setIndex((cur) => (cur + dir + total) % total);

  return (
    <section className="container-card section">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="h1" style={{ fontSize: 22 }}>
            Web Design Portfolio
          </h2>
          <p className="p" style={{ marginTop: 6 }}>
            Real website builds. Auto-rotating — click to view.
          </p>
        </div>

        <Link className="tab" href="/portfolio">
          View All →
        </Link>
      </div>

      {/* Card */}
      <div
        className="container-card"
        style={{
          marginTop: 14,
          position: "relative",
          overflow: "hidden",
          borderRadius: 18,
          padding: 0,
        }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Fixed-height frame so it doesn't explode your layout */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: 300,
            background: "rgba(0,0,0,0.35)",
          }}
        >
          <Link
            href={s.href}
            aria-label={`Open ${s.title}`}
            style={{ position: "absolute", inset: 0, zIndex: 5 }}
          />

          {/* ✅ IMPORTANT: object-contain so the image fits inside the card */}
          <Image
            src={s.src}
            alt={s.title}
            fill
            sizes="(max-width: 1200px) 100vw, 1200px"
            style={{ objectFit: "contain" }}
            priority
          />

          {/* Caption */}
          <div
            style={{
              position: "absolute",
              left: 16,
              right: 16,
              bottom: 14,
              zIndex: 6,
              background: "rgba(0,0,0,0.55)",
              borderRadius: 14,
              padding: "10px 12px",
            }}
          >
            <div style={{ fontWeight: 800 }}>{s.title}</div>
            <div style={{ opacity: 0.9, marginTop: 2, fontSize: 13 }}>
              {s.subtitle}
            </div>
          </div>

          {/* Arrows */}
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous website"
            style={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 7,
              borderRadius: 999,
              padding: "6px 10px",
              border: "1px solid rgba(255,255,255,0.25)",
              background: "rgba(0,0,0,0.45)",
              color: "white",
              cursor: "pointer",
            }}
          >
            ←
          </button>

          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next website"
            style={{
              position: "absolute",
              right: 10,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 7,
              borderRadius: 999,
              padding: "6px 10px",
              border: "1px solid rgba(255,255,255,0.25)",
              background: "rgba(0,0,0,0.45)",
              color: "white",
              cursor: "pointer",
            }}
          >
            →
          </button>
        </div>

        {/* Dots */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 8,
            padding: "10px 0 14px",
          }}
        >
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              aria-label={`Go to website ${idx + 1}`}
              onClick={() => setIndex(idx)}
              style={{
                width: 10,
                height: 10,
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.35)",
                background: idx === index ? "white" : "rgba(255,255,255,0.25)",
                cursor: "pointer",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
