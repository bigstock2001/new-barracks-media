import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs"; // ensures Node runtime (safe for supabase-js)

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

export async function POST(req) {
  try {
    // Use server-only secrets (NOT NEXT_PUBLIC) for writes
    const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

    if (!url || !serviceKey) {
      return NextResponse.json(
        {
          error:
            "Server misconfigured: missing SUPABASE_URL and/or SUPABASE_SERVICE_ROLE_KEY.",
        },
        { status: 500 }
      );
    }

    const supabase = createClient(url, serviceKey, {
      auth: { persistSession: false },
    });

    const body = await req.json();

    // Basic required fields
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

    if (!isValidEmail(body.email)) {
      return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
    }

    // Normalize + include ALL fields your client collects
    const payload = {
      full_name: String(body.full_name).trim(),
      email: String(body.email).trim().toLowerCase(),
      show_name: String(body.show_name).trim(),
      show_website: body.show_website ? String(body.show_website).trim() : null,
      rss_url: body.rss_url ? String(body.rss_url).trim() : null,
      host_platform: body.host_platform ? String(body.host_platform).trim() : null,
      publish_frequency: String(body.publish_frequency).trim(),
      focus: String(body.focus).trim(), // helping | storytelling | both
      primary_topics: body.primary_topics ? String(body.primary_topics).trim() : null,
      why_join: String(body.why_join).trim(),
      path: String(body.path).trim(), // full | independent

      // Path-related fields (optional but captured if present)
      stats_proof_url: body.stats_proof_url ? String(body.stats_proof_url).trim() : null,
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

    const { data, error } = await supabase
      .from("applications")
      .insert(payload)
      .select("id")
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message || "Database insert failed." },
        { status: 400 }
      );
    }

    return NextResponse.json({ ok: true, id: data?.id || null });
  } catch (e) {
    return NextResponse.json(
      { error: e?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
