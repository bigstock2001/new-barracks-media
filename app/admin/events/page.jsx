"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseBrowser";

const DEFAULT_STREAMYARD = "https://streamyard.com/mktvjvvtvn";
const ADMIN_EMAIL_ALLOWLIST = ["ddunn@barracksmedia.com"];

export const dynamic = "force-dynamic";

export default function AdminEventsPage() {
  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(true);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  const [events, setEvents] = useState([]);

  // form
  const [title, setTitle] = useState("");
  const [startsAt, setStartsAt] = useState(""); // datetime-local string
  const [streamyardUrl, setStreamyardUrl] = useState(DEFAULT_STREAMYARD);
  const [description, setDescription] = useState("");

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

  async function loadEvents() {
    setLoading(true);
    setErr("");
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("starts_at", { ascending: true })
        .limit(100);

      if (error) throw new Error(error.message);
      setEvents(data || []);
    } catch (e) {
      setErr(e?.message || "Failed to load events.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!isAdmin) return;
    loadEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  function toISO(localDatetime) {
    if (!localDatetime) return null;
    const d = new Date(localDatetime);
    if (Number.isNaN(d.getTime())) return null;
    return d.toISOString();
  }

  async function addEvent(e) {
    e.preventDefault();
    setErr("");
    setMsg("");

    const cleanTitle = title.trim();
    if (cleanTitle.length < 3) {
      setErr("Title is required (at least 3 characters).");
      return;
    }

    const iso = toISO(startsAt);

    setLoading(true);
    try {
      const { error } = await supabase.from("events").insert({
        title: cleanTitle,
        starts_at: iso,
        streamyard_url: (streamyardUrl || "").trim() || DEFAULT_STREAMYARD,
        description: description.trim() || null,
      });

      if (error) throw new Error(error.message);

      setTitle("");
      setStartsAt("");
      setStreamyardUrl(DEFAULT_STREAMYARD);
      setDescription("");
      setMsg("Event added.");
      await loadEvents();
    } catch (e2) {
      setErr(e2?.message || "Failed to add event.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteEvent(id) {
    if (!id) return;
    setErr("");
    setMsg("");
    setLoading(true);
    try {
      const { error } = await supabase.from("events").delete().eq("id", id);
      if (error) throw new Error(error.message);
      setMsg("Event deleted.");
      await loadEvents();
    } catch (e) {
      setErr(e?.message || "Failed to delete event.");
    } finally {
      setLoading(false);
    }
  }

  const sorted = useMemo(() => {
    return [...events].sort((a, b) => {
      const da = a?.starts_at ? new Date(a.starts_at).getTime() : 0;
      const db = b?.starts_at ? new Date(b.starts_at).getTime() : 0;
      return da - db;
    });
  }, [events]);

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
        <h1 className="text-2xl font-bold">Admin: Events</h1>
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
        <h1 className="text-2xl font-bold">Admin: Events</h1>
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
            <h1 className="text-3xl font-extrabold">Admin: Events</h1>
            <p className="mt-2 text-sm text-white/70">
              Create the StreamYard calls/webinars that members see in the portal.
            </p>
            <div className="mt-2 text-xs text-white/55">Signed in as {email}</div>
          </div>

          <div className="flex gap-4 text-sm">
            <Link className="underline text-white/80 hover:text-white" href="/portal">
              Portal
            </Link>
            <Link className="underline text-white/80 hover:text-white" href="/admin/announcements">
              Admin: Announcements
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
          <h2 className="text-xl font-bold">Add Event</h2>

          <form className="mt-6 grid gap-4" onSubmit={addEvent}>
            <div>
              <label className="text-sm font-semibold">Title *</label>
              <input
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-white/20"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Monthly Network Call"
              />
            </div>

            <div>
              <label className="text-sm font-semibold">Start date/time (optional)</label>
              <input
                type="datetime-local"
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-white/20"
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
              />
              <p className="mt-2 text-xs text-white/55">
                This will display in the portal dropdown and “Next session” area.
              </p>
            </div>

            <div>
              <label className="text-sm font-semibold">StreamYard URL</label>
              <input
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-white/20"
                value={streamyardUrl}
                onChange={(e) => setStreamyardUrl(e.target.value)}
                placeholder={DEFAULT_STREAMYARD}
              />
            </div>

            <div>
              <label className="text-sm font-semibold">Description (optional)</label>
              <textarea
                className="mt-2 w-full min-h-[110px] rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-white/20"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Agenda, theme, guest, reminders…"
              />
            </div>

            <button
              disabled={loading}
              className="w-full sm:w-auto rounded-full bg-white px-6 py-3 font-extrabold text-black disabled:opacity-60"
              type="submit"
            >
              {loading ? "Saving…" : "Add Event"}
            </button>
          </form>
        </section>

        <section className="mt-10 rounded-3xl border border-white/10 bg-white/[0.05] backdrop-blur p-8">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-bold">Existing Events</h2>
            <button className="text-sm underline text-white/70 hover:text-white" onClick={loadEvents}>
              Refresh
            </button>
          </div>

          {!loading && !sorted.length ? (
            <p className="mt-4 text-sm text-white/70">
              No events yet. Add your first one above.
            </p>
          ) : null}

          <div className="mt-6 space-y-3">
            {sorted.map((ev) => (
              <div key={ev.id} className="rounded-2xl border border-white/10 bg-black/30 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-bold text-white">{ev.title}</div>
                    <div className="mt-1 text-sm text-white/75">
                      {ev.starts_at ? new Date(ev.starts_at).toLocaleString() : "No date set"}
                    </div>

                    <div className="mt-2 text-sm">
                      <a
                        className="underline text-white/80 hover:text-white"
                        href={ev.streamyard_url || DEFAULT_STREAMYARD}
                        target="_blank"
                        rel="noreferrer"
                      >
                        StreamYard link
                      </a>
                    </div>

                    {ev.description ? (
                      <div className="mt-3 text-sm text-white/80 leading-relaxed">
                        {ev.description}
                      </div>
                    ) : null}
                  </div>

                  <button
                    onClick={() => deleteEvent(ev.id)}
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
