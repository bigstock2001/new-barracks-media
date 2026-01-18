"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const GREETING_TEXT =
  "Hey, I am Kate — I'm the Barracks Media Assistant. Ask me about our services and let me help you select a podcast perfect for you.";

function safeStr(v) {
  return typeof v === "string" ? v : "";
}

function makeBlobUrlFromBase64(base64, mime = "audio/mpeg") {
  const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  const blob = new Blob([bytes], { type: mime || "audio/mpeg" });
  return URL.createObjectURL(blob);
}

export default function FloatingVoiceBot() {
  const [open, setOpen] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);

  const [input, setInput] = useState("");
  const [status, setStatus] = useState("idle"); // idle | thinking | speaking | error
  const [answerText, setAnswerText] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState("");
  const [debug, setDebug] = useState(null);

  const audioRef = useRef(null);
  const busyRef = useRef(false);
  const lastAudioUrlRef = useRef(null);

  const canAsk = useMemo(() => {
    const trimmed = input.trim();
    if (!trimmed) return false;
    // Block while thinking OR speaking to prevent overlapping requests
    if (status === "thinking" || status === "speaking") return false;
    return true;
  }, [input, status]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Clean up old audio blob URLs to avoid memory leak
  function setAudioUrl(url) {
    try {
      if (lastAudioUrlRef.current) URL.revokeObjectURL(lastAudioUrlRef.current);
    } catch {}
    lastAudioUrlRef.current = url;
    if (audioRef.current) audioRef.current.src = url;
  }

  async function playAudioFromResponse(data) {
    const base64 = safeStr(data?.audioBase64);
    if (!base64) return;

    const url = makeBlobUrlFromBase64(base64, data?.mime || "audio/mpeg");
    setAudioUrl(url);

    if (!audioRef.current) return;
    setStatus("speaking");

    // Play and return to idle when done
    await audioRef.current.play();
    audioRef.current.onended = () => {
      busyRef.current = false;
      setStatus("idle");
    };
  }

  async function callVoicebot(message) {
    const res = await fetch("/api/voicebot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data?.ok) {
      const msg = data?.error || `Request failed (${res.status})`;
      throw new Error(msg);
    }
    return data;
  }

  // 🔊 Auto-speak greeting ONCE when opened the first time
  useEffect(() => {
    if (!open || hasGreeted) return;

    let cancelled = false;

    async function speakGreeting() {
      if (busyRef.current) return;
      busyRef.current = true;

      try {
        setError("");
        setAnswerText("");
        setRecommendations([]);
        setDebug(null);

        const data = await callVoicebot(GREETING_TEXT);
        if (cancelled) return;

        // Don't show greeting as "answer text" unless you want to
        // setAnswerText(data.text || "");

        await playAudioFromResponse(data);
        setHasGreeted(true);
      } catch {
        busyRef.current = false;
        setStatus("idle");
        setHasGreeted(true);
      }
    }

    speakGreeting();

    return () => {
      cancelled = true;
    };
  }, [open, hasGreeted]);

  async function onAsk() {
    const msg = input.trim();
    if (!msg) return;
    if (busyRef.current) return;

    busyRef.current = true;
    setError("");
    setAnswerText("");
    setRecommendations([]);
    setDebug(null);
    setStatus("thinking");

    try {
      const data = await callVoicebot(msg);

      // ✅ THIS is what you were missing:
      // store recommendations and render them
      const recs = Array.isArray(data?.recommendations)
        ? data.recommendations
        : [];
      setRecommendations(recs);

      setAnswerText(safeStr(data?.text));

      // Optional debug section from API (when VOICEBOT_DEBUG=true)
      if (data?.debug) setDebug(data.debug);

      await playAudioFromResponse(data);

      // If there was no audio for any reason, return to idle
      if (!safeStr(data?.audioBase64)) {
        busyRef.current = false;
        setStatus("idle");
      }
    } catch (e) {
      busyRef.current = false;
      setStatus("error");
      setError(e?.message || "Error");
    }
  }

  function onClear() {
    setInput("");
    setError("");
    setAnswerText("");
    setRecommendations([]);
    setDebug(null);
    setStatus("idle");
    busyRef.current = false;
    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    } catch {}
  }

  return (
    <div className="floating-bot-root">
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-full bg-black/70 px-4 py-3 text-sm font-semibold text-white shadow-xl backdrop-blur border border-white/10 hover:bg-black/80"
        >
          <span className="h-2 w-2 rounded-full bg-green-400" />
          Ask Barracks
        </button>
      )}

      {open && (
        <div className="mt-2 w-[360px] rounded-2xl border border-white/10 bg-black/80 backdrop-blur-xl shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <div>
              <div className="text-sm font-bold text-white">
                Barracks Voice Assistant
              </div>
              <div className="text-xs text-white/70">
                Type → Answer → I speak
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-xs text-white/60 hover:text-white"
            >
              Close
            </button>
          </div>

          {/* Body */}
          <div className="px-4 py-3 space-y-3">
            <div className="text-xs text-white/60">
              {status === "speaking"
                ? "Speaking…"
                : status === "thinking"
                ? "Thinking…"
                : status === "error"
                ? "Error"
                : "Ready"}
            </div>

            <textarea
              className="w-full min-h-[90px] rounded-xl bg-black/60 border border-white/10 p-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/25"
              placeholder='Example: "Which episode should I listen to if I like entrepreneurship?"'
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />

            <div className="flex gap-2">
              <button
                onClick={onAsk}
                disabled={!canAsk}
                className="flex-1 rounded-xl bg-white text-black py-2 text-sm font-semibold disabled:opacity-50"
              >
                Answer
              </button>
              <button
                onClick={onClear}
                className="rounded-xl border border-white/15 bg-black/50 text-white py-2 px-3 text-sm font-semibold hover:bg-black/60"
              >
                Clear
              </button>
            </div>

            {error && <div className="text-xs text-red-400">{error}</div>}

            {answerText && (
              <div className="rounded-xl bg-black/60 border border-white/10 p-3 text-sm text-white/90">
                {answerText}
              </div>
            )}

            {/* ✅ Recommendations UI */}
            {recommendations?.length > 0 && (
              <div className="rounded-xl bg-black/60 border border-white/10 p-3">
                <div className="text-xs font-semibold text-white/80 mb-2">
                  Recommended episodes
                </div>
                <div className="space-y-2">
                  {recommendations.map((r, idx) => {
                    const show = safeStr(r?.show) || "Barracks Media";
                    const title = safeStr(r?.title) || "Episode";
                    const url = safeStr(r?.url);

                    return (
                      <a
                        key={`${show}-${title}-${idx}`}
                        href={url || "#"}
                        onClick={(e) => {
                          if (!url) e.preventDefault();
                        }}
                        className="block rounded-lg border border-white/10 bg-black/40 px-3 py-2 hover:bg-black/55"
                      >
                        <div className="text-sm font-semibold text-white">
                          {title}
                        </div>
                        <div className="text-xs text-white/70">{show}</div>
                        {url ? (
                          <div className="text-[11px] text-white/50 mt-1">
                            Tap to open
                          </div>
                        ) : (
                          <div className="text-[11px] text-white/50 mt-1">
                            Link not available yet
                          </div>
                        )}
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Optional debug display */}
            {debug && (
              <div className="rounded-xl bg-black/60 border border-white/10 p-3 text-[11px] text-white/70">
                <div className="font-semibold text-white/80 mb-2">Debug</div>
                <div>episodesLoaded: {String(debug.episodesLoaded)}</div>
                <div>candidatesFound: {String(debug.candidatesFound)}</div>
              </div>
            )}

            <audio ref={audioRef} className="hidden" />
          </div>
        </div>
      )}
    </div>
  );
}
