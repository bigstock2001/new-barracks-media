"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseBrowser";

export default function Navigation() {
  const router = useRouter();

  const [commandOpen, setCommandOpen] = useState(false);
  const [advertiseOpen, setAdvertiseOpen] = useState(false);

  // ✅ auth state
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

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

  // ✅ Load + track Supabase session
  useEffect(() => {
    let sub;

    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setSession(data?.session || null);
      } finally {
        setAuthLoading(false);
      }
    })();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession || null);
        setAuthLoading(false);
      }
    );

    sub = listener?.subscription;

    return () => {
      try {
        sub?.unsubscribe?.();
      } catch {}
    };
  }, []);

  async function handleLogout() {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      // no-op (we still redirect)
    } finally {
      setCommandOpen(false);
      setAdvertiseOpen(false);
      router.push("/");
      router.refresh();
    }
  }

  const isAuthed = !!session;

  // ✅ Inline styles that stop the dropdown getting trapped behind the glass
  const wrapStyle = { overflow: "visible" };
  const headerStyle = {
    position: "relative",
    zIndex: 9999,
    overflow: "visible",
  };
  const dropWrapStyle = { position: "relative", overflow: "visible" };
  const dropdownStyle = {
    position: "absolute",
    top: "calc(100% + 10px)",
    right: 0,
    zIndex: 999999, // this beats the glass stacking context
    overflow: "visible",
  };

  return (
    <header className="nav" role="banner" style={headerStyle}>
      <div className="nav-inner" style={wrapStyle}>
        <div className="container-card nav-bar" style={wrapStyle}>
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
          <nav className="navLinks" aria-label="Primary navigation" style={wrapStyle}>
            <Link className="tab" href="/network">
              Network
            </Link>

            <Link className="tab" href="/webinars">
              Live Webinar
            </Link>

            <Link className="tab" href="/services">
              Services
            </Link>

            {/* ✅ Bring Portfolio back */}
            <Link className="tab" href="/portfolio">
              Portfolio
            </Link>

            <Link className="tab" href="/blog">
              Blog
            </Link>

            <Link className="tab" href="/apply">
              Join Network
            </Link>

            {/* ✅ Portal always visible */}
            <Link className="tab" href="/portal">
              Portal
            </Link>

            {/* ✅ Auth controls */}
            {!authLoading && !isAuthed ? (
              <Link className="tab" href="/portal">
                Log In
              </Link>
            ) : null}

            {!authLoading && isAuthed ? (
              <>
                <Link className="tab" href="/portal">
                  Account
                </Link>

                <button
                  type="button"
                  className="tab"
                  onClick={handleLogout}
                  aria-label="Log out"
                >
                  Log Out
                </button>
              </>
            ) : null}

            {/* Advertise dropdown */}
            <div
              className="dropWrap"
              ref={advertiseRef}
              style={dropWrapStyle}
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
                <div className="dropdown" role="menu" style={dropdownStyle}>
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
              style={dropWrapStyle}
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
                <div className="dropdown" role="menu" style={dropdownStyle}>
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
