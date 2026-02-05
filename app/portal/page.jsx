"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseBrowser";

const DEFAULT_STREAMYARD = "https://streamyard.com/mktvjvvtvn";
const ADMIN_EMAIL = "ddunn@barracksmedia.com";

/**
 * UI GOAL:
 * - Works on your busy background image (high contrast)
 * - Looks modern (glass cards, clean spacing, no ugly full-width lines)
 * - No reliance on global link styles
 */
const cx = {
  page: "relative min-h-screen text-white",

  // Dark glass overlay so text is readable on ANY background
  overlay:
    "pointer-events-none absolute inset-0 bg-gradient-to-b from-black/80 via-black/65 to-black/80",

  wrap: "relative mx-auto max-w-6xl px-5 py-10 space-y-6",

  // Header glass card
  header:
    "rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.35)]",

  // Section cards
  card:
    "rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.30)]",
  cardTitle: "text-xl md:text-2xl font-extrabold tracking-tight text-white",
  cardSub: "mt-2 text-[15px] leading-relaxed text-white/75",

  // Inputs
  label: "text-sm font-semibold text-white/90",
  input:
    "mt-2 w-full rounded-xl border border-white/15 bg-black/25 px-4 py-3 text-white placeholder:text-white/45 outline-none focus:ring-4 focus:ring-white/10 focus:border-white/25",
  textarea:
    "mt-2 w-full min-h-[140px] rounded-xl border border-white/15 bg-black/25 px-4 py-3 text-white placeholder:text-white/45 outline-none focus:ring-4 focus:ring-white/10 focus:border-white/25",
  select:
    "mt-2 w-full rounded-xl border border-white/15 bg-black/25 px-4 py-3 text-white outline-none focus:ring-4 focus:ring-white/10 focus:border-white/25",

  // Buttons
  btnPrimary:
    "inline-flex items-center justify-center rounded-full bg-white text-black px-5 py-3 font-extrabold hover:bg-white/90 transition",
  btnSecondary:
    "inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 text-white px-5 py-3 font-bold hover:bg-white/10 transition",
  btnSmall:
    "inline-flex items-center justify-center rounded-full bg-white text-black px-4 py-2 text-sm font-extrabold hover:bg-white/90 transition",
  btnSmallOutline:
    "inline-flex items-center justify-center rounded-full border border-white/25 bg-transparent text-white px-4 py-2 text-sm font-bold hover:bg-white/10 transition",

  // Notice blocks
  msgOk: "rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-3 text-sm text-emerald-100",
  msgErr: "rounded-xl border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-100",

  // Item cards inside sections
  item: "rounded-xl border border-white/10 bg-black/20 p-4",
  itemTitle: "font-bold text-white",
  itemBody: "mt-2 text-[15px] leading-relaxed text-white/80",
  itemMeta: "mt-2 text-xs text-white/55",

  // Tiny chips
  chip:
    "inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-white/85",

  link: "text-white underline decoration-white/25 hover:decoration-white/70",
};

