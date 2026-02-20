"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Script from "next/script";
import { useSearchParams } from "next/navigation";

/**
 * Reusable booking page template for show landing pages.
 *
 * Usage:
 * <BookingTemplate
 *   showName="Built From Scratch"
 *   showTagline="Real conversations about building businesses..."
 *   calendlyBaseUrl="https://calendly.com/donalddunn/built-from-scratch"
 * />
 */

const SUBSTACK_EMBED_URL = "https://zlpceut.substack.com/embed";
const LS_KEY_SUPPRESS_POPUP = "bm_substack_popup_suppress_v1";

function buildUrlWithQuery(baseUrl, queryObj) {
  try {
    const url = new URL(baseUrl);
    Object.entries(queryObj || {}).forEach(([k, v]) => {
      if (!v) return;
      const str = String(v).trim();
      if (!str) return;
      url.searchParams.set(k, str);
    });
    return url.toString();
  } catch {
    return baseUrl;
  }
}

function BookingTemplateInner({ showName, showTagline, calendlyBaseUrl }) {
  const params = useSearchParams();
  const [showPopup, setShowPopup] = useState(false);
  const [popupArmed, setPopupArmed] = useState(false);

  const utm = useMemo(() => {
    const get = (k) => params.get(k) || "";
    return {
      utm_source: get("utm_source"),
      utm_medium: get("utm_medium"),
      utm_campaign: get("utm_campaign"),
      utm_content: get("utm_content"),
      utm_term: get("utm_term"),
      ref: get("ref"),
    };
  }, [params]);

  const calendlyUrl = useMemo(() => {
    return buildUrlWithQuery(calendlyBaseUrl, utm);
  }, [calendlyBaseUrl, utm]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const suppressed =
      window.localStorage.getItem(LS_KEY_SUPPRESS_POPUP) === "1";
    if (suppressed) return;

    const t = window.setTimeout(() => setPopupArmed(true), 1200);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!popupArmed) return;

    const suppressed =
      window.localStorage.getItem(LS_KEY_SUPPRESS_POPUP) === "1";
    if (suppressed) return;

    // Fallback timer (18s)
    const timer = window.setTimeout(() => {
      setShowPopup(true);
    }, 18000);

    // Scroll trigger (45%)
    const onScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      const maxScroll = Math.max(1, docHeight - winHeight);
      const pct = scrollTop / maxScroll;

      if (pct >= 0.45) {
        setShowPopup(true);
        window.removeEventListener("scroll", onScroll);
      }
    };

    // Exit intent
    const onMouseOut = (e) => {
      if (e.clientY <= 0) {
        setShowPopup(true);
        window.removeEventListener("mouseout", onMouseOut);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mouseout", onMouseOut);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mouseout", onMouseOut);
    };
  }, [popupArmed]);

  const dismissPopup = (suppress = false) => {
    setShowPopup(false);
    if (suppress) {
      window.localStorage.setItem(LS_KEY_SUPPRESS_POPUP, "1");
    }
  };

  return (
    <main className="min-h-screen">
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="afterInteractive"
      />

      <div className="mx-auto max-w-5xl px-5 py-12 space-y-10">
        {/* Hero */}
        <section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-8">
          <h1 className="text-3xl md:text-4xl font-semibold">
            Book a guest spot on {showName}
          </h1>
          <p className="mt-4 text-lg opacity-90 max-w-3xl">{showTagline}</p>
        </section>

        {/* Substack Embed ABOVE Calendly */}
        <section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-8">
          <h2 className="text-2xl font-semibold">Get Guest Tips & Updates</h2>
          <p className="opacity-85 mt-2">
            Join the Barracks Media newsletter for booking openings and podcast
            growth insights.
          </p>

          <div className="mt-5 rounded-2xl overflow-hidden border border-white/10 bg-white">
            <iframe
              src={SUBSTACK_EMBED_URL}
              width="100%"
              height="320"
              style={{ border: "1px solid #EEE", background: "white" }}
              frameBorder="0"
              scrolling="no"
              title="Substack Signup"
            />
          </div>
        </section>

        {/* Calendly Section */}
        <section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-8">
          <h2 className="text-2xl font-semibold mb-4">Schedule Your Interview</h2>

          <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/20">
            <div
              className="calendly-inline-widget"
              data-url={calendlyUrl}
              style={{ minWidth: "320px", height: "820px" }}
            />
          </div>

          <p className="text-xs opacity-70 mt-4">
            If the scheduler doesn’t load, open directly:{" "}
            <a
              className="underline opacity-90"
              href={calendlyUrl}
              target="_blank"
              rel="noreferrer"
            >
              open booking in a new tab
            </a>
            .
          </p>
        </section>
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-xl rounded-3xl border border-white/15 bg-white p-6 shadow-2xl">
            <div className="flex justify-between items-start gap-3">
              <h3 className="text-xl font-semibold text-black">
                Join the Barracks Media Newsletter
              </h3>
              <button
                onClick={() => dismissPopup(false)}
                className="text-black/70 hover:text-black"
                type="button"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 rounded-2xl overflow-hidden border border-[#EEE] bg-white">
              <iframe
                src={SUBSTACK_EMBED_URL}
                width="100%"
                height="320"
                style={{ border: "1px solid #EEE", background: "white" }}
                frameBorder="0"
                scrolling="no"
                title="Substack Signup Popup"
              />
            </div>

            <div className="mt-4 text-right">
              <button
                onClick={() => dismissPopup(true)}
                className="text-sm underline text-gray-600"
                type="button"
              >
                Don’t show again
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default function BookingTemplate({
  showName,
  showTagline,
  calendlyBaseUrl,
}) {
  return (
    <Suspense fallback={<div className="p-10">Loading booking page…</div>}>
      <BookingTemplateInner
        showName={showName}
        showTagline={showTagline}
        calendlyBaseUrl={calendlyBaseUrl}
      />
    </Suspense>
  );
}
