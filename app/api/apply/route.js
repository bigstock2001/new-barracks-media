import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !anonKey) {
      return NextResponse.json(
        { error: "Server misconfigured: missing Supabase env vars." },
        { status: 500 }
      );
    }

    const supabase = createClient(url, anonKey);

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
      email: String(body.email).trim(),
      show_name: String(body.show_name).trim(),
      show_website: body.show_website ? String(body.show_website).trim() : null,
      rss_url: body.rss_url ? String(body.rss_url).trim() : null,
      host_platform: body.host_platform ? String(body.host_platform).trim() : null,
      publish_frequency: String(body.publish_frequency).trim(),
      focus: String(body.focus).trim(), // helping | storytelling | both
      primary_topics: body.primary_topics ? String(body.primary_topics).trim() : null,
      why_join: String(body.why_join).trim(),
      path: String(body.path).trim(), // partner | full
      stats_proof_url: body.stats_proof_url ? String(body.stats_proof_url).trim() : null,
      status: "new",
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
