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

export default function WebsitePortfolioCarousel({
  variant = "home", // "home" | "page"
  autoMs = 4500,
}) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  // ✅ Your images in /public/websiteimages (use EXACT filenames)
  const slides = useMemo(
    () => [
      {
        src: "/websiteimages/barracksmediainc.jpg.png",
        title: "Barracks Media Inc",
        subtitle: "Modern site build • fast + clean UX",
        href: "/services/web-design",
      },
      {
        src: "/websiteimages/brieillasteiner.jpg.png",
        title: "Client Website",
        subtitle: "Conversion-focused layout • clear CTA",
        href: "/portfolio",
      },
      {
        src: "/websiteimages/juliewebsite.jpg.png",
        title: "Client Website",
        subtitle: "Mobile-first • polished design",
        href: "/portfolio",
      },
      {
        src: "/websiteimages/vetforce1.jpg.png",
        title: "Vet-Force 1",
        subtitle: "Brand + content hub • built to scale",
        href: "/portfolio",
      },
    ],
    []
  );

  const total = slides.length;

  const go = (next) => {
    setI((cur) => {
      const n = (cur + next + total) % total;
      return n;
    });
  };

  useEffect(() => {
    if (prefersReducedMotion) return;
    if (paused) return;

    // clear any old interval
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setI((cur) => (cur + 1) % total);
    }, autoMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [autoMs, paused, prefersReducedMotion, total]);

  const s = slides[i];

  // Slightly different sizing for homepage vs portfolio page
  const heightClass =
    variant === "page"
      ? "h-[260px] sm:h-[360px] lg:h-[420px]"
      : "h-[200px] sm:h-[260px] lg:h-[300px]";

  return (
    <section
      className={variant === "page" ? "w-full" : "mx-auto w-full max-w-6xl px-5 pt-10"}
    >
      {variant === "home" ? (
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Web Design Portfolio</h2>
            <p className="mt-2 text-sm text-white/80">
              Real builds. Real results. Click through to see more.
            </p>
          </div>

          <div className="hidden sm:flex gap-2">
            <Link
              href="/portfolio"
              className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/15"
            >
              View All →
            </Link>
          </div>
        </div>
      ) : (
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-white">Web Design Portfolio</h1>
          <p className="mt-2 text-white/80 max-w-2xl">
            A quick carousel of recent builds. More case studies coming soon.
          </p>
        </div>
      )}

      <div
        className="relative mt-5"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Frame */}
        <div className={`relative w-full overflow-hidden rounded-3xl border border-white/15 bg-black/30 backdrop-blur-md shadow-2xl ${heightClass}`}>
          <Link href={s.href} className="absolute inset-0" aria-label={`Open ${s.title}`} />

          <Image
            src={s.src}
            alt={s.title}
            fill
            priority={variant === "home"}
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 1024px"
          />

          {/* dark gradient for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Caption */}
          <div className="absolute left-5 right-5 bottom-5">
            <div className="flex items-end justify-between gap-4">
              <div>
                <div className="text-lg sm:text-xl font-bold text-white">{s.title}</div>
                <div className="mt-1 text-sm text-white/80">{s.subtitle}</div>
              </div>

              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href={s.href}
                  className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm font-semibold text-white hover:bg-white/15"
                >
                  View →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Arrows */}
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous"
          className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/40 px-3 py-2 text-white hover:bg-black/55"
        >
          ←
        </button>

        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/40 px-3 py-2 text-white hover:bg-black/55"
        >
          →
        </button>

        {/* Dots */}
        <div className="mt-4 flex justify-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              aria-label={`Go to slide ${idx + 1}`}
              onClick={() => setI(idx)}
              className={`h-2.5 w-2.5 rounded-full border border-white/30 ${
                idx === i ? "bg-white" : "bg-white/20 hover:bg-white/35"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
