"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// Use whichever logo file you actually have in /public (logo.jpg or logo.png)
const LOGO_SRC = "/logo.jpg";

const PODCASTS = [
  { label: "Finding The Why", slug: "finding-the-why" },
  { label: "Creators at Work", slug: "creators-at-work" },
  { label: "The Healing Side", slug: "the-healing-side" },
  { label: "Built from Scratch", slug: "built-from-scratch" },
  { label: "After the Uniform", slug: "after-the-uniform" },
  { label: "History Told Forward", slug: "history-told-forward" },
  { label: "Driven: Stories from the Automotive World", slug: "driven-automotive-world" },
  { label: "The Real Leadership Brief", slug: "the-real-leadership-brief" },
  { label: "Authors After Action", slug: "authors-after-action" },
  { label: "Mystery’s at the Windham Inn", slug: "mysterys-at-the-windham-inn" },
  { label: "The Veterans Spiritual Task Force", slug: "the-veterans-spiritual-task-force" },
  { label: "Spirits and Stories With Donald Dunn", slug: "spirits-and-stories-with-donald-dunn" },
];

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    };
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <header className="nav">
      <div className="nav-inner">
        <div className="container-card nav-bar">
          <Link href="/" className="brand" aria-label="Barracks Media Home">
            <span className="logoImageWrap" aria-hidden="true">
              <img
                src={LOGO_SRC}
                alt="Barracks Media Logo"
                style={{ height: 52, width: "auto", display: "block" }}
              />
            </span>

            <span className="brandText">
              <span className="brandTitle">BARRACKS MEDIA</span>
              <span className="brandSub">Independent Media Network</span>
            </span>
          </Link>

          <nav className="navLinks" aria-label="Main navigation">
            <Link className="tab" href="/services">
              Services
            </Link>

            <Link className="tab" href="/review-network">
              Review Network
            </Link>

            <div className="dropWrap" ref={ref}>
              <button
                type="button"
                className="dropBtn"
                aria-haspopup="menu"
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
              >
                Network ▾
              </button>

              {open && (
                <div className="dropdown" role="menu" aria-label="Podcast menu">
                  <Link
                    className="dropItem"
                    href="/network"
                    onClick={() => setOpen(false)}
                  >
                    Network Home
                  </Link>

                  <div className="divider" />

                  {PODCASTS.map((p) => (
                    <Link
                      key={p.slug}
                      className="dropItem"
                      href={`/network/${p.slug}`}
                      onClick={() => setOpen(false)}
                    >
                      {p.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>

      <div className="hero-strip container-card">
        <h1 className="h1">Barracks Media</h1>
        <p className="p">
          Services, production, and a growing independent podcast network.
        </p>
      </div>
    </header>
  );
}
