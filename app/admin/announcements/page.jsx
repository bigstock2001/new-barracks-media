"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseBrowser";

export default function AdminAnnouncementsPage() {
  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(true);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const [announcements, setAnnouncements] = useState([]);

  // Form state
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("Welcome to the Network Portal");
  const [body, setBody] = useState("");

  const isAuthed = !!session?.user?.id;
  const isEditing = useMemo(() => !!editingId, [editingId]);

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

  async function signOut() {
    await supabase.auth.signOut();
  }

  async function loadAnnouncements() {
    setLoading(true);
    setErr("");
    setMsg("");

    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      setErr(error.message);
      setAnnouncements([]);
      setLoading(false);
      return;
    }

    setAnnouncements(data || []);
    setLoading(false);
  }

  useEffect(() => {
    if (!isAuthed) return;
    loadAnnouncements();
  }, [isAuthed]);

  function resetForm() {
    setEditingId(null);
    setTitle("Welcome to the Network Portal");
    setBody("");
  }

  function startEdit(a) {
    setErr("");
    setMsg("");
    setEditingId(a.id);
    setTitle(a.title || "");
    setBody(a.body || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function upsertAnnouncement(e) {
    e.preventDefault();
    setErr("");
    setMsg("");

    const cleanTitle = title.trim();
    if (!cleanTitle) {
      setErr("Title is required.");
      return;
    }

    const payload = {
      title: cleanTitle,
      body: body?.trim() || null,
    };

    setLoading(true);

    if (editingId) {
      const { error } = await supabase
        .from("announcements")
        .update(payload)
        .eq("id", editingId);

      if (error) {
        setLoading(false);
        setErr(
          error.message +
            " (If this says permission denied, you need an UPDATE policy for the announcements table.)"
        );
        return;
      }

      setMsg("Announcement updated.");
    } else {
      const { error } = await supabase.from("announcements").insert(payload);

      if (error) {
        setLoading(false);
        setErr(
          error.message +
            " (If this says permission denied, you need an INSERT policy for the announcements table.)"
        );
        return;
      }

      setMsg("Announcement posted.");
    }

    setLoading(false);
    resetForm();
    await loadAnnouncements();
  }

  async function deleteAnnouncement(id) {
    const ok = confirm("Delete this announcement? This cannot be undone.");
    if (!ok) return;

    setErr("");
    setMsg("");
    setLoading(true);

    const { error } = await supabase.from("announcements").delete().eq("id", id);

    if (error) {
      setLoading(false);
      setErr(
        error.message +
          " (If this says permission denied, you need a DELETE policy for the announcements table.)"
      );
      return;
    }

    setLoading(false);
    setMsg("Announcement deleted.");
    if (editingId === id) resetForm();
    await loadAnnouncements();
  }

  if (checking) {
    return (
      <main className="min-h-[70vh] flex items-center justify-center text-white/80">
        Loading…
      </main>
    );
  }

  if (!isAuthed) {
    return (
      <main className="min-h-[70vh] flex items-center justify-center text-white/80">
        Please sign in via{" "}
        <Link className="underline" href="/portal">
          /portal
        </Link>{" "}
        first.
      </main>
    );
  }

  return (
    <main className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-neutral-950 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.10),transparent_55%)]" />
      </div>

      <div className="mx-auto max-w-5xl px-5 py-14 text-white">
        <header className="flex flex-col gap-2">
          <h1 className="text-4xl font-extrabold">Admin: Announcements</h1>
          <p className="text-white/70">Post updates that appear on the member portal.</p>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
            <div className="text-white/70">
              Signed in as <span className="text-white/90">{session?.user?.email}</span>
            </div>
            <Link className="underline text-white/80 hover:text-white" href="/portal">
              Portal
            </Link>
            <Link className="underline text-white/80 hover:text-white" href="/admin/events">
              Admin: Events
            </Link>
            <button
              onClick={signOut}
              className="rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 font-semibold hover:bg-white/[0.10]"
            >
              Sign out
            </button>
          </div>
        </header>

        {(err || msg) && (
          <div className="mt-6 space-y-3">
            {err ? (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-100">
                {err}
              </div>
            ) : null}
            {msg ? (
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-100">
                {msg}
              </div>
            ) : null}
          </div>
        )}

        {/* FORM */}
        <section className="mt-10 rounded-3xl border border-white/10 bg-white/[0.05] backdrop-blur p-8">
          <h2 className="text-2xl font-bold">
            {isEditing ? "Edit Announcement" : "Post Announcement"}
          </h2>

          <form onSubmit={upsertAnnouncement} className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-semibold">Title *</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-white/20"
                placeholder="Welcome to the Network Portal"
              />
            </div>

            <div>
              <label className="text-sm font-semibold">Body (optional)</label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="mt-2 w-full min-h-[140px] rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-white/20"
                placeholder="What members need to know…"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-white px-6 py-3 font-extrabold text-black disabled:opacity-60"
              >
                {loading ? "Saving…" : isEditing ? "Update Announcement" : "Post Announcement"}
              </button>

              {isEditing ? (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-full border border-white/15 bg-white/[0.06] px-6 py-3 font-bold text-white hover:bg-white/[0.10]"
                >
                  Cancel
                </button>
              ) : null}

              <button
                type="button"
                onClick={loadAnnouncements}
                className="rounded-full border border-white/15 bg-white/[0.06] px-6 py-3 font-bold text-white hover:bg-white/[0.10]"
              >
                Refresh
              </button>
            </div>
          </form>
        </section>

        {/* LIST */}
        <section className="mt-10 rounded-3xl border border-white/10 bg-white/[0.05] backdrop-blur p-8">
          <h2 className="text-2xl font-bold">Existing Announcements</h2>

          <div className="mt-6 space-y-4">
            {loading ? (
              <div className="text-white/70 text-sm">Loading…</div>
            ) : announcements.length ? (
              announcements.map((a) => (
                <div
                  key={a.id}
                  className="rounded-2xl border border-white/10 bg-black/30 p-5"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                      <div className="text-lg font-bold text-white">{a.title}</div>
                      {a.body ? (
                        <div className="mt-2 text-sm text-white/80 whitespace-pre-wrap">
                          {a.body}
                        </div>
                      ) : null}
                      <div className="mt-2 text-xs text-white/55">
                        {a.created_at ? new Date(a.created_at).toLocaleString() : ""}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => startEdit(a)}
                        className="rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-sm font-bold text-white hover:bg-white/[0.10]"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteAnnouncement(a.id)}
                        className="rounded-full border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm font-bold text-red-100 hover:bg-red-500/15"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-white/70 text-sm">No announcements yet.</div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
