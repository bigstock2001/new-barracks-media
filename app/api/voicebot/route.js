// app/api/voicebot/route.js
import { NextResponse } from "next/server";
import { getPodcastEpisodesForRecommendations, getServices } from "@/lib/sanity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function jsonError(message, status = 400, extra = {}) {
  return NextResponse.json({ ok: false, error: message, ...extra }, { status });
}

const bucket = new Map();
function rateLimit(ip) {
  const now = Date.now();
  const windowMs = 60_000;
  const max = 15;

  const entry = bucket.get(ip) || { count: 0, resetAt: now + windowMs };
  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + windowMs;
  }
  entry.count += 1;
  bucket.set(ip, entry);
  return entry.count <= max;
}

function normalize(text = "") {
  return String(text)
    .toLowerCase()
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/[^\p{L}\p{N}\s]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(text) {
  const t = normalize(text);
  if (!t) return [];
  const parts = t.split(" ");
  const stop = new Set([
    "the","and","for","with","that","this","from","your","youre","about","what",
    "when","where","which","into","them","they","their","there","have","has",
    "had","been","being","are","was","were","just","like","want","need"
  ]);
  return parts.filter((w) => w.length >= 3 && !stop.has(w));
}

function scoreEpisode(ep, tokens) {
  const hay = normalize(
    [
      ep?.title,
      ep?.showTitle,
      ep?.description,
      Array.isArray(ep?.tags) ? ep.tags.join(" ") : "",
    ].join(" ")
  );

  let score = 0;

  for (const tok of tokens) {
    if (!tok) continue;
    if (hay.includes(tok)) score += 3;
  }

  // extra weight for title/show matches
  const titleHay = normalize(ep?.title || "");
  const showHay = normalize(ep?.showTitle || "");
  for (const tok of tokens) {
    if (titleHay.includes(tok)) score += 2;
    if (showHay.includes(tok)) score += 1;
  }

  // tag matches
  if (Array.isArray(ep?.tags) && ep.tags.length) {
    const tagHay = normalize(ep.tags.join(" "));
    for (const tok of tokens) {
      if (tagHay.includes(tok)) score += 2;
    }
  }

  return score;
}

function pickTopEpisodes(episodes, userMessage, n = 8) {
  const tokens = tokenize(userMessage);
  if (!tokens.length) return [];

  return episodes
    .map((ep) => ({ ep, s: scoreEpisode(ep, tokens) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, n)
    .map((x) => x.ep);
}

function buildKnowledge(services, candidates) {
  const servicesBlock = (services || [])
    .map((s) => `- ${s.title}: ${s.shortDescription || ""}`.trim())
    .join("\n");

  const episodesBlock = (candidates || [])
    .map((e, idx) => {
      const desc = String(e?.description || "").replace(/\s+/g, " ").trim();
      const shortDesc = desc.length > 260 ? desc.slice(0, 260) + "…" : desc;

      const tags =
        Array.isArray(e?.tags) && e.tags.length
          ? ` Tags: ${e.tags.slice(0, 10).join(", ")}`
          : "";

      return `- Episode ${idx + 1}: "${e.title}" (Show: ${e.showTitle || "Barracks Media"}) — ${shortDesc}${tags}`;
    })
    .join("\n");

  return `
BARRACKS MEDIA SERVICES:
${servicesBlock || "- (No services found yet in Sanity)"}

MATCHING EPISODES (these are real, do not invent new ones):
${episodesBlock || "- (No matching episodes found for this question yet)"}
  `.trim();
}

async function generateKateText({ userMessage, knowledge, hasCandidates }) {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";

  // If OpenAI not configured, return a very clear message (not the generic loop)
  if (!apiKey) {
    return `Hey, I’m Kate — the Barracks Media assistant. I can recommend episodes and help with services, but the AI key isn’t connected yet.`;
  }

  const instructions = `
You are Kate, the Barracks Media assistant.

Opening greeting (only if user is greeting / first message vibe):
"Hey, I am Kate — I'm the Barracks Media Assistant. Ask me about our services and let me help you select a podcast perfect for you."

Voice:
- Natural, friendly, storyteller.
- Short, direct answers (spoken out loud).

Hard rules (must follow):
- NEVER read URLs, slugs, or routes out loud (no "/network", no "slash", no "dot com").
- NEVER say a podcast is its own "network". There is only ONE: the Barracks Media Network.
- If there are matching episodes provided, recommend:
  - 1 best episode (Show Name + Episode Title + why)
  - then up to 2 alternates
- If there are NO matching episodes provided, ask ONE clarifying question.
- Do not invent episodes or services not shown below.

${knowledge}
  `.trim();

  // ✅ Correct Responses API shape: instructions + input
  const payload = {
    model,
    instructions,
    input: userMessage,
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
    const errText = await res.text().catch(() => "");
    // if candidates exist but OpenAI failed, we can still return a deterministic recommendation
    if (hasCandidates) {
      return `I’ve got a solid match for you. What kind of vibe do you want: practical, inspiring, or deep and reflective?`;
    }
    return `Tell me what you’re in the mood for — like veterans, entrepreneurship, writing, healing, or content creation — and I’ll match you to a specific episode.`;
  }

  const data = await res.json();

  // Responses API often returns output_text
  let text = typeof data.output_text === "string" ? data.output_text : "";

  // Safety cleanup: strip any accidental route fragments
  text = (text || "")
    .replace(/\/[a-z0-9\-\/]+/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();

  return text || `Tell me what you’re in the mood for and I’ll recommend an episode.`;
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

    const debugOn = process.env.VOICEBOT_DEBUG === "true";

    // Pull fresh data from Sanity
    const [services, episodes] = await Promise.all([
      getServices().catch(() => []),
      getPodcastEpisodesForRecommendations(300).catch(() => []),
    ]);

    const candidates = pickTopEpisodes(episodes, userMessage, 8);
    const knowledge = buildKnowledge(services, candidates);

    const text = await generateKateText({
      userMessage,
      knowledge,
      hasCandidates: candidates.length > 0,
    });

    const ttsText = text.length > 900 ? text.slice(0, 900) + "…" : text;
    const audioBytes = await elevenLabsTTS(ttsText);

    const recommendations = candidates.slice(0, 3).map((e) => ({
      show: e.showTitle || "Barracks Media",
      title: e.title,
      url: e.youtubeUrl || e.episodePageUrl || "",
      tags: Array.isArray(e.tags) ? e.tags : [],
      publishedAt: e.publishedAt || null,
    }));

    const debug = debugOn
      ? {
          openaiKeyPresent: Boolean(process.env.OPENAI_API_KEY),
          openaiModel: process.env.OPENAI_MODEL || "gpt-4.1-mini",
          elevenKeyPresent: Boolean(process.env.ELEVENLABS_API_KEY),
          elevenVoicePresent: Boolean(process.env.ELEVENLABS_VOICE_ID),
          episodesLoaded: Array.isArray(episodes) ? episodes.length : 0,
          candidatesFound: candidates.length,
          candidateTitles: candidates.slice(0, 5).map((c) => ({
            show: c.showTitle,
            title: c.title,
            tags: c.tags || [],
          })),
        }
      : null;

    return NextResponse.json({
      ok: true,
      text,
      recommendations,
      audioBase64: audioBytes.toString("base64"),
      mime: "audio/mpeg",
      debug,
    });
  } catch (e) {
    return jsonError(e?.message || "Server error", 500);
  }
}
