"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseBrowser";

const DEFAULT_STREAMYARD = "https://streamyard.com/mktvjvvtvn";

function toDateTimeLocalValue(isoString) {
  if (!isoString) return "";
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  // Convert to local datetime-local string (YYYY-MM-DDTHH:mm)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

function fromDateTimeLocalValue(localValue) {
  // localValue like "2026-03-08T19:00" (no timezone)
  if (!localValue) return null;
  const d = new Date(localValue);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

export default function AdminEventsPage() {
  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(true);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const [events, setEvents] = useState([]);

  // Form state
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("Monthly Network Call");
  const [startsAtLocal, setStartsAtLocal] = useState("");
  const [streamyardUrl, setStreamyardUrl] = useState(DEFAULT_STREAMYARD);
  const [description, setDescription] = useState("");

  const isAuthed = !!session?.user?.id;

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
    setMsg("");

    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("starts_at", { ascending: true, nullsFirst: false })
      .limit(50);

    if (error) {
      setErr(error.message);
      setEvents([]);
      setLoading(false);
      return;
    }

    setEvents(data || []);
    setLoading(false);
  }

  useEffect(() => {
    if (!isAuthed) return;
    loadEvents();
  }, [isAuthed]);

  const isEditing = useMemo(() => !!editingId, [editingId]);

  function resetForm() {
    setEditingId(null);
    setTitle("Monthly Network Call");
    setStartsAtLocal("");
    setStreamyardUrl(DEFAULT_STREAMYARD);
    setDescription("");
  }

  function startEdit(ev) {
    setErr("");
    setMsg("");
    setEditingId(ev.id);
    setTitle(ev.title || "");
    setStartsAtLocal(toDateTimeLocalValue(ev.starts_at));
    setStreamyardUrl(ev.streamyard_url || DEFAULT_STREAMYARD);
    setDescription(ev.description || "");
    // scroll to top so the edit form is visible
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function upsertEvent(e) {
    e.preventDefault();
    setErr("");
    setMsg("");

    const cleanTitle = title.trim();
    if (!cleanTitle) {
      setErr("Title is required.");
      return;
    }

    const cleanUrl = (streamyardUrl || "").trim() || DEFAULT_STREAMYARD;

    const payload = {
      title: cleanTitle,
      starts_at: fromDateTimeLocalValue(startsAtLocal),
      streamyard_url: cleanUrl,
      description: description?.trim() || null,
    };

    setLoading(true);

    if (editingId) {
      const { error } = await supabase.from("events").update(payload).eq("id", editingId);

      if (error) {
        setLoading(false);
        setErr(
          error.message +
            " (If this says permission denied, you need an UPDATE policy for the events table.)"
        );
        return;
      }

      setMsg("Event updated.");
    } else {
      const { error } = await supabase.from("events").insert(payload);

      if (error) {
        setLoading(false);
        setErr(
          error.message +
            " (If this says permission denied, you need an INSERT policy for the events table.)"
        );
        return;
      }

      setMsg("Event added.");
    }

    setLoading(false);
    resetForm();
    await loadEvents();
  }

  async function deleteEvent(id) {
    const ok = confirm("Delete this event? This cannot be undone.");
    if (!ok) return;

    setErr("");
    setMsg("");
    setLoading(true);

    const { error } = await supabase.from("events").delete().eq("id", id);

    if (error) {
      setLoading(false);
      setErr(
        error.message +
          " (If this says permission denied, you need a DELETE policy for the events table.)"
      );
      return;
    }

    setLoading(false);
    setMsg("Event deleted.");
    if (editingId === id) resetForm();
    await loadEvents();
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
          <h1 className="text-4xl font-extrabold">Admin: Events</h1>
          <p className="text-white/70">
            Create the StreamYard calls/webinars that members see in the portal.
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
            <div className="text-white/70">
              Signed in as <span className="text-white/90">{session?.user?.email}</span>
            </div>
            <Link className="underline text-white/80 hover:text-white" href="/portal">
              Portal
            </Link>
            <Link className="underline text-white/80 hover:text-white" href="/admin/announcements">
              Admin: Announcements
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
          <h2 className="text-2xl font-bold">{isEditing ? "Edit Event" : "Add Event"}</h2>
          <p className="mt-2 text-white/70 text-sm">
            This will display in the portal dropdown and “Next session” area.
          </p>

          <form onSubmit={upsertEvent} className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-semibold">Title *</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-white/20"
                placeholder="Monthly Network Call"
              />
            </div>

            <div>
              <label className="text-sm font-semibold">Start date/time (optional)</label>
              <input
                value={startsAtLocal}
                onChange={(e) => setStartsAtLocal(e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-white/20"
                type="datetime-local"
              />
              <div className="mt-1 text-xs text-white/55">
                Leave blank if it’s a general “always available” StreamYard room.
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold">StreamYard URL</label>
              <input
                value={streamyardUrl}
                onChange={(e) => setStreamyardUrl(e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-white/20"
                placeholder={DEFAULT_STREAMYARD}
              />
            </div>

            <div>
              <label className="text-sm font-semibold">Description (optional)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-2 w-full min-h-[120px] rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-white/20"
                placeholder="Agenda, theme, guest, reminders..."
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-white px-6 py-3 font-extrabold text-black disabled:opacity-60"
              >
                {loading ? "Saving…" : isEditing ? "Update Event" : "Add Event"}
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
                onClick={loadEvents}
                className="rounded-full border border-white/15 bg-white/[0.06] px-6 py-3 font-bold text-white hover:bg-white/[0.10]"
              >
                Refresh
              </button>
            </div>
          </form>
        </section>

        {/* LIST */}
        <section className="mt-10 rounded-3xl border border-white/10 bg-white/[0.05] backdrop-blur p-8">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-2xl font-bold">Existing Events</h2>
          </div>

          <div className="mt-6 space-y-4">
            {loading ? (
              <div className="text-white/70 text-sm">Loading…</div>
            ) : events.length ? (
              events.map((ev) => (
                <div
                  key={ev.id}
                  className="rounded-2xl border border-white/10 bg-black/30 p-5"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                      <div className="text-lg font-bold text-white">{ev.title}</div>

                      <div className="mt-1 text-sm text-white/70">
                        {ev.starts_at ? (
                          <>Starts: {new Date(ev.starts_at).toLocaleString()}</>
                        ) : (
                          <>No date set</>
                        )}
                      </div>

                      {ev.streamyard_url ? (
                        <a
                          href={ev.streamyard_url}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 inline-block text-sm underline text-white/80 hover:text-white"
                        >
                          StreamYard link
                        </a>
                      ) : null}

                      {ev.description ? (
                        <div className="mt-3 text-sm text-white/80 whitespace-pre-wrap">
                          {ev.description}
                        </div>
                      ) : null}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => startEdit(ev)}
                        className="rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-sm font-bold text-white hover:bg-white/[0.10]"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteEvent(ev.id)}
                        className="rounded-full border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm font-bold text-red-100 hover:bg-red-500/15"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-white/70 text-sm">
                No events yet. Add your first event above.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
