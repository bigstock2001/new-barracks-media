"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target)) setOpen(false);
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    window.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <header className="nav" role="banner">
      <div className="nav-inner">
        <div className="container-card nav-bar">
          {/* Brand / Logo badge */}
          <Link href="/" className="brand" aria-label="Barracks Media Home">
            <span className="logoImageWrap" aria-hidden="true">
              <Image
                src="/logo.jpg"
                alt=""
                width={36}
                height={36}
                priority
                style={{ borderRadius: 10, objectFit: "cover" }}
              />
            </span>

            <span className="brandText">
              <span className="brandTitle">BARRACKS MEDIA</span>
              <span className="brandSub">Built clean. Built to scale.</span>
            </span>
          </Link>

          {/* Primary links */}
          <nav className="navLinks" aria-label="Primary navigation">
            <Link className="tab" href="/services">
              Services
            </Link>

            <Link className="tab" href="/network">
              Network
            </Link>

            {/* Command dropdown */}
            <div className="dropWrap" ref={dropdownRef}>
              <button
                type="button"
                className="dropBtn"
                aria-expanded={open}
                aria-haspopup="menu"
                onClick={() => setOpen((v) => !v)}
              >
                Command {open ? "▴" : "▾"}
              </button>

              {open && (
                <div className="dropdown" role="menu">
                  <Link className="dropItem" href="/services" onClick={() => setOpen(false)}>
                    Start a Project
                  </Link>
                  <Link className="dropItem" href="/services" onClick={() => setOpen(false)}>
                    Web Design
                  </Link>
                  <Link className="dropItem" href="/services" onClick={() => setOpen(false)}>
                    Podcast Production
                  </Link>

                  <div className="divider" />

                  <Link className="dropItem" href="/privacy" onClick={() => setOpen(false)}>
                    Privacy Policy
                  </Link>
                  <Link className="dropItem" href="/terms" onClick={() => setOpen(false)}>
                    Terms
                  </Link>
                  <Link className="dropItem" href="/copyright" onClick={() => setOpen(false)}>
                    Copyright
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
