"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseBrowser";

const ADMIN_EMAIL = "ddunn@barracksmedia.com";

export default function AdminAnnouncementsPage() {
  const router = useRouter();

  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(true);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  const [announcements, setAnnouncements] = useState([]);

  // Form state
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  // ---------- AUTH ----------
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

  const userEmail = session?.user?.email || "";
  const isAuthed = !!session?.user?.id;
  const isAdmin = isAuthed && userEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  useEffect(() => {
    if (!checking && !isAuthed) router.push("/portal");
  }, [checking, isAuthed, router]);

  // ---------- LOAD ----------
  async function loadAnnouncements() {
    setLoading(true);
    setErr("");
    try {
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw new Error(error.message);
      setAnnouncements(data || []);
    } catch (e) {
      setErr(e?.message || "Failed to load announcements.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!isAdmin) return;
    loadAnnouncements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setBody("");
    setMsg("");
    setErr("");
  }

  function startEdit(a) {
    setEditingId(a.id);
    setTitle(a.title || "");
    setBody(a.body || "");
    setMsg("");
    setErr("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveAnnouncement(e) {
    e.preventDefault();
    setErr("");
    setMsg("");

    const cleanTitle = title.trim();
    const cleanBody = body.trim();

    if (!cleanTitle) return setErr("Title is required.");
    if (!cleanBody) return setErr("Body is required.");

    setLoading(true);
    try {
      if (editingId) {
        const { error } = await supabase
          .from("announcements")
          .update({ title: cleanTitle, body: cleanBody })
          .eq("id", editingId);

        if (error) throw new Error(error.message);
        setMsg("Announcement updated.");
      } else {
        const { error } = await supabase.from("announcements").insert({
          title: cleanTitle,
          body: cleanBody,
        });

        if (error) throw new Error(error.message);
        setMsg("Announcement posted.");
      }

      await loadAnnouncements();
      resetForm();
    } catch (e2) {
      setErr(e2?.message || "Save failed.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteAnnouncement(id) {
    if (!confirm("Delete this announcement?")) return;
    setLoading(true);
    setErr("");
    setMsg("");
    try {
      const { error } = await supabase.from("announcements").delete().eq("id", id);
      if (error) throw new Error(error.message);
      setMsg("Announcement deleted.");
      await loadAnnouncements();
    } catch (e) {
      setErr(e?.message || "Delete failed.");
    } finally {
      setLoading(false);
    }
  }

  const sorted = useMemo(() => announcements, [announcements]);

  // ---------- UI ----------
  if (checking) {
    return (
      <main className="min-h-[70vh] flex items-center justify-center text-white/80">
        Loading…
      </main>
    );
  }

  if (!isAuthed) return null;

  if (!isAdmin) {
    return (
      <main className="min-h-[70vh] flex items-center justify-center px-6 text-center">
        <div className="max-w-md rounded-3xl border border-white/10 bg-white/[0.05] backdrop-blur p-8 text-white">
          <div className="text-xs uppercase tracking-widest text-white/60">Barracks Media Network</div>
          <h1 className="mt-3 text-2xl font-extrabold">Admin Only</h1>
          <p className="mt-3 text-white/70 text-sm">
            You’re signed in as <span className="text-white/90 font-semibold">{userEmail}</span>.
            This page is restricted to admins.
          </p>
          <Link
            href="/portal"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-white px-6 py-3 font-extrabold text-black"
          >
            Back to Portal
          </Link>
        </div>
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
            <div className="text-xs uppercase tracking-widest text-white/60">Admin</div>
            <h1 className="mt-2 text-4xl font-extrabold text-white">Announcements</h1>
            <p className="mt-2 text-white/70">
              Post network updates, reminders, wins, and call agendas.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/portal"
              className="rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-white hover:bg-white/[0.10]"
            >
              Back to Portal
            </Link>
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

        <div className="mt-10 grid lg:grid-cols-3 gap-6">
          {/* FORM */}
          <section className="lg:col-span-1 rounded-3xl border border-white/10 bg-white/[0.05] backdrop-blur p-8">
            <h2 className="text-2xl font-bold text-white">
              {editingId ? "Edit Post" : "New Announcement"}
            </h2>
            <p className="mt-2 text-white/70 text-sm">
              Keep it short. Most members skim.
            </p>

            <form onSubmit={saveAnnouncement} className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-semibold text-white">Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-white/20"
                  placeholder="Welcome to the Network Portal"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-white">Body</label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="mt-2 w-full min-h-[160px] rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-white/20"
                  placeholder="What members need to know…"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-white px-6 py-3 font-extrabold text-black disabled:opacity-60"
              >
                {loading ? "Saving…" : editingId ? "Save Changes" : "Post Announcement"}
              </button>

              {editingId ? (
                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full rounded-full border border-white/15 bg-white/[0.06] px-6 py-3 font-bold text-white hover:bg-white/[0.10]"
                >
                  Cancel Edit
                </button>
              ) : null}
            </form>
          </section>

          {/* LIST */}
          <section className="lg:col-span-2 rounded-3xl border border-white/10 bg-white/[0.05] backdrop-blur p-8">
            <h2 className="text-2xl font-bold text-white">Recent</h2>

            <div className="mt-6 space-y-3">
              {loading && !sorted.length ? (
                <div className="text-white/70 text-sm">Loading…</div>
              ) : sorted.length ? (
                sorted.map((a) => (
                  <div key={a.id} className="rounded-2xl border border-white/10 bg-black/30 p-5">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                      <div>
                        <div className="text-white font-extrabold text-lg">{a.title}</div>
                        {a.body ? (
                          <div className="mt-2 text-sm text-white/80 leading-relaxed whitespace-pre-wrap">
                            {a.body}
                          </div>
                        ) : null}
                        <div className="mt-3 text-xs text-white/55">
                          {a.created_at ? new Date(a.created_at).toLocaleString() : ""}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => startEdit(a)}
                          className="rounded-full bg-white px-4 py-2 text-sm font-extrabold text-black"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteAnnouncement(a.id)}
                          className="rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-bold text-red-100 hover:bg-red-500/15"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-white/10 bg-black/30 p-5 text-white/70 text-sm">
                  No announcements yet. Post your first one on the left.
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
