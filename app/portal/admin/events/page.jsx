"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseBrowser";

const ADMIN_EMAIL = "ddunn@barracksmedia.com";

export default function AdminEventsPage() {
  const router = useRouter();

  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(true);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  const [events, setEvents] = useState([]);

  // Form state
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [startsAtLocal, setStartsAtLocal] = useState(""); // yyyy-mm-ddThh:mm
  const [streamyardUrl, setStreamyardUrl] = useState("https://streamyard.com/mktvjvvtvn");

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

  // If not authed → send to portal
  useEffect(() => {
    if (!checking && !isAuthed) router.push("/portal");
  }, [checking, isAuthed, router]);

  // ---------- LOAD EVENTS ----------
  async function loadEvents() {
    setLoading(true);
    setErr("");
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("starts_at", { ascending: true })
        .limit(50);

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

  // ---------- HELPERS ----------
  function resetForm() {
    setEditingId(null);
    setTitle("");
    setStartsAtLocal("");
    setStreamyardUrl("https://streamyard.com/mktvjvvtvn");
    setMsg("");
    setErr("");
  }

  function toISOFromLocal(localValue) {
    // localValue like "2026-02-04T19:00"
    // Convert to Date (local time) then to ISO
    const d = new Date(localValue);
    if (Number.isNaN(d.getTime())) return null;
    return d.toISOString();
    // Stored as timestamptz ISO in Supabase
  }

  function toLocalInputValue(isoString) {
    if (!isoString) return "";
    const d = new Date(isoString);
    if (Number.isNaN(d.getTime())) return "";
    // format yyyy-mm-ddThh:mm in local time
    const pad = (n) => String(n).padStart(2, "0");
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const min = pad(d.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
  }

  function startEdit(ev) {
    setEditingId(ev.id);
    setTitle(ev.title || "");
    setStartsAtLocal(toLocalInputValue(ev.starts_at));
    setStreamyardUrl(ev.streamyard_url || "https://streamyard.com/mktvjvvtvn");
    setMsg("");
    setErr("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ---------- SAVE / DELETE ----------
  async function saveEvent(e) {
    e.preventDefault();
    setErr("");
    setMsg("");

    const cleanTitle = title.trim();
    const cleanUrl = streamyardUrl.trim();

    if (!cleanTitle) return setErr("Title is required.");
    if (!cleanUrl.startsWith("http")) return setErr("StreamYard URL must start with http(s).");
    if (!startsAtLocal) return setErr("Date/time is required.");

    const starts_at = toISOFromLocal(startsAtLocal);
    if (!starts_at) return setErr("Invalid date/time.");

    setLoading(true);
    try {
      if (editingId) {
        const { error } = await supabase
          .from("events")
          .update({
            title: cleanTitle,
            starts_at,
            streamyard_url: cleanUrl,
          })
          .eq("id", editingId);

        if (error) throw new Error(error.message);
        setMsg("Event updated.");
      } else {
        const { error } = await supabase.from("events").insert({
          title: cleanTitle,
          starts_at,
          streamyard_url: cleanUrl,
        });

        if (error) throw new Error(error.message);
        setMsg("Event created.");
      }

      await loadEvents();
      resetForm();
    } catch (e2) {
      setErr(e2?.message || "Save failed.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteEvent(id) {
    if (!confirm("Delete this event?")) return;
    setLoading(true);
    setErr("");
    setMsg("");
    try {
      const { error } = await supabase.from("events").delete().eq("id", id);
      if (error) throw new Error(error.message);
      setMsg("Event deleted.");
      await loadEvents();
    } catch (e) {
      setErr(e?.message || "Delete failed.");
    } finally {
      setLoading(false);
    }
  }

  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => {
      const da = a?.starts_at ? new Date(a.starts_at).getTime() : 0;
      const db = b?.starts_at ? new Date(b.starts_at).getTime() : 0;
      return da - db;
    });
  }, [events]);

  // ---------- UI ----------
  if (checking) {
    return (
      <main className="min-h-[70vh] flex items-center justify-center text-white/80">
        Loading…
      </main>
    );
  }

  if (!isAuthed) {
    return null; // we redirect to /portal
  }

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
            <h1 className="mt-2 text-4xl font-extrabold text-white">Manage Events</h1>
            <p className="mt-2 text-white/70">
              Create the monthly network call, webinars, and any special sessions.
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
              {editingId ? "Edit Event" : "Create Event"}
            </h2>
            <p className="mt-2 text-white/70 text-sm">
              These events populate the member dropdown on the portal.
            </p>

            <form onSubmit={saveEvent} className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-semibold text-white">Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-white/20"
                  placeholder="Monthly Network Call"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-white">Date & time</label>
                <input
                  value={startsAtLocal}
                  onChange={(e) => setStartsAtLocal(e.target.value)}
                  type="datetime-local"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-white/20"
                />
                <p className="mt-2 text-xs text-white/55">
                  This uses your local timezone for input. It will display in each member’s local time.
                </p>
              </div>

              <div>
                <label className="text-sm font-semibold text-white">StreamYard link</label>
                <input
                  value={streamyardUrl}
                  onChange={(e) => setStreamyardUrl(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-white/20"
                  placeholder="https://streamyard.com/..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-white px-6 py-3 font-extrabold text-black disabled:opacity-60"
              >
                {loading ? "Saving…" : editingId ? "Save Changes" : "Create Event"}
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
            <h2 className="text-2xl font-bold text-white">Events</h2>
            <p className="mt-2 text-white/70 text-sm">
              Tip: keep one event called “Monthly Network Call” and update the date each month.
            </p>

            <div className="mt-6 space-y-3">
              {loading && !sortedEvents.length ? (
                <div className="text-white/70 text-sm">Loading…</div>
              ) : sortedEvents.length ? (
                sortedEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="rounded-2xl border border-white/10 bg-black/30 p-5"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div>
                        <div className="text-white font-extrabold text-lg">{ev.title}</div>
                        <div className="mt-1 text-sm text-white/70">
                          {ev.starts_at ? new Date(ev.starts_at).toLocaleString() : "No date set"}
                        </div>
                        <div className="mt-2 text-xs text-white/55 break-all">
                          {ev.streamyard_url || "No StreamYard link"}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => startEdit(ev)}
                          className="rounded-full bg-white px-4 py-2 text-sm font-extrabold text-black"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteEvent(ev.id)}
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
                  No events yet. Create your first one on the left.
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
