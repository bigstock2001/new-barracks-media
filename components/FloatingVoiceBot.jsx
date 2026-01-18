// components/FloatingVoiceBot.jsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export default function FloatingVoiceBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("idle"); // idle | thinking | speaking | error
  const [answerText, setAnswerText] = useState("");
  const [error, setError] = useState("");
  const audioRef = useRef(null);

  const canAsk = useMemo(
    () => input.trim().length > 0 && status !== "thinking",
    [input, status]
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
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

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || "Something went wrong.");
      }

      setAnswerText(data.text || "");

      // base64 -> blob -> audio url
      const byteChars = atob(data.audioBase64);
      const byteNums = new Array(byteChars.length);
      for (let i = 0; i < byteChars.length; i++) byteNums[i] = byteChars.charCodeAt(i);
      const blob = new Blob([new Uint8Array(byteNums)], { type: data.mime || "audio/mpeg" });
      const audioUrl = URL.createObjectURL(blob);

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = audioUrl;

        setStatus("speaking");
        await audioRef.current.play();

        audioRef.current.onended = () => setStatus("idle");
      } else {
        setStatus("idle");
      }
    } catch (e) {
      setStatus("error");
      setError(e?.message || "Error");
    }
  }

  function onStop() {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setStatus("idle");
  }

  function onClear() {
    setInput("");
    setAnswerText("");
    setError("");
    setStatus("idle");
    if (audioRef.current) audioRef.current.pause();
  }

  return (
    <div className="fixed bottom-4 right-4 z-[9999]">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-4 py-3 text-sm font-semibold text-white shadow-lg backdrop-blur hover:bg-black/70"
          aria-label="Open voice assistant"
        >
          <span className="inline-block h-2 w-2 rounded-full bg-green-400" />
          Ask Barracks
        </button>
      ) : null}

      {open ? (
        <div className="w-[340px] overflow-hidden rounded-2xl border border-white/10 bg-black/70 shadow-2xl backdrop-blur">
          <div className="flex items-start justify-between gap-3 border-b border-white/10 px-4 py-3">
            <div>
              <div className="text-sm font-semibold text-white">Barracks Voice Assistant</div>
              <div className="text-xs text-white/70">
                Type a question → hit <b>Answer</b> → I’ll speak back.
              </div>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-white hover:bg-white/10"
              aria-label="Close"
            >
              Close
            </button>
          </div>

          <div className="px-4 py-3">
            <div className="mb-2 flex items-center justify-between text-xs text-white/70">
              <span>
                {status === "thinking" && "Thinking…"}
                {status === "speaking" && "Speaking…"}
                {status === "idle" && "Ready"}
                {status === "error" && "Error"}
              </span>
              <span className="text-white/50">ESC closes</span>
            </div>

            <textarea
              className="min-h-[84px] w-full resize-none rounded-xl border border-white/10 bg-black/40 p-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-white/25"
              placeholder='Example: "Which podcast should I listen to if I like entrepreneurship?"'
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />

            <div className="mt-2 flex flex-wrap gap-2">
              <button
                onClick={onAsk}
                disabled={!canAsk}
                className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black disabled:cursor-not-allowed disabled:opacity-50"
              >
                Answer
              </button>

              <button
                onClick={onStop}
                disabled={status !== "speaking"}
                className="rounded-xl border border-white/15 bg-transparent px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Stop
              </button>

              <button
                onClick={onClear}
                className="rounded-xl border border-white/15 bg-transparent px-4 py-2 text-sm text-white"
              >
                Clear
              </button>
            </div>

            <audio ref={audioRef} className="hidden" />

            {error ? (
              <div className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 p-2 text-xs text-red-200">
                {error}
              </div>
            ) : null}

            {answerText ? (
              <div className="mt-3 rounded-xl border border-white/10 bg-black/30 p-2">
                <div className="text-[11px] uppercase tracking-wide text-white/60">Text Answer</div>
                <div className="mt-1 max-h-[140px] overflow-auto whitespace-pre-wrap text-sm text-white/90">
                  {answerText}
                </div>
              </div>
            ) : null}

            <div className="mt-3 text-[11px] text-white/50">
              Ask about services, podcast recommendations, or booking the right appointment.
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
