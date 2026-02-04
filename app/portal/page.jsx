"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseBrowser";

const DEFAULT_STREAMYARD = "https://streamyard.com/mktvjvvtvn";

export default function PortalPage() {
  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(true);

  const [email, setEmail] = useState("");
  const [authMsg, setAuthMsg] = useState("");
  const [authErr, setAuthErr] = useState("");

  const [loadingData, setLoadingData] = useState(false);
  const [dataErr, setDataErr] = useState("");

  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [notes, setNotes] = useState([]);
  const [noteText, setNoteText] = useState("");
  const [savingNote, setSavingNote] = useState(false);

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

  async function sendMagicLink(e) {
    e.preventDefault();
    setAuthMsg("");
    setAuthErr("");

    const clean = email.trim();
    if (!clean || !clean.includes("@")) {
      setAuthErr("Enter a valid email address.");
      return;
    }

    const redirectTo =
      typeof window !== "undefined" ? `${window.location.origin}/portal` : undefined;

    const { error } = await supabase.auth.signInWithOtp({
      email: clean,
      options: {
        emailRedirectTo: redirectTo,
      },
    });

    if (error) {
      setAuthErr(error.message);
      return;
    }

    setAuthMsg("Check your email for the sign-in link.");
    setEmail("");
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  // ---------- DATA ----------
  const isAuthed = !!session?.user?.id;

  const upcomingEvents = useMemo(() => {
    // Sort ascending by starts_at if present
    const sorted = [...events].sort((a, b) => {
      const da = a?.starts_at ? new Date(a.starts_at).getTime() : 0;
      const db = b?.starts_at ? new Date(b.starts_at).getTime() : 0;
      return da - db;
    });
    return sorted;
  }, [events]);

  const selectedEvent = useMemo(() => {
    if (!upcomingEvents.length) return null;
    if (!selectedEventId) return upcomingEvents[0];
    return upcomingEvents.find((e) => e.id === selectedEventId) || upcomingEvents[0];
  }, [upcomingEvents, selectedEventId]);

  useEffect(() => {
    if (!isAuthed) return;

    async function load() {
      setLoadingData(true);
      setDataErr("");

      try {
        const [{ data: anns, error: annErr }, { data: evs, error: evErr }] =
          await Promise.all([
            supabase
              .from("announcements")
              .select("*")
              .order("created_at", { ascending: false })
              .limit(10),
            supabase
              .from("events")
              .select("*")
              .order("starts_at", { ascending: true })
              .limit(15),
          ]);

        if (annErr) throw new Error(`Announcements: ${annErr.message}`);
        if (evErr) throw new Error(`Events: ${evErr.message}`);

        setAnnouncements(anns || []);
        setEvents(evs || []);
      } catch (err) {
        setDataErr(
          err?.message ||
            "Could not load portal data. (If this is your first run, you may need to create the Supabase tables + RLS policies.)"
        );
      } finally {
        setLoadingData(false);
      }
    }

    load();
  }, [isAuthed]);

  useEffect(() => {
    if (!isAuthed) return;
    if (!selectedEvent?.id) {
      setNotes([]);
      return;
    }

    async function loadNotes() {
      setDataErr("");

      const { data, error } = await supabase
        .from("event_notes")
        .select("*")
        .eq("event_id", selectedEvent.id)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) {
        setDataErr(`Notes: ${error.message}`);
        setNotes([]);
        return;
      }

      setNotes(data || []);
    }

    loadNotes();
  }, [isAuthed, selectedEvent?.id]);

  async function addNote() {
    if (!selectedEvent?.id) return;
    const text = noteText.trim();
    if (text.length < 3) return;

    setSavingNote(true);
    setDataErr("");

    const { error } = await supabase.from("event_notes").insert({
      event_id: selectedEvent.id,
      content: text,
    });

    if (error) {
      setDataErr(error.message);
      setSavingNote(false);
      return;
    }

    setNoteText("");
    setSavingNote(false);

    // reload notes
    const { data, error: reloadErr } = await supabase
      .from("event_notes")
      .select("*")
      .eq("event_id", selectedEvent.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (reloadErr) {
      setDataErr(reloadErr.message);
      return;
    }
    setNotes(data || []);
  }

  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      setAuthMsg("Link copied.");
      setTimeout(() => setAuthMsg(""), 1200);
    } catch {
      setAuthErr("Could not copy link. (Browser blocked clipboard.)");
      setTimeout(() => setAuthErr(""), 2000);
    }
  }

  // ---------- UI ----------
  if (checking) {
    return (
      <main className="min-h-[70vh] flex items-center justify-center text-white/80">
        Loading portal…
      </main>
    );
  }

  if (!isAuthed) {
    return (
      <main className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-neutral-950 to-black" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),transparent_55%)]" />
        </div>

        <div className="mx-auto max-w-xl px-5 py-16">
          <section className="rounded-3xl border border-white/10 bg-white/[0.05] backdrop-blur p-10">
            <span className="text-xs uppercase tracking-widest text-white/60">
              Barracks Media Network
            </span>
            <h1 className="mt-3 text-3xl font-extrabold text-white">Member Portal</h1>
            <p className="mt-3 text-white/75">
              Sign in to access member notes, network calls, webinars, and updates.
            </p>

            <form onSubmit={sendMagicLink} className="mt-8 space-y-4">
              <div>
                <label className="text-sm font-semibold text-white">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-white/20"
                  placeholder="you@example.com"
                  type="email"
                />
                <p className="mt-2 text-xs text-white/55">
                  We’ll send a magic link. No passwords.
                </p>
              </div>

              {authErr ? (
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-100">
                  {authErr}
                </div>
              ) : null}

              {authMsg ? (
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-100">
                  {authMsg}
                </div>
              ) : null}

              <button
                type="submit"
                className="w-full rounded-full bg-white px-6 py-3 font-extrabold text-black"
              >
                Send Sign-In Link
              </button>
            </form>
          </section>
        </div>
      </main>
    );
  }

  const eventLink = selectedEvent?.streamyard_url || DEFAULT_STREAMYARD;

  return (
    <main className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-neutral-950 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.10),transparent_55%)]" />
      </div>

      <div className="mx-auto max-w-6xl px-5 py-14">
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-white/60">
              Barracks Media Network
            </span>
            <h1 className="mt-2 text-4xl font-extrabold text-white">Member Portal</h1>
            <p className="mt-2 text-white/70">
              Calls, webinars, shared notes, and network updates — all in one place.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs text-white/60">
              Signed in as <span className="text-white/85">{session?.user?.email}</span>
            </div>
            <button
              onClick={signOut}
              className="rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-white hover:bg-white/[0.10]"
            >
              Sign out
            </button>
          </div>
        </header>

        {(dataErr || authErr || authMsg) && (
          <div className="mt-6 space-y-3">
            {dataErr ? (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-100">
                {dataErr}
              </div>
            ) : null}

            {authErr ? (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-100">
                {authErr}
              </div>
            ) : null}

            {authMsg ? (
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-100">
                {authMsg}
              </div>
            ) : null}
          </div>
        )}

        <div className="mt-10 grid lg:grid-cols-3 gap-6">
          {/* LEFT: EVENTS */}
          <section className="lg:col-span-2 rounded-3xl border border-white/10 bg-white/[0.05] backdrop-blur p-8">
            <h2 className="text-2xl font-bold text-white">Upcoming Calls & Webinars</h2>
            <p className="mt-2 text-white/70">
              This is where members join live meetings and collaborate.
            </p>

            <div className="mt-6 grid md:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                <div className="text-sm font-semibold text-white">Next session</div>
                <div className="mt-2 text-white/90 font-bold text-lg">
                  {selectedEvent?.title || "Monthly Network Call"}
                </div>
                <div className="mt-2 text-sm text-white/70">
                  {selectedEvent?.starts_at
                    ? new Date(selectedEvent.starts_at).toLocaleString()
                    : "Date/time will appear here once events are added."}
                </div>

                <div className="mt-5 flex flex-col sm:flex-row gap-3">
                  <a
                    href={eventLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 font-extrabold text-black"
                  >
                    Join in StreamYard
                  </a>
                  <button
                    onClick={() => copyToClipboard(eventLink)}
                    className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.06] px-6 py-3 font-bold text-white hover:bg-white/[0.10]"
                  >
                    Copy link
                  </button>
                </div>

                <div className="mt-4 text-xs text-white/55">
                  Default link is set to your StreamYard room until you start creating events.
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                <div className="text-sm font-semibold text-white">Choose an event</div>
                <p className="mt-2 text-sm text-white/65">
                  If you add multiple webinars, members can switch here.
                </p>

                <select
                  value={selectedEvent?.id || ""}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  className="mt-4 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-white/20"
                >
                  {(upcomingEvents?.length ? upcomingEvents : [{ id: "", title: "Monthly Network Call" }]).map(
                    (ev) => (
                      <option key={ev.id || "default"} value={ev.id || ""}>
                        {ev.title || "Monthly Network Call"}
                      </option>
                    )
                  )}
                </select>

                <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/70">
                  <div className="font-semibold text-white">Next upgrades (we’ll build):</div>
                  <ul className="mt-2 space-y-1">
                    <li>• Event agendas</li>
                    <li>• Replays & resources</li>
                    <li>• RSVP and reminders</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* NOTES */}
            <div className="mt-8">
              <h3 className="text-xl font-bold text-white">Shared Notes</h3>
              <p className="mt-1 text-white/70 text-sm">
                Members can add notes and action items from calls.
              </p>

              <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-5">
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  className="w-full min-h-[110px] rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-white/20"
                  placeholder="Add a note, decision, action item, or idea…"
                />
                <div className="mt-3 flex items-center justify-between gap-3">
                  <div className="text-xs text-white/55">
                    Notes save to Supabase (members only).
                  </div>
                  <button
                    onClick={addNote}
                    disabled={savingNote}
                    className="rounded-full bg-white px-5 py-2 font-extrabold text-black disabled:opacity-60"
                  >
                    {savingNote ? "Saving…" : "Add note"}
                  </button>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {loadingData ? (
                  <div className="text-white/70 text-sm">Loading…</div>
                ) : notes.length ? (
                  notes.map((n) => (
                    <div
                      key={n.id}
                      className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                    >
                      <div className="text-white/90">{n.content}</div>
                      <div className="mt-2 text-xs text-white/55">
                        {n.created_at ? new Date(n.created_at).toLocaleString() : ""}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-white/65 text-sm">
                    No notes yet. Add the first note after your next call.
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* RIGHT: ANNOUNCEMENTS */}
          <aside className="rounded-3xl border border-white/10 bg-white/[0.05] backdrop-blur p-8">
            <h2 className="text-2xl font-bold text-white">Announcements</h2>
            <p className="mt-2 text-white/70 text-sm">
              Network updates, member highlights, and reminders.
            </p>

            <div className="mt-6 space-y-3">
              {loadingData ? (
                <div className="text-white/70 text-sm">Loading…</div>
              ) : announcements.length ? (
                announcements.map((a) => (
                  <div
                    key={a.id}
                    className="rounded-2xl border border-white/10 bg-black/30 p-4"
                  >
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
                ))
              ) : (
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white/70">
                  No announcements yet.
                  <div className="mt-2 text-xs text-white/55">
                    Next step: we’ll add an admin page so you can post updates here.
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
