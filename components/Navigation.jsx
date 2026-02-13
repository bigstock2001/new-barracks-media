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
    // KEY: overflow-visible + high z-index so dropdown can sit over the glass
    <header className="relative z-[1000] overflow-visible">
      {/* If you have a glass card wrapper, KEEP it but don't let it clip */}
      <div className="mx-auto w-full max-w-6xl px-4 pt-6 overflow-visible">
        <div className="relative overflow-visible rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md shadow-lg">
          <div className="flex items-center justify-between px-5 py-4 overflow-visible">
            {/* Left: logo + brand */}
            <Link href="/" className="flex items-center gap-3">
              <div className="h-10 w-10 overflow-hidden rounded-xl border border-white/15 bg-black/30">
                <Image
                  src="/logo.png"
                  alt="Barracks Media"
                  width={80}
                  height={80}
                  className="h-full w-full object-cover"
                  priority
                />
              </div>
              <div className="leading-tight">
                <div className="text-sm font-semibold tracking-wide text-white">
                  BARRACKS MEDIA
                </div>
                <div className="text-xs text-white/80">
                  Built clean. Built to scale.
                </div>
              </div>
            </Link>

            {/* Right: links + dropdowns */}
            <nav className="flex items-center gap-3 overflow-visible">
              <Link
                href="/services"
                className="rounded-xl px-3 py-2 text-sm text-white/90 hover:bg-white/10"
              >
                Services
              </Link>

              {/* Bring Portfolio back into the nav */}
              <Link
                href="/portfolio"
                className="rounded-xl px-3 py-2 text-sm text-white/90 hover:bg-white/10"
              >
                Portfolio
              </Link>

              {/* Command dropdown */}
              <div ref={commandRef} className="relative overflow-visible">
                <button
                  onClick={() => {
                    setCommandOpen((v) => !v);
                    setAdvertiseOpen(false);
                  }}
                  className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15"
                  aria-expanded={commandOpen}
                  aria-haspopup="menu"
                >
                  Command <span className="ml-1">▾</span>
                </button>

                {commandOpen && (
                  // KEY: z-[9999] + absolute so it renders on top of the glass
                  <div
                    className="absolute right-0 mt-2 w-64 overflow-hidden rounded-2xl border border-white/15 bg-black/80 backdrop-blur-xl shadow-2xl z-[9999]"
                    role="menu"
                  >
                    <Link
                      href="/apply"
                      className="block px-4 py-3 text-sm text-white/90 hover:bg-white/10"
                      role="menuitem"
                      onClick={() => setCommandOpen(false)}
                    >
                      Apply to the Network
                    </Link>
                    <Link
                      href="/contact"
                      className="block px-4 py-3 text-sm text-white/90 hover:bg-white/10"
                      role="menuitem"
                      onClick={() => setCommandOpen(false)}
                    >
                      Contact
                    </Link>
                    <Link
                      href="/services/web-design"
                      className="block px-4 py-3 text-sm text-white/90 hover:bg-white/10"
                      role="menuitem"
                      onClick={() => setCommandOpen(false)}
                    >
                      Web Design
                    </Link>
                  </div>
                )}
              </div>

              {/* Optional: second dropdown example (kept from your structure) */}
              <div ref={advertiseRef} className="relative overflow-visible">
                <button
                  onClick={() => {
                    setAdvertiseOpen((v) => !v);
                    setCommandOpen(false);
                  }}
                  className="rounded-xl px-3 py-2 text-sm text-white/90 hover:bg-white/10"
                  aria-expanded={advertiseOpen}
                  aria-haspopup="menu"
                >
                  Advertise <span className="ml-1">▾</span>
                </button>

                {advertiseOpen && (
                  <div
                    className="absolute right-0 mt-2 w-72 overflow-hidden rounded-2xl border border-white/15 bg-black/80 backdrop-blur-xl shadow-2xl z-[9999]"
                    role="menu"
                  >
                    <Link
                      href="/advertise"
                      className="block px-4 py-3 text-sm text-white/90 hover:bg-white/10"
                      role="menuitem"
                      onClick={() => setAdvertiseOpen(false)}
                    >
                      Sponsorships & Ads
                    </Link>
                    <Link
                      href="/services"
                      className="block px-4 py-3 text-sm text-white/90 hover:bg-white/10"
                      role="menuitem"
                      onClick={() => setAdvertiseOpen(false)}
                    >
                      Services Overview
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