function formatDateTime(value) {
  try {
    return new Date(value).toLocaleString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

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
  const [selectedEventId, setSelectedEventId] = useState("");

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
      options: { emailRedirectTo: redirectTo },
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
    isAuthed && (session?.user?.email || "").toLowerCase() === ADMIN_EMAIL.toLowerCase();

  const upcomingEvents = useMemo(() => {
    return [...events].sort((a, b) => {
      const da = a?.starts_at ? new Date(a.starts_at).getTime() : 0;
      const db = b?.starts_at ? new Date(b.starts_at).getTime() : 0;
      return da - db;
    });
  }, [events]);

  const selectedEvent = useMemo(() => {
    if (!upcomingEvents.length) return null;
    if (!selectedEventId) return upcomingEvents[0];
    return upcomingEvents.find((e) => String(e.id) === String(selectedEventId)) || upcomingEvents[0];
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
            supabase.from("events").select("*").order("starts_at", { ascending: true }).limit(15),
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
    setAuthMsg("");
    setAuthErr("");
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

  // ---------- SIGNED OUT ----------
  if (!isAuthed) {
    return (
      <main className={cx.page}>
        <div className={cx.overlay} aria-hidden="true" />
        <div className={cx.wrap}>
          <section className={cx.card}>
            <div className="flex items-center justify-between gap-3">
              <div className="text-xs uppercase tracking-[0.18em] text-white/70">
                Barracks Media Network
              </div>
              <span className={cx.chip}>Members</span>
            </div>

            <h1 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              Member Portal of a crazy person listening to chat gpt
            </h1>
            <p className={cx.cardSub}>
              Sign in to access calls, webinar links, shared notes, and announcements.
            </p>

            <form onSubmit={sendMagicLink} className="mt-6 space-y-4">
              <div>
                <label className={cx.label}>Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={cx.input}
                  placeholder="you@example.com"
                  type="email"
                  autoComplete="email"
                />
                <p className="mt-2 text-xs text-white/60">We’ll email a magic link. No passwords.</p>
              </div>

              {authErr ? <div className={cx.msgErr}>{authErr}</div> : null}
              {authMsg ? <div className={cx.msgOk}>{authMsg}</div> : null}

              <button type="submit" className={cx.btnPrimary + " w-full"}>
                Send Sign-In Link
              </button>
            </form>
          </section>
        </div>
      </main>
    );
  }

  // ---------- SIGNED IN ----------
  const eventLink = selectedEvent?.streamyard_url || DEFAULT_STREAMYARD;
  const replayLink = selectedEvent?.replay_url || "";
  const resourcesLink = selectedEvent?.resources_url || "";

  const startsAtMs = selectedEvent?.starts_at ? new Date(selectedEvent.starts_at).getTime() : null;
  const isPastEvent = startsAtMs ? startsAtMs < Date.now() : false;

  return (
    <main className={cx.page}>
      <div className={cx.overlay} aria-hidden="true" />

      <div className={cx.wrap}>
        {/* HEADER */}
        <section className={cx.header}>
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.18em] text-white/65">
                Barracks Media Network
              </div>
              <h1 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                Member Portal
              </h1>
              <p className="mt-2 text-[15px] text-white/75">
                Simple place for your next call + your notes.
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className={cx.chip}>
                  Signed in as <span className="font-bold text-white">{session?.user?.email}</span>
                </span>
                {isAdmin ? <span className={cx.chip}>Admin</span> : null}
              </div>
            </div>

            <div className="flex items-center gap-2 md:justify-end">
              {isAdmin ? (
                <div className="relative">
                  <button
                    onClick={() => setAdminOpen((v) => !v)}
                    className={cx.btnSmall}
                    type="button"
                  >
                    Admin
                  </button>

                  {adminOpen ? (
                    <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-white/10 bg-black/70 backdrop-blur-xl p-2 shadow-[0_20px_40px_rgba(0,0,0,0.55)] z-50">
                      <a
                        className="block rounded-xl px-3 py-2 text-sm font-semibold text-white/90 hover:bg-white/10"
                        href="/admin/events"
                        onClick={() => setAdminOpen(false)}
                      >
                        Manage Events
                      </a>
                      <a
                        className="mt-1 block rounded-xl px-3 py-2 text-sm font-semibold text-white/90 hover:bg-white/10"
                        href="/admin/announcements"
                        onClick={() => setAdminOpen(false)}
                      >
                        Manage Announcements
                      </a>
                    </div>
                  ) : null}
                </div>
              ) : null}

              <button onClick={signOut} className={cx.btnSmallOutline} type="button">
                Sign out
              </button>
            </div>
          </div>

          {(dataErr || authErr || authMsg) ? (
            <div className="mt-5 space-y-2">
              {dataErr ? <div className={cx.msgErr}>{dataErr}</div> : null}
              {authErr ? <div className={cx.msgErr}>{authErr}</div> : null}
              {authMsg ? <div className={cx.msgOk}>{authMsg}</div> : null}
            </div>
          ) : null}
        </section>

        {/* GRID */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            {/* NEXT CALL */}
            <section className={cx.card}>
              <h2 className={cx.cardTitle}>Next Call</h2>
              <p className={cx.cardSub}>
                Click <b>Join Live</b> when the call starts. After the call, use{" "}
                <b>Watch Replay</b> and <b>Resources</b>.
              </p>

              <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-5">
                <div className="flex flex-col gap-1">
                  <div className="font-extrabold text-white text-lg tracking-tight">
                    {selectedEvent?.title || "Monthly Network Call"}
                  </div>
                  <div className="text-sm text-white/70">
                    {selectedEvent?.starts_at
                      ? formatDateTime(selectedEvent.starts_at)
                      : "Date/time will appear here once events are added."}
                  </div>
                </div>

                <div className="mt-5 grid sm:grid-cols-2 gap-3">
                  <a href={eventLink} target="_blank" rel="noreferrer" className={cx.btnPrimary}>
                    Join Live
                  </a>

                  <button
                    onClick={() => copyToClipboard(eventLink)}
                    className={cx.btnSecondary}
                    type="button"
                  >
                    Copy Live Link
                  </button>

                  {replayLink ? (
                    <a href={replayLink} target="_blank" rel="noreferrer" className={cx.btnSecondary}>
                      Watch Replay
                    </a>
                  ) : isPastEvent ? (
                    <div className="flex items-center justify-center rounded-xl border border-white/10 bg-white/5 p-3 text-sm font-semibold text-white/70">
                      Replay pending
                    </div>
                  ) : null}

                  {resourcesLink ? (
                    <a
                      href={resourcesLink}
                      target="_blank"
                      rel="noreferrer"
                      className={cx.btnSecondary}
                    >
                      Resources
                    </a>
                  ) : null}
                </div>

                <div className="mt-5">
                  <label className={cx.label}>Choose an event</label>
                  <select
                    value={selectedEvent?.id ? String(selectedEvent.id) : ""}
                    onChange={(e) => setSelectedEventId(e.target.value)}
                    className={cx.select}
                  >
                    {(upcomingEvents?.length
                      ? upcomingEvents
                      : [{ id: "", title: "Monthly Network Call" }]
                    ).map((ev) => (
                      <option key={ev.id || "default"} value={ev.id ? String(ev.id) : ""}>
                        {ev.title || "Monthly Network Call"}
                      </option>
                    ))}
                  </select>

                  <div className="mt-3 text-sm text-white/60">
                    Default StreamYard room is used until you add events.
                  </div>
                </div>
              </div>
            </section>

            {/* SHARED NOTES */}
            <section className={cx.card}>
              <h2 className={cx.cardTitle}>Shared Notes</h2>
              <p className={cx.cardSub}>Add decisions and action items while you’re on the call.</p>

              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className={cx.textarea}
                placeholder="Add a note, decision, action item, or idea…"
              />

              <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="text-sm text-white/60">Notes save to Supabase (members only).</div>
                <button
                  onClick={addNote}
                  disabled={savingNote}
                  className={cx.btnPrimary}
                  type="button"
                >
                  {savingNote ? "Saving…" : "Add Note"}
                </button>
              </div>

              <div className="mt-5 space-y-3">
                {loadingData ? (
                  <div className="text-white/70">Loading…</div>
                ) : notes.length ? (
                  notes.map((n) => (
                    <div key={n.id} className={cx.item}>
                      <div className="text-white/90">{n.content}</div>
                      <div className={cx.itemMeta}>
                        {n.created_at ? formatDateTime(n.created_at) : ""}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-white/70">No notes yet. Add the first note after your next call.</div>
                )}
              </div>
            </section>
          </div>

          {/* RIGHT: ANNOUNCEMENTS */}
          <aside className={cx.card + " lg:sticky lg:top-6 h-fit"}>
            <h2 className={cx.cardTitle}>Announcements</h2>
            <p className={cx.cardSub}>Updates and reminders from the network.</p>

            <div className="mt-4 space-y-4">
              {loadingData ? (
                <div className="text-white/70">Loading…</div>
              ) : announcements.length ? (
                announcements.map((a) => (
                  <div key={a.id} className={cx.item}>
                    <div className={cx.itemTitle}>{a.title}</div>
                    {a.body ? <div className={cx.itemBody}>{a.body}</div> : null}
                    <div className={cx.itemMeta}>
                      {a.created_at ? formatDateTime(a.created_at) : ""}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-white/70">
                  No announcements yet.{" "}
                  {isAdmin ? (
                    <>
                      Add them from <a className={cx.link} href="/admin/announcements">Manage Announcements</a>.
                    </>
                  ) : (
                    "(Admins can add them from the Admin menu.)"
                  )}
                </div>
              )}
            </div>
          </aside>
        </div>

        {/* Footer helper line */}
        <div className="pt-2 text-xs text-white/45">
          Need help? Email{" "}
          <a className={cx.link} href="mailto:ddunn@barracksmedia.com">
            ddunn@barracksmedia.com
          </a>
          .
        </div>
      </div>
    </main>
  );
}
