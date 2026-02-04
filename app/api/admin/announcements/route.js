// app/api/admin/announcements/route.js
import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/adminAuthServer";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET(req) {
  const auth = await requireAdminFromRequest(req);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const sb = supabaseServer();
  const { data, error } = await sb
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function POST(req) {
  const auth = await requireAdminFromRequest(req);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const body = await req.json().catch(() => ({}));
  const title = (body.title || "").trim();
  const bodyText = (body.body || "").trim() || null;

  if (!title) {
    return NextResponse.json({ error: "Title is required." }, { status: 400 });
  }

  const sb = supabaseServer();
  const { data, error } = await sb
    .from("announcements")
    .insert([{ title, body: bodyText }])
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
  const { error } = await sb.from("announcements").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
