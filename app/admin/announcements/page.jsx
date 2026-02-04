"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseBrowser";

const ADMIN_EMAIL_ALLOWLIST = ["ddunn@barracksmedia.com"];

export const dynamic = "force-dynamic";

export default function AdminAnnouncementsPage() {
  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(true);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  const [announcements, setAnnouncements] = useState([]);

  // form
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const isAuthed = !!session?.user?.id;
  const email = session?.user?.email || "";
  const isAdmin = isAuthed && ADMIN_EMAIL_ALLOWLIST.includes(email);

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
    try {
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

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

  async function addAnnouncement(e) {
    e.preventDefault();
    setErr("");
    setMsg("");

    const cleanTitle = title.trim();
    if (cleanTitle.length < 3) {
      setErr("Title is required (at least 3 characters).");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("announcements").insert({
        title: cleanTitle,
        body: body.trim() || null,
      });

      if (error) throw new Error(error.message);

      setTitle("");
      setBody("");
      setMsg("Announcement posted.");
      await loadAnnouncements();
    } catch (e2) {
      setErr(e2?.message || "Failed to post announcement.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteAnnouncement(id) {
    if (!id) return;
    setErr("");
    setMsg("");
    setLoading(true);
    try {
      const { error } = await supabase.from("announcements").delete().eq("id", id);
      if (error) throw new Error(error.message);
      setMsg("Announcement deleted.");
      await loadAnnouncements();
    } catch (e) {
      setErr(e?.message || "Failed to delete announcement.");
    } finally {
      setLoading(false);
    }
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
      <main className="mx-auto max-w-2xl px-5 py-14">
        <h1 className="text-2xl font-bold">Admin: Announcements</h1>
        <p className="mt-3 text-white/80">Sign in through the portal first.</p>
        <Link className="underline mt-4 inline-block text-white" href="/portal">
          Go to Portal Login
        </Link>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="mx-auto max-w-2xl px-5 py-14">
        <h1 className="text-2xl font-bold">Admin: Announcements</h1>
        <p className="mt-3 text-red-400">
          You are signed in as <b>{email}</b> but you are not authorized.
        </p>
        <div className="mt-6 flex gap-4">
          <Link className="underline text-white" href="/portal">
            Back to Portal
          </Link>
          <button className="underline text-white" onClick={signOut}>
            Sign out
          </button>
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

      <div className="mx-auto max-w-5xl px-5 py-12 text-white">
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold">Admin: Announcements</h1>
            <p className="mt-2 text-sm text-white/70">
              Post updates that show up in the Portal’s Announcements column.
            </p>
            <div className="mt-2 text-xs text-white/55">Signed in as {email}</div>
          </div>

          <div className="flex gap-4 text-sm">
            <Link className="underline text-white/80 hover:text-white" href="/portal">
              Portal
            </Link>
            <Link className="underline text-white/80 hover:text-white" href="/admin/events">
              Admin: Events
            </Link>
            <button className="underline text-white/80 hover:text-white" onClick={signOut}>
              Sign out
            </button>
          </div>
        </header>

        {(err || msg) && (
          <div className="mt-6 space-y-2">
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

        <section className="mt-10 rounded-3xl border border-white/10 bg-white/[0.05] backdrop-blur p-8">
          <h2 className="text-xl font-bold">Post Announcement</h2>

          <form className="mt-6 grid gap-4" onSubmit={addAnnouncement}>
            <div>
              <label className="text-sm font-semibold">Title *</label>
              <input
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-white/20"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Network update"
              />
            </div>

            <div>
              <label className="text-sm font-semibold">Body (optional)</label>
              <textarea
                className="mt-2 w-full min-h-[130px] rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-white/20"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Details, links, reminders…"
              />
            </div>

            <button
              disabled={loading}
              className="w-full sm:w-auto rounded-full bg-white px-6 py-3 font-extrabold text-black disabled:opacity-60"
              type="submit"
            >
              {loading ? "Posting…" : "Post Announcement"}
            </button>
          </form>
        </section>

        <section className="mt-10 rounded-3xl border border-white/10 bg-white/[0.05] backdrop-blur p-8">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-bold">Existing Announcements</h2>
            <button
              className="text-sm underline text-white/70 hover:text-white"
              onClick={loadAnnouncements}
            >
              Refresh
            </button>
          </div>

          {!loading && !announcements.length ? (
            <p className="mt-4 text-sm text-white/70">No announcements yet.</p>
          ) : null}

          <div className="mt-6 space-y-3">
            {announcements.map((a) => (
              <div key={a.id} className="rounded-2xl border border-white/10 bg-black/30 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-bold text-white">{a.title}</div>
                    {a.body ? (
                      <div className="mt-2 text-sm text-white/80 leading-relaxed">
                        {a.body}
                      </div>
                    ) : null}
                    <div className="mt-3 text-xs text-white/55">
                      {a.created_at ? new Date(a.created_at).toLocaleString() : ""}
                    </div>
                  </div>

                  <button
                    onClick={() => deleteAnnouncement(a.id)}
                    className="rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-white hover:bg-white/[0.10]"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
