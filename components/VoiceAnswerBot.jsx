// app/components/VoiceAnswerBot.jsx
"use client";

import { useMemo, useRef, useState } from "react";

export default function VoiceAnswerBot() {
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("idle"); // idle | thinking | speaking | error
  const [answerText, setAnswerText] = useState("");
  const [error, setError] = useState("");
  const audioRef = useRef(null);

  const canAsk = useMemo(() => input.trim().length > 0 && status !== "thinking", [input, status]);

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

      // Build an audio URL from base64
      const byteChars = atob(data.audioBase64);
      const byteNums = new Array(byteChars.length);
      for (let i = 0; i < byteChars.length; i++) {
        byteNums[i] = byteChars.charCodeAt(i);
      }
      const blob = new Blob([new Uint8Array(byteNums)], { type: data.mime || "audio/mpeg" });
      const audioUrl = URL.createObjectURL(blob);

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = audioUrl;

        setStatus("speaking");
        await audioRef.current.play();

        // When audio ends, go back to idle
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

  return (
    <section className="w-full max-w-2xl rounded-2xl border border-white/10 bg-black/30 p-5 shadow-lg backdrop-blur">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">Ask Barracks Media</h3>
          <p className="text-sm text-white/70">
            Ask about services, get a podcast recommendation, or get the right booking link.
          </p>
        </div>

        <div className="text-xs text-white/70">
          {status === "thinking" && "Thinking…"}
          {status === "speaking" && "Speaking…"}
          {status === "idle" && "Ready"}
          {status === "error" && "Error"}
        </div>
      </div>

      <div className="mt-4">
        <label className="sr-only" htmlFor="botQuestion">
          Your question
        </label>
        <textarea
          id="botQuestion"
          className="min-h-[90px] w-full resize-none rounded-xl border border-white/10 bg-black/40 p-3 text-sm outline-none placeholder:text-white/40 focus:border-white/25"
          placeholder='Example: "Which podcast should I listen to if I like entrepreneurship and veteran stories?"'
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
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
          onClick={() => {
            setInput("");
            setAnswerText("");
            setError("");
            setStatus("idle");
            if (audioRef.current) audioRef.current.pause();
          }}
          className="rounded-xl border border-white/15 bg-transparent px-4 py-2 text-sm text-white"
        >
          Clear
        </button>

        <audio ref={audioRef} className="hidden" />
      </div>

      {error ? (
        <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      {answerText ? (
        <div className="mt-4 rounded-xl border border-white/10 bg-black/30 p-3">
          <div className="text-xs uppercase tracking-wide text-white/60">Text Answer</div>
          <div className="mt-1 whitespace-pre-wrap text-sm text-white/90">{answerText}</div>
        </div>
      ) : null}

      <div className="mt-4 text-xs text-white/50">
        Tip: Keep questions short. If you ask to schedule, I’ll route you to the correct booking page.
      </div>
    </section>
  );
}
