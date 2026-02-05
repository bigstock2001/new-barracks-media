"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseBrowser";

const DEFAULT_STREAMYARD = "https://streamyard.com/mktvjvvtvn";
const ADMIN_EMAIL = "ddunn@barracksmedia.com";

const ui = {
  pageBg:
    "min-h-screen bg-gradient-to-b from-[#0b0907] via-[#120e0b] to-[#070606] text-white",
  wrap: "mx-auto max-w-5xl px-5 py-14",
  headerCard:
    "rounded-3xl border border-white/10 bg-gradient-to-b from-[#241a14] via-[#1a1210] to-[#120d0b] shadow-[0_12px_40px_rgba(0,0,0,0.55)] p-8",
  card:
    "rounded-3xl border border-white/10 bg-gradient-to-b from-[#221814] via-[#17110e] to-[#120d0b] shadow-[0_10px_34px_rgba(0,0,0,0.45)] p-8",
  subCard:
    "rounded-2xl border border-white/10 bg-[#0f0b09]/75 p-5",
  label: "text-xs uppercase tracking-widest text-white/60",
  h1: "mt-2 text-4xl font-extrabold text-white",
  h2: "text-2xl font-bold text-white",
  p: "mt-2 text-[15px] leading-relaxed text-white/75",
  muted: "text-sm text-white/65 leading-relaxed",
  input:
    "mt-2 w-full rounded-xl border border-white/15 bg-[#0f0b09]/80 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-[#f3e7d6]/25",
  textarea:
    "w-full min-h-[110px] rounded-xl border border-white/15 bg-[#0f0b09]/80 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-[#f3e7d6]/25",
  btnPrimary:
    "inline-flex items-center justify-center rounded-full bg-[#f3e7d6] px-6 py-3 font-extrabold text-[#1a120e] hover:bg-[#f7eedf] transition",
  btnSecondary:
    "inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.06] px-6 py-3 font-bold text-white hover:bg-white/[0.10] transition",
  btnSmall:
    "rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-white hover:bg-white/[0.10] transition",
  linkWarm:
    "text-[#f3e7d6] underline decoration-white/20 hover:decoration-white/60",
};
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
  const [adminOpen, setAdminOpen] = useState(false);

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

    const redirectTo = `${window.location.origin}/portal`;

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
  const isAdmin =
    isAuthed &&
    (session?.user?.email || "").toLowerCase() === ADMIN_EMAIL.toLowerCase();

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
      <main className={ui.pageBg}>
        <div className={ui.wrap}>
          <section className={ui.headerCard}>
            <span className={ui.label}>Barracks Media Network</span>
            <h1 className={ui.h1}>Member Portal</h1>
            <p className={ui.p}>
              Sign in to access member notes, network calls, webinars, and updates.
            </p>

            <form onSubmit={sendMagicLink} className="mt-8 space-y-4">
              <div>
                <label className="text-sm font-semibold text-white">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={ui.input}
                  placeholder="you@example.com"
                  type="email"
                />
                <p className="mt-2 text-xs text-white/55">We’ll send a magic link. No passwords.</p>
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

              <button type="submit" className={`w-full ${ui.btnPrimary}`}>
                Send Sign-In Link
              </button>
            </form>
          </section>
        </div>
      </main>
    );
  }

  const eventLink = selectedEvent?.streamyard_url || DEFAULT_STREAMYARD;
  const replayLink = selectedEvent?.replay_url || "";
  const resourcesLink = selectedEvent?.resources_url || "";

  const startsAtMs = selectedEvent?.starts_at ? new Date(selectedEvent.starts_at).getTime() : null;
  const isPastEvent = startsAtMs ? startsAtMs < Date.now() : false;

  return (
    <main className={ui.pageBg}>
      <div className={ui.wrap}>
        <header className="mb-8">
          <div className={ui.headerCard}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <span className={ui.label}>Barracks Media Network</span>
                <h1 className={ui.h1}>Member Portal</h1>
                <p className={ui.p}>Join the next session and keep notes in one place.</p>
              </div>

              <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
                <div className="text-xs text-white/60">
                  Signed in as <span className="text-white/85">{session?.user?.email}</span>
                </div>

                <div className="flex items-center gap-2">
                  {isAdmin ? (
                    <div className="relative">
                      <button onClick={() => setAdminOpen(!adminOpen)} className={ui.btnSecondary}>
                        Admin
                      </button>

                      {adminOpen && (
                        <div className={`absolute right-0 mt-2 w-56 z-50 ${ui.subCard}`}>
                          <a href="/admin/events" onClick={() => setAdminOpen(false)} className={`${ui.btnSmall} w-full text-left`}>
                            Events
                          </a>
                          <a href="/admin/announcements" onClick={() => setAdminOpen(false)} className={`${ui.btnSmall} w-full text-left mt-2`}>
                            Announcements
                          </a>
                        </div>
                      )}
                    </div>
                  ) : null}

                  <button onClick={signOut} className={ui.btnSmall}>
                    Sign out
                  </button>
                </div>
              </div>
            </div>
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

        <div className="mt-8 grid lg:grid-cols-3 gap-8">
          {/* LEFT: EVENTS */}
          <section className={`${ui.card} lg:col-span-2`}>
            <h2 className={ui.h2}>Next Call</h2>
            <p className={ui.p}>Join the next session and keep notes in one place.</p>

            <div className="mt-8 grid md:grid-cols-2 gap-6">
              <div className={ui.subCard}>
                <div className="text-sm font-semibold text-white/80">Next Call</div>
                <div className="mt-3 text-white/90 font-bold text-lg leading-relaxed">
                  {selectedEvent?.title || "Monthly Network Call"}
                </div>
                <div className="mt-3 text-[15px] text-white/70 leading-relaxed">
                  {selectedEvent?.starts_at
                    ? new Date(selectedEvent.starts_at).toLocaleString()
                    : "Date/time will appear here once events are added."}
                </div>

                <div className="mt-6 flex flex-col gap-3">
                  <a href={eventLink} target="_blank" rel="noreferrer" className={`${ui.btnPrimary} w-full`}>
                    Join Live (StreamYard)
                  </a>

                  <button onClick={() => copyToClipboard(eventLink)} className={`${ui.btnSecondary} w-full`}>
                    Copy live link
                  </button>

                  {replayLink ? (
                    <a href={replayLink} target="_blank" rel="noreferrer" className={`${ui.btnSecondary} w-full`}>
                      Watch Replay
                    </a>
                  ) : isPastEvent ? (
                    <div className="w-full inline-flex items-center justify-center rounded-full border border-white/15 bg-[#120d0b]/80 px-6 py-3 text-sm font-semibold text-white/70">
                      Replay pending
                    </div>
                  ) : null}

                  {resourcesLink ? (
                    <a href={resourcesLink} target="_blank" rel="noreferrer" className={`${ui.btnSecondary} w-full`}>
                      Resources
                    </a>
                  ) : null}
                </div>

                <div className="mt-5 text-xs text-white/60 leading-relaxed">Tip: Join Live when the call starts. After, use Watch Replay and Resources.</div>
              </div>

              <div className={ui.subCard}>
                <div className="text-sm font-semibold text-white/80">Choose an event</div>
                <p className="mt-2 text-[15px] text-white/70 leading-relaxed">Pick from upcoming events here.</p>

                <select value={selectedEvent?.id || ""} onChange={(e) => setSelectedEventId(e.target.value)} className={ui.input}>
                  {(upcomingEvents?.length ? upcomingEvents : [{ id: "", title: "Monthly Network Call" }]).map((ev) => (
                    <option key={ev.id || "default"} value={ev.id || ""}>
                      {ev.title || "Monthly Network Call"}
                    </option>
                  ))}
                </select>

              </div>
            </div>

            {/* NOTES */}
            <div className="mt-10">
              <h3 className="text-xl font-bold text-white">Shared Notes</h3>
              <p className="mt-2 text-[15px] text-white/70 leading-relaxed">
                Members can add notes and action items from calls.
              </p>

              <div className={`mt-6 ${ui.subCard}`}>
                  <textarea value={noteText} onChange={(e) => setNoteText(e.target.value)} className={ui.textarea} placeholder="Add a note, decision, action item, or idea…" />
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div className="text-xs text-white/60">Notes save to Supabase (members only).</div>
                    <button onClick={addNote} disabled={savingNote} className={ui.btnPrimary}>{savingNote ? "Saving…" : "Add note"}</button>
                  </div>
                </div>

              <div className="mt-5 space-y-3">
                {loadingData ? (
                  <div className="text-white/70 text-[15px]">Loading…</div>
                ) : notes.length ? (
                  notes.map((n) => (
                    <div key={n.id} className={ui.subCard}>
                      <div className="text-white/90 text-[15px] leading-relaxed">{n.content}</div>
                      <div className="mt-2 text-xs text-white/60">{n.created_at ? new Date(n.created_at).toLocaleString() : ""}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-white/70 text-[15px]">No notes yet. Add the first note after your next call.</div>
                )}
              </div>
            </div>
          </section>

          {/* RIGHT: ANNOUNCEMENTS */}
          <aside className={ui.card}>
            <h2 className={ui.h2}>Announcements</h2>
            <p className={ui.p}>Network updates, member highlights, and reminders.</p>

            <div className="mt-8 space-y-4">
              {loadingData ? (
                <div className="text-white/70 text-[15px]">Loading…</div>
              ) : announcements.length ? (
                announcements.map((a) => (
                  <div key={a.id} className={ui.subCard}>
                    <div className="text-white font-semibold text-[15px]">{a.title}</div>
                    {a.body ? <div className="mt-3 text-[15px] text-white/80 leading-relaxed">{a.body}</div> : null}
                    <div className="mt-2 text-xs text-white/60">{a.created_at ? new Date(a.created_at).toLocaleString() : ""}</div>
                  </div>
                ))
              ) : (
                <div className={ui.subCard + " text-[15px] text-white/70"}>
                  No announcements yet.
                  <div className="mt-3 text-xs text-white/60">Next step: use the admin page to post updates here.</div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
