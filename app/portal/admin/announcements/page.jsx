"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseBrowser";

export default function AdminAnnouncementsPage() {
  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(true);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [okMsg, setOkMsg] = useState("");

  const [items, setItems] = useState([]);

  const [form, setForm] = useState({
    title: "",
    body: "",
  });

  useEffect(() => {
    let mounted = true;

    async function init() {
      setChecking(true);
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(data?.session ?? null);
      setChecking(false);
    }

    init();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession ?? null);
    });

    return () => {
      mounted = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  const token = session?.access_token || "";

  async function loadItems() {
    setLoading(true);
    setErr("");
    setOkMsg("");

    const res = await fetch("/api/admin/announcements", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (!res.ok) {
      setErr(data?.error || "Failed to load announcements.");
      setLoading(false);
      return;
    }

    setItems(data.data || []);
    setLoading(false);
  }

  useEffect(() => {
    if (!token) return;
    loadItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function createItem(e) {
    e.preventDefault();
    setErr("");
    setOkMsg("");

    if (!form.title.trim()) {
      setErr("Title is required.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/admin/announcements", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (!res.ok) {
      setErr(data?.error || "Failed to create announcement.");
      setLoading(false);
      return;
    }

    setOkMsg("Announcement posted.");
    setForm({ title: "", body: "" });
    await loadItems();
    setLoading(false);
  }

  async function deleteItem(id) {
    if (!confirm("Delete this announcement?")) return;

    setLoading(true);
    setErr("");
    setOkMsg("");

    const res = await fetch(`/api/admin/announcements?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (!res.ok) {
      setErr(data?.error || "Failed to delete announcement.");
      setLoading(false);
      return;
    }

    setOkMsg("Announcement deleted.");
    await loadItems();
    setLoading(false);
  }

  if (checking) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center text-white/80">
        Loading…
      </main>
    );
  }

  if (!session) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center text-white/80">
        Please sign in at <a className="underline" href="/portal">/portal</a> first.
      </main>
    );
  }

  return (
    <main className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-neutral-950 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.10),transparent_55%)]" />
      </div>

      <div className="mx-auto max-w-6xl px-5 py-14">
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-white">Admin — Announcements</h1>
            <p className="mt-2 text-white/70">Post updates shown in the portal.</p>
          </div>
          <a
            href="/portal"
            className="rounded-full border border-white/15 bg-white/[0.06] px-5 py-2 font-semibold text-white hover:bg-white/[0.10]"
          >
            Back to Portal
          </a>
        </header>

        {(err || okMsg) && (
          <div className="mt-6 space-y-3">
            {err ? (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-100">
                {err}
              </div>
            ) : null}
            {okMsg ? (
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-100">
                {okMsg}
              </div>
            ) : null}
          </div>
        )}

        <div className="mt-10 grid lg:grid-cols-2 gap-6">
          <section className="rounded-3xl border border-white/10 bg-white/[0.05] backdrop-blur p-8">
            <h2 className="text-2xl font-bold text-white">Post Announcement</h2>

            <form onSubmit={createItem} className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-semibold text-white">Title</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-white">Body (optional)</label>
                <textarea
                  value={form.body}
                  onChange={(e) => setForm({ ...form, body: e.target.value })}
                  className="mt-2 w-full min-h-[140px] rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-white/20"
                  placeholder="What should members know?"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-white px-6 py-3 font-extrabold text-black disabled:opacity-60"
              >
                {loading ? "Working…" : "Post Announcement"}
              </button>
            </form>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.05] backdrop-blur p-8">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-bold text-white">Existing</h2>
              <button
                onClick={loadItems}
                className="rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-white hover:bg-white/[0.10]"
              >
                Refresh
              </button>
            </div>

            <div className="mt-6 space-y-3">
              {loading ? (
                <div className="text-white/70 text-sm">Loading…</div>
              ) : items.length ? (
                items.map((a) => (
                  <div
                    key={a.id}
                    className="rounded-2xl border border-white/10 bg-black/30 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-white font-semibold">{a.title}</div>
                        {a.body ? (
                          <div className="mt-2 text-sm text-white/80 leading-relaxed">
                            {a.body}
                          </div>
                        ) : null}
                        <div className="mt-2 text-xs text-white/55">
                          {a.created_at ? new Date(a.created_at).toLocaleString() : ""}
                        </div>
                      </div>
                      <button
                        onClick={() => deleteItem(a.id)}
                        className="rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-white hover:bg-white/[0.10]"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-white/70 text-sm">No announcements yet.</div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
