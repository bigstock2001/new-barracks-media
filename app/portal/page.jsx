"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseBrowser";

const DEFAULT_STREAMYARD = "https://streamyard.com/mktvjvvtvn";
const ADMIN_EMAIL = "ddunn@barracksmedia.com";

const cx = {
  // Page overlay sits ON TOP of your site background image.
  // This is what makes text readable even with a busy image behind it.
  page: "relative min-h-screen text-slate-900",
  overlay:
    "absolute inset-0 bg-gradient-to-b from-emerald-50/95 via-emerald-50/90 to-emerald-50/95",
  wrap: "relative mx-auto max-w-6xl px-5 py-12 space-y-6",

  // Big, calm header area
  header:
    "rounded-3xl border border-emerald-200/70 bg-emerald-100/80 p-6 shadow-sm",

  // Separate cards for each section
  card:
    "rounded-2xl border border-emerald-200/70 bg-emerald-100/70 p-6 shadow-sm",
  cardTitle: "text-xl md:text-2xl font-extrabold text-emerald-950",
  cardSub: "mt-2 text-[15px] leading-relaxed text-emerald-900",

  // Inputs
  label: "text-sm font-semibold text-emerald-950",
  input:
    "mt-2 w-full rounded-xl border border-emerald-200 bg-white px-4 py-3 text-slate-900 outline-none focus:ring-4 focus:ring-emerald-200/60",
  textarea:
    "mt-2 w-full min-h-[120px] rounded-xl border border-emerald-200 bg-white px-4 py-3 text-slate-900 outline-none focus:ring-4 focus:ring-emerald-200/60",
  select:
    "mt-2 w-full rounded-xl border border-emerald-200 bg-white px-4 py-3 text-slate-900 outline-none focus:ring-4 focus:ring-emerald-200/60",

  // Buttons (big, clear, consistent)
  btnPrimary:
    "inline-flex items-center justify-center rounded-full bg-emerald-700 px-5 py-3 font-extrabold text-white hover:bg-emerald-800 transition",
  btnSecondary:
    "inline-flex items-center justify-center rounded-full border border-emerald-300 bg-white px-5 py-3 font-bold text-emerald-950 hover:bg-emerald-50 transition",
  btnSmall:
    "inline-flex items-center justify-center rounded-full bg-emerald-700 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-800 transition",
  btnSmallOutline:
    "inline-flex items-center justify-center rounded-full border border-emerald-300 bg-white px-4 py-2 text-sm font-bold text-emerald-950 hover:bg-emerald-50 transition",

  // Links (kills the default blue)
  link:
    "text-emerald-800 underline decoration-emerald-400/40 hover:decoration-emerald-700",

  // Notes & announcement items
  item:
    "rounded-xl border border-emerald-200 bg-white p-4",
  itemTitle: "font-bold text-emerald-950",
  itemBody: "mt-2 text-[15px] leading-relaxed text-slate-900",
  itemMeta: "mt-2 text-xs text-emerald-700",

  // Messages
  msgOk: "rounded-xl border border-emerald-300 bg-emerald-100 p-3 text-sm text-emerald-950",
  msgErr: "rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-800",

  // Top right auth bar
  topbar: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3",
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

  // ---------- SIGNED OUT ----------
  if (!isAuthed) {
    return (
      <main className={cx.page}>
        <div className={cx.overlay} aria-hidden="true" />
        <div className={cx.wrap}>
          <section className={cx.card}>
            <div className="text-xs uppercase tracking-widest text-emerald-800">
              Barracks Media Network
            </div>
            <h1 className="mt-2 text-3xl md:text-4xl font-extrabold text-emerald-950">
              Member Portal
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
                />
                <p className="mt-2 text-xs text-emerald-900/80">
                  We’ll send a magic link. No passwords.
                </p>
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

  const startsAtMs = selectedEvent?.starts_at
    ? new Date(selectedEvent.starts_at).getTime()
    : null;
  const isPastEvent = startsAtMs ? startsAtMs < Date.now() : false;

  return (
    <>
      <main className={cx.page}>
        <div className={cx.overlay} aria-hidden="true" />

        <div className="portal-scope">
          <div className={cx.wrap}>
        {/* HEADER */}
        <section className={cx.header}>
          <div className="text-xs uppercase tracking-widest text-emerald-800">
            Barracks Media Network
          </div>

          <div className="mt-3 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-emerald-950">
                Member Portal
              </h1>
              <p className="mt-2 text-[15px] text-emerald-900">
                Simple place for your next call + your notes.
              </p>
            </div>

            <div className={cx.topbar}>
              <div className="text-sm text-emerald-950">
                Signed in as{" "}
                <span className="font-bold text-emerald-950">
                  {session?.user?.email}
                </span>
              </div>

              <div className="flex items-center gap-2">
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
                      <div className="absolute right-0 mt-2 w-56 rounded-xl border border-emerald-200 bg-white p-2 shadow-lg z-50">
                        <a
                          className={"block rounded-lg px-3 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-50"}
                          href="/admin/events"
                          onClick={() => setAdminOpen(false)}
                        >
                          Manage Events
                        </a>
                        <a
                          className={"mt-1 block rounded-lg px-3 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-50"}
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
          </div>

          {(dataErr || authErr || authMsg) ? (
            <div className="mt-4 space-y-2">
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
                Click <b>Join Live</b> when the call starts. After the call, use <b>Watch Replay</b> and <b>Resources</b>.
              </p>

              <div className="mt-5 rounded-xl border border-emerald-200 bg-white p-4">
                <div className="font-extrabold text-emerald-950 text-lg">
                  {selectedEvent?.title || "Monthly Network Call"}
                </div>
                <div className="mt-1 text-sm text-emerald-800">
                  {selectedEvent?.starts_at
                    ? new Date(selectedEvent.starts_at).toLocaleString()
                    : "Date/time will appear here once events are added."}
                </div>

                <div className="mt-4 grid sm:grid-cols-2 gap-3">
                  <a
                    href={eventLink}
                    target="_blank"
                    rel="noreferrer"
                    className={cx.btnPrimary}
                  >
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
                    <a
                      href={replayLink}
                      target="_blank"
                      rel="noreferrer"
                      className={cx.btnSecondary}
                    >
                      Watch Replay
                    </a>
                  ) : isPastEvent ? (
                    <div className="sm:col-span-1 text-sm font-semibold text-emerald-800 flex items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 p-3">
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
                    value={selectedEvent?.id || ""}
                    onChange={(e) => setSelectedEventId(e.target.value)}
                    className={cx.select}
                  >
                    {(upcomingEvents?.length
                      ? upcomingEvents
                      : [{ id: "", title: "Monthly Network Call" }]
                    ).map((ev) => (
                      <option key={ev.id || "default"} value={ev.id || ""}>
                        {ev.title || "Monthly Network Call"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-3 text-sm text-emerald-900/80">
                Default StreamYard room is used until you add events.
              </div>
            </section>

            {/* SHARED NOTES */}
            <section className={cx.card}>
              <h2 className={cx.cardTitle}>Shared Notes</h2>
              <p className={cx.cardSub}>
                Add decisions and action items while you’re on the call.
              </p>

              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className={cx.textarea}
                placeholder="Add a note, decision, action item, or idea…"
              />

              <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="text-sm text-emerald-900/80">
                  Notes save to Supabase (members only).
                </div>
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
                  <div className="text-emerald-900">Loading…</div>
                ) : notes.length ? (
                  notes.map((n) => (
                    <div key={n.id} className={cx.item}>
                      <div className="text-slate-900">{n.content}</div>
                      <div className={cx.itemMeta}>
                        {n.created_at ? new Date(n.created_at).toLocaleString() : ""}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-emerald-900/85">
                    No notes yet. Add the first note after your next call.
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* RIGHT: ANNOUNCEMENTS */}
          <aside className={cx.card}>
            <h2 className={cx.cardTitle}>Announcements</h2>
            <p className={cx.cardSub}>
              Updates and reminders from the network.
            </p>

            <div className="mt-4 space-y-4">
              {loadingData ? (
                <div className="text-emerald-900">Loading…</div>
              ) : announcements.length ? (
                announcements.map((a) => (
                  <div key={a.id} className={cx.item}>
                    <div className={cx.itemTitle}>{a.title}</div>
                    {a.body ? <div className={cx.itemBody}>{a.body}</div> : null}
                    <div className={cx.itemMeta}>
                      {a.created_at ? new Date(a.created_at).toLocaleString() : ""}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-emerald-900/85">
                  No announcements yet. (Admins can add them from the Admin menu.)
                </div>
              )}
            </div>
          </aside>
          </div>
        </div>
      </main>

      {isAuthed ? (
        <style jsx global>{`
  .portal-scope a {
    color: inherit;
    text-decoration: none;
  }

  .portal-scope section,
  .portal-scope div,
  .portal-scope main {
    border: none !important;
    background-clip: padding-box;
  }

  .portal-scope button {
    all: unset;
    display: inline-flex;
    cursor: pointer;
  }
`}</style>
      ) : null}
    </>
  );
}
