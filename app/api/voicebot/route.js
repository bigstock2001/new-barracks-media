// app/api/voicebot/route.js

import { NextResponse } from "next/server";
import { formatKnowledgeForPrompt, SERVICES, PODCASTS } from "@/lib/voicebot/knowledge";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function jsonError(message, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

// Best-effort simple rate limit (per instance)
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

function fallbackAnswer(userMessage) {
  const q = (userMessage || "").toLowerCase();

  const wantsSchedule =
    q.includes("schedule") || q.includes("book") || q.includes("appointment") || q.includes("call");
  const wantsPodcast =
    q.includes("podcast") || q.includes("listen") || q.includes("episode") || q.includes("show");
  const wantsWebsite =
    q.includes("website") || q.includes("web design") || q.includes("site") || q.includes("seo");
  const wantsEditing =
    q.includes("edit") || q.includes("editing") || q.includes("premiere") || q.includes("audio");
  const wantsHosting = q.includes("hosting") || q.includes("host");

  if (wantsSchedule) {
    let service = SERVICES.find((s) => s.key === "hosting");
    if (wantsWebsite) service = SERVICES.find((s) => s.key === "web_design") || service;
    if (wantsEditing) service = SERVICES.find((s) => s.key === "editing") || service;
    if (wantsHosting) service = SERVICES.find((s) => s.key === "hosting") || service;

    return `Absolutely — I can help you schedule that. The fastest way is to book here: ${
      service?.bookingUrl || "/onboarding/hosting"
    }.
If you tell me what you're trying to accomplish, I’ll point you to the best option.`;
  }

  if (wantsPodcast) {
    const primary = PODCASTS[0];
    const alt1 = PODCASTS[1];
    const alt2 = PODCASTS[2];

    return `Tell me what you're in the mood for — something inspiring, practical, or more deep and reflective — and I’ll match you to the right show.
If you want a strong starting point: "${primary.title}" (${primary.url}).
Alternates: "${alt1.title}" (${alt1.url}) and "${alt2.title}" (${alt2.url}).`;
  }

  return `I can help you pick the right service (web design, editing, hosting, podcast production), recommend the best show in the network, and route you to the right booking link.
What are you trying to accomplish today?`;
}

async function generateTextAnswer(userMessage) {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL;

  if (!apiKey || !model) return fallbackAnswer(userMessage);

  const knowledge = formatKnowledgeForPrompt();

  const system = `
You are the Barracks Media site assistant.
Voice & vibe: friendly, natural, storyteller energy — but still concise.

Goals:
- Answer questions about services clearly.
- Recommend the best podcast(s) from the network based on what the visitor says they like.
- Help schedule appointments by pointing to the correct booking link.

Rules:
- Ask at most ONE clarifying question if needed.
- If the visitor asks to schedule, give the best matching booking link.
- Do not invent podcasts or services not listed in the KNOWLEDGE.
- When recommending podcasts: 1 primary pick + up to 2 alternates with quick reasons.
- Keep it readable out loud. Avoid overly long paragraphs.

KNOWLEDGE:
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

  if (!res.ok) {
    return fallbackAnswer(userMessage);
  }

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

  // Storyteller / natural / friendly tuning:
  // - slightly lower stability (more human)
  // - high similarity (keeps the chosen voice)
  // - moderate style (adds expression without going “cartoon”)
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
