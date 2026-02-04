// lib/adminAuthServer.js
import { createClient } from "@supabase/supabase-js";

function getAdminEmails() {
  const raw = process.env.ADMIN_EMAILS || "";
  return raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export async function requireAdminFromRequest(req) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anon) {
    return { ok: false, status: 500, error: "Missing Supabase env vars." };
  }

  const adminEmails = getAdminEmails();
  if (!adminEmails.length) {
    return {
      ok: false,
      status: 500,
      error: "ADMIN_EMAILS is not set in environment variables.",
    };
  }

  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

  if (!token) {
    return { ok: false, status: 401, error: "Missing Authorization token." };
  }

  const supabase = createClient(url, anon, {
    auth: { persistSession: false },
  });

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) {
    return { ok: false, status: 401, error: "Invalid or expired session." };
  }

  const email = (data.user.email || "").toLowerCase();
  const isAdmin = adminEmails.includes(email);

  if (!isAdmin) {
    return { ok: false, status: 403, error: "Admin access only." };
  }

  return { ok: true, user: data.user };
}
