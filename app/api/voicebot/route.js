// app/api/voicebot/route.js
import { NextResponse } from "next/server";
import { getPodcastEpisodesForRecommendations, getServices } from "@/lib/sanity";

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
    "the",
    "and",
    "for",
    "with",
    "that",
    "this",
    "from",
    "your",
    "youre",
    "about",
    "what",
    "when",
    "where",
    "which",
    "into",
    "them",
    "they",
    "their",
    "there",
    "have",
    "has",
    "had",
    "been",
    "being",
    "are",
    "was",
    "were",
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

  // token matches
  for (const tok of tokens) {
    if (!tok) continue;
    if (hay.includes(tok)) score += 3;
  }

  // tag matches weighted
  if (Array.isArray(ep?.tags) && ep.tags.length) {
    const tagHay = normalize(ep.tags.join(" "));
    for (const tok of tokens) {
      if (tagHay.includes(tok)) score += 2;
    }
  }

  // slight boost if title matches strongly
  if (ep?.title) {
    const t = normalize(ep.title);
    for (const tok of tokens) {
      if (t.includes(tok)) score += 1;
    }
  }

  return score;
}

function pickTopEpisodes(episodes, userMessage, n = 8) {
  const tokens = tokenize(userMessage);
  if (!tokens.length) return [];

  const scored = episodes
    .map((ep) => ({ ep, s: scoreEpisode(ep, tokens) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, n)
    .map((x) => x.ep);

  return scored;
}

function buildVoiceSafeKnowledge(services, candidates) {
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

      return `- Episode ${idx + 1}: "${e.title}" (Show: ${
        e.showTitle || "Barracks Media"
      }) — ${shortDesc}${tags}`;
    })
    .join("\n");

  return `
You are answering as Kate, the Barracks Media assistant.

BARRACKS MEDIA SERVICES:
${servicesBlock || "- (No services found yet in Sanity)"}

MATCHING EPISODES (use these for recommendations):
${episodesBlock || "- (No matching episodes found yet)"}
  `.trim();
}

async function generateTextAnswer(userMessage, knowledge) {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";

  // If OpenAI isn't set up, return a safe fallback
  if (!apiKey) {
    return `Hey — I’m Kate, the Barracks Media assistant. Tell me what you’re in the mood for and I’ll recommend a specific episode.`;
  }

  const system = `
You are Kate, the Barracks Media assistant.

Opening greeting (first response only if the user is just arriving / saying hi):
"Hey, I’m Kate — the Barracks Media assistant. Ask me about our services, and I can help you pick a podcast episode that fits you."

Voice & vibe:
- Friendly, natural, "storyteller" energy
- Keep it short and easy to listen to

Hard rules (must follow):
- NEVER read URLs, paths, or routes out loud (no "/network", no "slash", no "dot com").
- NEVER say a podcast is its own "network". The only network is the Barracks Media Network.
- Recommend 1 best episode + up to 2 alternates.
- When recommending: say Show Name + Episode Title + quick reason.
- If you are unsure: ask ONE clarifying question (only one).
- Do not invent episodes or services not shown in KNOWLEDGE.

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
    return `Tell me the topic you want and I’ll recommend a specific episode. What are you in the mood for?`;
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

  // final guardrail: remove accidental route fragments
  text = text.replace(/\/[a-z0-9\-\/]+/gi, "").replace(/\s{2,}/g, " ").trim();

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

    // Pull fresh data from Sanity
    const [services, episodes] = await Promise.all([
      getServices().catch(() => []),
      getPodcastEpisodesForRecommendations(250).catch(() => []),
    ]);

    // Pick top episode candidates for THIS question
    const candidates = pickTopEpisodes(episodes, userMessage, 8);

    const knowledge = buildVoiceSafeKnowledge(services, candidates);
    const text = await generateTextAnswer(userMessage, knowledge);

    // TTS cap (keeps response snappy)
    const ttsText = text.length > 900 ? text.slice(0, 900) + "…" : text;
    const audioBytes = await elevenLabsTTS(ttsText);

    // Return clickable recs for the UI (Kate must not read URLs out loud)
    const recommendations = candidates.slice(0, 3).map((e) => ({
      show: e.showTitle || "Barracks Media",
      title: e.title,
      url: e.youtubeUrl || e.episodePageUrl || "",
      tags: Array.isArray(e.tags) ? e.tags : [],
      publishedAt: e.publishedAt || null,
    }));

    return NextResponse.json({
      ok: true,
      text,
      recommendations,
      audioBase64: audioBytes.toString("base64"),
      mime: "audio/mpeg",
    });
  } catch (e) {
    return jsonError(e?.message || "Server error", 500);
  }
}
