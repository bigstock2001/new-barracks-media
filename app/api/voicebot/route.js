// app/api/voicebot/route.js
import { NextResponse } from "next/server";
import { formatKnowledgeForPrompt, SERVICES, PODCASTS } from "@/lib/voicebot/knowledge";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function jsonError(message, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

// Basic per-instance rate limit
const bucket = new Map();
function rateLimit(ip) {
  const now = Date.now();
  const windowMs = 60_000;
  const max = 12;
  const entry = bucket.get(ip) || { count: 0, resetAt: now + windowMs };
  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + windowMs;
  }
  entry.count += 1;
  bucket.set(ip, entry);
  return entry.count <= max;
}

function pickServiceFromText(q) {
  const wantsWebsite =
    q.includes("website") || q.includes("web design") || q.includes("site") || q.includes("seo");
  const wantsEditing =
    q.includes("edit") || q.includes("editing") || q.includes("premiere") || q.includes("audio");
  const wantsHosting = q.includes("hosting") || q.includes("host");
  const wantsPodcast =
    q.includes("podcast") || q.includes("show") || q.includes("episode");

  if (wantsWebsite) return SERVICES.find((s) => s.key === "web_design");
  if (wantsEditing) return SERVICES.find((s) => s.key === "editing");
  if (wantsPodcast) return SERVICES.find((s) => s.key === "podcast_production");
  if (wantsHosting) return SERVICES.find((s) => s.key === "hosting");
  return SERVICES.find((s) => s.key === "hosting");
}

function fallbackPodcastAnswer() {
  const primary = PODCASTS[0];
  const alt1 = PODCASTS[1];
  const alt2 = PODCASTS[2];

  return `Tell me what you're in the mood for — something inspiring, practical, or more reflective — and I’ll match you to the right show.
A great starting point is "${primary.title}" — ${primary.vibe}
Two good alternates are "${alt1.title}" and "${alt2.title}".`;
}

function fallbackAnswer(userMessage) {
  const q = (userMessage || "").toLowerCase();

  const wantsSchedule =
    q.includes("schedule") || q.includes("book") || q.includes("appointment") || q.includes("call");
  const wantsPodcast =
    q.includes("podcast") || q.includes("listen") || q.includes("episode") || q.includes("show");

  if (wantsSchedule) {
    const service = pickServiceFromText(q);
    return `Absolutely — I can help you schedule that. The fastest way is to book here: ${
      service?.bookingUrl || "/onboarding/hosting"
    }.
What are you trying to accomplish, so I can point you to the best option?`;
  }

  if (wantsPodcast) return fallbackPodcastAnswer();

  return `I can help you with Barracks Media services (web design, podcast production, editing, hosting), recommend the best show on the Barracks Media Network, and point you to the right booking link.
What are you trying to do today?`;
}

async function generateTextAnswer(userMessage) {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";

  // If OpenAI isn't configured, use safe fallback
  if (!apiKey) return fallbackAnswer(userMessage);

  const knowledge = formatKnowledgeForPrompt();

  const system = `
You are Kate, the Barracks Media assistant.

Voice & vibe:
- Friendly, natural, storyteller energy
- Short, confident answers (designed to be read out loud)

Hard rules (do not break these):
- NEVER read URLs, paths, or internal links out loud.
- NEVER say: "slash", "/network", or any route.
- NEVER call a show a "network". The only network is the Barracks Media Network.
- Refer to podcasts ONLY by title and a short vibe description.
- If asked to schedule: provide the correct booking link (you may show the link, but DO NOT speak it as a URL—say it like "I’ll send you to the booking page for Web Design").

Behavior:
- If the user asks for a podcast: give 1 primary recommendation + up to 2 alternates, each with a quick reason.
- If unsure: ask ONE clarifying question (only one).
- Do not invent podcasts or services not in the knowledge below.

KNOWLEDGE (voice-safe):
${knowledge}
`.trim();

  const payload = {
    model,
    input: [
      { role: "system", content: system },
      { role: "user", content: userMessage },
    ],
    max_output_tokens: 350,
  };

  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) return fallbackAnswer(userMessage);

  const data = await res.json();

  let text = "";
  if (typeof data.output_text === "string") text = data.output_text;

  if (!text && Array.isArray(data.output)) {
    for (const item of data.output) {
      if (item?.type === "message" && Array.isArray(item.content)) {
        for (const c of item.content) {
          if (c?.type === "output_text" && typeof c.text === "string") text += c.text;
          else if (typeof c?.text === "string") text += c.text;
        }
      }
    }
  }

  text = (text || "").trim();

  // Final guardrail: strip any accidental "/something" tokens
  text = text.replace(/\/[a-z0-9\-\/]+/gi, "").replace(/\s{2,}/g, " ").trim();

  return text || fallbackAnswer(userMessage);
}

async function elevenLabsTTS(text) {
  const xiKey = process.env.ELEVENLABS_API_KEY;
  const voiceId = process.env.ELEVENLABS_VOICE_ID;

  if (!xiKey) throw new Error("Missing ELEVENLABS_API_KEY");
  if (!voiceId) throw new Error("Missing ELEVENLABS_VOICE_ID");

  const url = `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(
    voiceId
  )}?output_format=mp3_44100_128`;

  const body = {
    text,
    model_id: "eleven_multilingual_v2",
    voice_settings: {
      stability: 0.35,
      similarity_boost: 0.9,
      style: 0.35,
      use_speaker_boost: true,
    },
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "xi-api-key": xiKey,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text().catch(() => "");
    throw new Error(`ElevenLabs error: ${res.status} ${err}`.slice(0, 300));
  }

  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export async function POST(req) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    if (!rateLimit(ip)) return jsonError("Rate limit hit. Try again in a minute.", 429);

    const { message } = await req.json().catch(() => ({}));
    if (!message || typeof message !== "string") return jsonError("Missing 'message'");

    const userMessage = message.slice(0, 1500).trim();
    if (!userMessage) return jsonError("Message is empty");

    const text = await generateTextAnswer(userMessage);

    // Keep TTS manageable
    const ttsText = text.length > 900 ? text.slice(0, 900) + "…" : text;

    const audioBytes = await elevenLabsTTS(ttsText);

    return NextResponse.json({
      ok: true,
      text,
      audioBase64: audioBytes.toString("base64"),
      mime: "audio/mpeg",
    });
  } catch (e) {
    return jsonError(e?.message || "Server error", 500);
  }
}
