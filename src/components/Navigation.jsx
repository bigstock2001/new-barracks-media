"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const links = [
  { label: "Services", href: "/services" },
  { label: "Network", href: "/network" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("mousedown", onClick);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onClick);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <header
      className={`bmNav ${scrolled ? "bmNavScrolled" : ""}`}
      role="banner"
    >
      <div className="bmNavGlow" aria-hidden="true" />

      <div className="bmNavInner" ref={menuRef}>
        {/* Left: brand */}
        <Link href="/" className="bmBrand" aria-label="Barracks Media Home">
          <span className="bmLogoWrap" aria-hidden="true">
            <Image
              src="/logo.jpg"
              alt=""
              width={44}
              height={44}
              priority
              className="bmLogo"
            />
          </span>

          <span className="bmBrandText">
            <span className="bmBrandName">Barracks Media</span>
            <span className="bmBrandTag">Built clean. Built to scale.</span>
          </span>
        </Link>

        {/* Center: links (desktop) */}
        <nav className="bmNavLinks" aria-label="Primary navigation">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="bmLink">
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Right: CTA + mobile toggle */}
        <div className="bmNavRight">
          <Link href="/services" className="bmCta">
            Start a Project
          </Link>

          <button
            type="button"
            className="bmMenuBtn"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className={`bmBars ${open ? "bmBarsOpen" : ""}`} />
          </button>
        </div>

        {/* Mobile menu */}
        <div className={`bmMobile ${open ? "bmMobileOpen" : ""}`}>
          <div className="bmMobileCard">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="bmMobileLink"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}

            <Link
              href="/services"
              className="bmMobileCta"
              onClick={() => setOpen(false)}
            >
              Start a Project
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
