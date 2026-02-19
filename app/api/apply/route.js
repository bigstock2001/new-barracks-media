import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

/**
 * ✅ Handle GET requests (for crawlers / SEO tools)
 * Prevents Ubersuggest or other bots from flagging this as a broken link.
 */
export async function GET() {
  return new NextResponse(
    "Barracks Media Network application endpoint. POST requests only.",
    {
      status: 200,
      headers: {
        "content-type": "text/plain; charset=utf-8",
      },
    }
  );
}

/**
 * ✅ Handle HEAD requests (some crawlers use HEAD instead of GET)
 */
export async function HEAD() {
  return new NextResponse(null, { status: 200 });
}

/**
 * ✅ Main POST handler (your original logic)
 */
export async function POST(req) {
  try {
    const url =
      process.env.SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.SUPABASE_PROJECT_URL;

    const serviceKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_SERVICE_KEY ||
      process.env.SUPABASE_SERVICE_ROLE;

    if (!url || !serviceKey) {
      const missingUrl = !url;
      const missingKey = !serviceKey;

      return NextResponse.json(
        {
          error: `Server misconfigured: missing Supabase env vars. SUPABASE_URL missing=${missingUrl}. SUPABASE_SERVICE_ROLE_KEY missing=${missingKey}.`,
        },
        { status: 500 }
      );
    }

    const supabase = createClient(url, serviceKey, {
      auth: { persistSession: false },
    });

    const body = await req.json();

    const required = [
      "full_name",
      "email",
      "show_name",
      "focus",
      "path",
      "publish_frequency",
      "why_join",
    ];

    for (const key of required) {
      if (!body?.[key] || String(body[key]).trim().length === 0) {
        return NextResponse.json(
          { error: `Missing required field: ${key}` },
          { status: 400 }
        );
      }
    }

    const payload = {
      full_name: String(body.full_name).trim(),
      email: String(body.email).trim().toLowerCase(),
      show_name: String(body.show_name).trim(),
      show_website: body.show_website
        ? String(body.show_website).trim()
        : null,
      rss_url: body.rss_url ? String(body.rss_url).trim() : null,
      host_platform: body.host_platform
        ? String(body.host_platform).trim()
        : null,
      publish_frequency: String(body.publish_frequency).trim(),
      focus: String(body.focus).trim(),
      primary_topics: body.primary_topics
        ? String(body.primary_topics).trim()
        : null,
      why_join: String(body.why_join).trim(),
      path: String(body.path).trim(),
      stats_proof_url: body.stats_proof_url
        ? String(body.stats_proof_url).trim()
        : null,
      published_episodes: body.published_episodes
        ? Number(String(body.published_episodes).replace(/[^0-9]/g, "")) || null
        : null,
      avg_downloads_30days: body.avg_downloads_30days
        ? Number(String(body.avg_downloads_30days).replace(/[^0-9]/g, "")) || null
        : null,
      manual_stats_reporting: !!body.manual_stats_reporting,
      status: "new",
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("applications").insert(payload);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
