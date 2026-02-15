"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Script from "next/script";
import { useSearchParams } from "next/navigation";

const SHOW = {
  name: "Authors After Action",
  tagline:
    "A show for authors, veterans, and creators turning experience into impact through storytelling and books.",
};

const CALENDLY_BASE_URL =
  "https://calendly.com/donalddunn/authors-after-action";

const SUBSTACK_EMBED_URL = "https://zlpceut.substack.com/embed";

const LS_KEY_SUPPRESS_POPUP = "bm_substack_popup_suppress_v1";

function buildUrlWithQuery(baseUrl, queryObj) {
  try {
    const url = new URL(baseUrl);
    Object.entries(queryObj || {}).forEach(([k, v]) => {
      if (v === undefined || v === null) return;
      const str = String(v).trim();
      if (!str) return;
      url.searchParams.set(k, str);
    });
    return url.toString();
  } catch {
    return baseUrl;
  }
}

function BookingPageInner() {
  const params = useSearchParams();

  const [showPopup, setShowPopup] = useState(false);
  const [popupArmed, setPopupArmed] = useState(false);

  // UTMs passthrough (PodMatch -> this page -> Calendly)
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
    return buildUrlWithQuery(CALENDLY_BASE_URL, utm);
  }, [utm]);

  // Allow you to force popup for testing: ?popup=1
  const forcePopup = useMemo(() => params.get("popup") === "1", [params]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // If you ever need to reset suppression manually:
    // localStorage.removeItem("bm_substack_popup_suppress_v1")

    const suppressed = window.localStorage.getItem(LS_KEY_SUPPRESS_POPUP) === "1";
    if (suppressed && !forcePopup) return;

    // Arm popup after short delay so it doesn't insta-pop
    const t = window.setTimeout(() => setPopupArmed(true), 1200);
    return () => window.clearTimeout(t);
  }, [forcePopup]);

  useEffect(() => {
    if (!popupArmed) return;
    if (typeof window === "undefined") return;

    const suppressed = window.localStorage.getItem(LS_KEY_SUPPRESS_POPUP) === "1";
    if (suppressed && !forcePopup) return;

    // ✅ Fallback timer: show after 18s if they haven't dismissed it
    const timer = window.setTimeout(() => {
      setShowPopup(true);
    }, 18000);

    // ✅ Scroll trigger (~45% now, less strict)
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

    // ✅ Exit intent (desktop)
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
  }, [popupArmed, forcePopup]);

  const dismissPopup = (suppress = false) => {
    setShowPopup(false);
    if (suppress && typeof window !== "undefined") {
      window.localStorage.setItem(LS_KEY_SUPPRESS_POPUP, "1");
    }
  };

  return (
    <main className="min-h-screen">
      {/* Calendly script */}
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="afterInteractive"
      />

      <div className="mx-auto max-w-5xl px-5 py-12 space-y-10">
        {/* Hero */}
        <section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold">
                Book a guest spot on {SHOW.name}
              </h1>
              <p className="mt-4 text-lg opacity-90 max-w-3xl">
                {SHOW.tagline}
              </p>
            </div>

            {/* ✅ Manual trigger so it ALWAYS "works" */}
            <button
              onClick={() => setShowPopup(true)}
              className="shrink-0 rounded-xl bg-white text-black px-4 py-3 text-sm font-semibold hover:opacity-90 transition"
            >
              Join Newsletter
            </button>
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
            If the scheduler doesn’t load, your browser may be blocking
            third-party scripts. Open directly:{" "}
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

        {/* ✅ OPTIONAL: A visible inline subscribe section at the bottom
            (keeps conversions high AND guarantees Substack is reachable) */}
        <section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-8">
          <h2 className="text-2xl font-semibold">Get updates</h2>
          <p className="opacity-85 mt-2">
            Guest tips, booking openings, and growth tactics — short and useful.
          </p>

          <div className="mt-5 rounded-2xl overflow-hidden border border-white/10 bg-white">
            <iframe
              src={SUBSTACK_EMBED_URL}
              width="100%"
              height="320"
              style={{ border: "1px solid #EEE", background: "white" }}
              frameBorder="0"
              scrolling="no"
              title="Substack Signup Inline"
            />
          </div>
        </section>
      </div>

      {/* Substack Popup */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-xl rounded-3xl border border-white/15 bg-white p-6 shadow-2xl">
            <div className="flex justify-between items-start gap-3">
              <div>
                <h3 className="text-xl font-semibold text-black">
                  Join the Barracks Media Newsletter
                </h3>
                <p className="mt-2 text-sm text-black/70">
                  Guest tips, booking openings, and growth tactics — short and useful.
                </p>
              </div>

              <button
                onClick={() => dismissPopup(false)}
                className="rounded-lg px-2 py-1 text-black/70 hover:text-black"
                aria-label="Close"
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

            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <button
                onClick={() => dismissPopup(true)}
                className="text-sm underline text-gray-600 hover:text-gray-900"
              >
                Don’t show again
              </button>

              <button
                onClick={() => dismissPopup(false)}
                className="text-sm text-gray-700 hover:text-gray-900"
              >
                Not now
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default function BookingAuthorsAfterActionPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen">
          <div className="mx-auto max-w-5xl px-5 py-12 space-y-6">
            <section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-8">
              <h1 className="text-3xl md:text-4xl font-semibold">
                Book a guest spot on {SHOW.name}
              </h1>
              <p className="mt-4 text-lg opacity-90 max-w-3xl">
                {SHOW.tagline}
              </p>
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-8">
              <h2 className="text-2xl font-semibold mb-2">
                Loading scheduler…
              </h2>
              <p className="opacity-80">
                One moment while we load the booking calendar.
              </p>
            </section>
          </div>
        </main>
      }
    >
      <BookingPageInner />
    </Suspense>
  );
}
