// app/api/admin/events/route.js
import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/adminAuthServer";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET(req) {
  const auth = await requireAdminFromRequest(req);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const sb = supabaseServer();
  const { data, error } = await sb
    .from("events")
    .select("*")
    .order("starts_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function POST(req) {
  const auth = await requireAdminFromRequest(req);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const body = await req.json().catch(() => ({}));
  const title = (body.title || "").trim();
  const starts_at = body.starts_at || null;
  const streamyard_url = (body.streamyard_url || "").trim() || null;
  const description = (body.description || "").trim() || null;

  if (!title) {
    return NextResponse.json({ error: "Title is required." }, { status: 400 });
  }

  const sb = supabaseServer();
  const { data, error } = await sb
    .from("events")
    .insert([{ title, starts_at, streamyard_url, description }])
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function DELETE(req) {
  const auth = await requireAdminFromRequest(req);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id." }, { status: 400 });

  const sb = supabaseServer();
  const { error } = await sb.from("events").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
