// components/FloatingVoiceBot.jsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export default function FloatingVoiceBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("idle");
  const [answerText, setAnswerText] = useState("");
  const [error, setError] = useState("");
  const audioRef = useRef(null);

  const canAsk = useMemo(
    () => input.trim().length > 0 && status !== "thinking",
    [input, status]
  );

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  async function onAsk() {
    setError("");
    setAnswerText("");
    setStatus("thinking");

    try {
      const res = await fetch("/api/voicebot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      if (!res.ok || !data?.ok) throw new Error(data?.error || "Error");

      setAnswerText(data.text || "");

      const bytes = Uint8Array.from(atob(data.audioBase64), (c) => c.charCodeAt(0));
      const blob = new Blob([bytes], { type: data.mime || "audio/mpeg" });
      const url = URL.createObjectURL(blob);

      audioRef.current.src = url;
      setStatus("speaking");
      await audioRef.current.play();
      audioRef.current.onended = () => setStatus("idle");
    } catch (e) {
      setStatus("error");
      setError(e.message);
    }
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
              {status === "thinking"
                ? "Thinking…"
                : status === "speaking"
                ? "Speaking…"
                : "Ready"}
            </div>

            <textarea
              className="w-full min-h-[90px] rounded-xl bg-black/60 border border-white/10 p-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/25"
              placeholder='Example: "Which podcast should I listen to if I like entrepreneurship?"'
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
                onClick={() => setOpen(false)}
                className="rounded-xl border border-white/10 px-3 text-sm text-white/80 hover:text-white"
              >
                Close
              </button>
            </div>

            {error && (
              <div className="text-xs text-red-400">{error}</div>
            )}

            {answerText && (
              <div className="rounded-xl bg-black/60 border border-white/10 p-3 text-sm text-white/90">
                {answerText}
              </div>
            )}

            <audio ref={audioRef} className="hidden" />
          </div>
        </div>
      )}
    </div>
  );
}
