"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function Navigation() {
  const [commandOpen, setCommandOpen] = useState(false);
  const [advertiseOpen, setAdvertiseOpen] = useState(false);

  const commandRef = useRef(null);
  const advertiseRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (commandRef.current && !commandRef.current.contains(e.target)) {
        setCommandOpen(false);
      }
      if (advertiseRef.current && !advertiseRef.current.contains(e.target)) {
        setAdvertiseOpen(false);
      }
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setCommandOpen(false);
        setAdvertiseOpen(false);
      }
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
          {/* Brand / Logo */}
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

          {/* Links */}
          <nav className="navLinks" aria-label="Primary navigation">
            <Link className="tab" href="/network">
              Network
            </Link>

            <Link className="tab" href="/services">
              Services
            </Link>

            {/* NEW: Join Network */}
            <Link className="tab" href="/apply">
              Join Network
            </Link>

            {/* Advertise dropdown */}
            <div
              className="dropWrap"
              ref={advertiseRef}
              onMouseEnter={() => setAdvertiseOpen(true)}
              onMouseLeave={() => setAdvertiseOpen(false)}
            >
              <button
                type="button"
                className="dropBtn"
                aria-expanded={advertiseOpen}
                aria-haspopup="menu"
                onClick={() => {
                  setAdvertiseOpen((v) => !v);
                  setCommandOpen(false);
                }}
              >
                Advertise {advertiseOpen ? "▴" : "▾"}
              </button>

              {advertiseOpen && (
                <div className="dropdown" role="menu">
                  <Link
                    className="dropItem"
                    href="/advertise"
                    onClick={() => setAdvertiseOpen(false)}
                  >
                    Advertise With Us
                  </Link>

                  <Link
                    className="dropItem"
                    href="/sponsorship"
                    onClick={() => setAdvertiseOpen(false)}
                  >
                    Sponsorship
                  </Link>

                  <Link
                    className="dropItem"
                    href="/testimonials"
                    onClick={() => setAdvertiseOpen(false)}
                  >
                    Testimonials
                  </Link>
                </div>
              )}
            </div>

            {/* Command dropdown */}
            <div
              className="dropWrap"
              ref={commandRef}
              onMouseEnter={() => setCommandOpen(true)}
              onMouseLeave={() => setCommandOpen(false)}
            >
              <button
                type="button"
                className="dropBtn"
                aria-expanded={commandOpen}
                aria-haspopup="menu"
                onClick={() => {
                  setCommandOpen((v) => !v);
                  setAdvertiseOpen(false);
                }}
              >
                Command {commandOpen ? "▴" : "▾"}
              </button>

              {commandOpen && (
                <div className="dropdown" role="menu">
                  <Link
                    className="dropItem"
                    href="/services"
                    onClick={() => setCommandOpen(false)}
                  >
                    Start a Project
                  </Link>

                  <div className="divider" />

                  <Link
                    className="dropItem"
                    href="/privacy"
                    onClick={() => setCommandOpen(false)}
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    className="dropItem"
                    href="/terms"
                    onClick={() => setCommandOpen(false)}
                  >
                    Terms
                  </Link>
                  <Link
                    className="dropItem"
                    href="/copyright"
                    onClick={() => setCommandOpen(false)}
                  >
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
