"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseBrowser";

const DEFAULT_STREAMYARD = "https://streamyard.com/mktvjvvtvn";
const ADMIN_EMAIL = "ddunn@barracksmedia.com";

function formatDT(v) {
  try {
    return new Date(v).toLocaleString(undefined, {
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
      <main className="portal-scope">
        <div className="portal-bg" aria-hidden="true" />
        <div className="portal-wrap">
          <div className="portal-card">
            <div className="portal-kicker">Barracks Media Network</div>
            <h1 className="portal-h1">Member Portal</h1>
            <p className="portal-sub">
              Sign in to access calls, webinar links, shared notes, and announcements.
            </p>

            <form onSubmit={sendMagicLink} className="portal-form">
              <label className="portal-label">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="portal-input"
                placeholder="you@example.com"
                type="email"
                autoComplete="email"
              />
              <div className="portal-help">We’ll email a magic link. No passwords.</div>

              {authErr ? <div className="portal-err">{authErr}</div> : null}
              {authMsg ? <div className="portal-ok">{authMsg}</div> : null}

              <button type="submit" className="portal-btn portal-btn-primary">
                Send Sign-In Link
              </button>
            </form>
          </div>
        </div>

        <style jsx global>{`
          /* ===== Portal hard reset (scoped) ===== */
          .portal-scope {
            position: relative;
            min-height: 100vh;
            color: #fff;
            isolation: isolate;
          }

          .portal-scope * {
            box-sizing: border-box;
          }

          .portal-scope a {
            color: inherit !important;
            text-decoration: none !important;
          }

          .portal-bg {
            pointer-events: none;
            position: absolute;
            inset: 0;
            z-index: 0;
            background: radial-gradient(
                1200px 600px at 20% 10%,
                rgba(255, 255, 255, 0.10),
                transparent 60%
              ),
              radial-gradient(900px 500px at 90% 20%, rgba(255, 255, 255, 0.08), transparent 60%),
              linear-gradient(to bottom, rgba(0, 0, 0, 0.78), rgba(0, 0, 0, 0.62), rgba(0, 0, 0, 0.8));
          }

          .portal-wrap {
            position: relative;
            z-index: 1;
            max-width: 1100px;
            margin: 0 auto;
            padding: 48px 20px;
          }

          .portal-card {
            border-radius: 28px;
            border: 1px solid rgba(255, 255, 255, 0.12);
            background: rgba(255, 255, 255, 0.06);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            box-shadow: 0 18px 40px rgba(0, 0, 0, 0.45);
            padding: 28px;
          }

          .portal-kicker {
            font-size: 12px;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            color: rgba(255, 255, 255, 0.7);
          }

          .portal-h1 {
            margin: 10px 0 0 0;
            font-size: 38px;
            line-height: 1.05;
            font-weight: 900;
            letter-spacing: -0.02em;
          }

          .portal-sub {
            margin-top: 10px;
            color: rgba(255, 255, 255, 0.75);
            font-size: 15px;
            line-height: 1.6;
          }

          .portal-form {
            margin-top: 18px;
            display: grid;
            gap: 12px;
          }

          .portal-label {
            font-weight: 800;
            font-size: 13px;
            color: rgba(255, 255, 255, 0.9);
          }

          .portal-input {
            width: 100%;
            border-radius: 14px;
            border: 1px solid rgba(255, 255, 255, 0.16);
            background: rgba(0, 0, 0, 0.25);
            padding: 12px 14px;
            color: #fff;
            outline: none;
          }

          .portal-input:focus {
            border-color: rgba(255, 255, 255, 0.28);
            box-shadow: 0 0 0 6px rgba(255, 255, 255, 0.08);
          }

          .portal-help {
            margin-top: -6px;
            font-size: 12px;
            color: rgba(255, 255, 255, 0.6);
          }

          .portal-btn {
            border-radius: 999px;
            padding: 12px 14px;
            font-weight: 900;
            cursor: pointer;
            border: 1px solid transparent;
          }

          .portal-btn-primary {
            background: #fff;
            color: #000;
          }

          .portal-btn-primary:hover {
            background: rgba(255, 255, 255, 0.9);
          }

          .portal-ok {
            border-radius: 14px;
            padding: 10px 12px;
            border: 1px solid rgba(52, 211, 153, 0.35);
            background: rgba(52, 211, 153, 0.12);
            color: rgba(236, 253, 245, 0.95);
            font-size: 13px;
          }

          .portal-err {
            border-radius: 14px;
            padding: 10px 12px;
            border: 1px solid rgba(248, 113, 113, 0.35);
            background: rgba(248, 113, 113, 0.12);
            color: rgba(254, 242, 242, 0.95);
            font-size: 13px;
          }

          @media (max-width: 640px) {
            .portal-h1 {
              font-size: 30px;
            }
            .portal-card {
              padding: 20px;
            }
          }
        `}</style>
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
    <main className="portal-scope">
      <div className="portal-bg" aria-hidden="true" />

      <div className="portal-wrap">
        {/* HEADER */}
        <section className="portal-card portal-header">
          <div className="portal-header-top">
            <div>
              <div className="portal-kicker">Barracks Media Network</div>
              <h1 className="portal-h1">Member Portal</h1>
              <div className="portal-sub">Simple place for your next call + your notes.</div>
              <div className="portal-chiprow">
                <span className="portal-chip">
                  Signed in as <b>{session?.user?.email}</b>
                </span>
                {isAdmin ? <span className="portal-chip">Admin</span> : null}
              </div>
            </div>

            <div className="portal-actions">
              {isAdmin ? (
                <div className="portal-admin">
                  <button
                    onClick={() => setAdminOpen((v) => !v)}
                    className="portal-btn portal-btn-white"
                    type="button"
                  >
                    Admin
                  </button>

                  {adminOpen ? (
                    <div className="portal-menu">
                      <a href="/admin/events" onClick={() => setAdminOpen(false)}>
                        Manage Events
                      </a>
                      <a href="/admin/announcements" onClick={() => setAdminOpen(false)}>
                        Manage Announcements
                      </a>
                    </div>
                  ) : null}
                </div>
              ) : null}

              <button onClick={signOut} className="portal-btn portal-btn-outline" type="button">
                Sign out
              </button>
            </div>
          </div>

          {(dataErr || authErr || authMsg) ? (
            <div className="portal-msgs">
              {dataErr ? <div className="portal-err">{dataErr}</div> : null}
              {authErr ? <div className="portal-err">{authErr}</div> : null}
              {authMsg ? <div className="portal-ok">{authMsg}</div> : null}
            </div>
          ) : null}
        </section>

        {/* GRID */}
        <div className="portal-grid">
          {/* LEFT */}
          <div className="portal-col">
            {/* NEXT CALL */}
            <section className="portal-card">
              <h2 className="portal-h2">Next Call</h2>
              <p className="portal-sub">
                Click <b>Join Live</b> when the call starts. After the call, use <b>Watch Replay</b>{" "}
                and <b>Resources</b>.
              </p>

              <div className="portal-inner">
                <div className="portal-evtitle">{selectedEvent?.title || "Monthly Network Call"}</div>
                <div className="portal-evtime">
                  {selectedEvent?.starts_at
                    ? formatDT(selectedEvent.starts_at)
                    : "Date/time will appear here once events are added."}
                </div>

                <div className="portal-btngrid">
                  <a className="portal-btn portal-btn-primary" href={eventLink} target="_blank" rel="noreferrer">
                    Join Live
                  </a>
                  <button className="portal-btn portal-btn-outline" onClick={() => copyToClipboard(eventLink)} type="button">
                    Copy Live Link
                  </button>

                  {replayLink ? (
                    <a className="portal-btn portal-btn-outline" href={replayLink} target="_blank" rel="noreferrer">
                      Watch Replay
                    </a>
                  ) : isPastEvent ? (
                    <div className="portal-pill">Replay pending</div>
                  ) : null}

                  {resourcesLink ? (
                    <a className="portal-btn portal-btn-outline" href={resourcesLink} target="_blank" rel="noreferrer">
                      Resources
                    </a>
                  ) : null}
                </div>

                <div className="portal-field">
                  <label className="portal-label">Choose an event</label>
                  <select
                    value={selectedEvent?.id ? String(selectedEvent.id) : ""}
                    onChange={(e) => setSelectedEventId(e.target.value)}
                    className="portal-select"
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
                  <div className="portal-help"></div>
                </div>
              </div>
            </section>

            {/* NOTES */}
            <section className="portal-card">
              <h2 className="portal-h2">Shared Notes</h2>
              <p className="portal-sub">Add decisions and action items while you’re on the call.</p>

              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="portal-textarea"
                placeholder="Add a note, decision, action item, or idea…"
              />

              <div className="portal-notesbar">
                <div className="portal-help"></div>
                <button onClick={addNote} disabled={savingNote} className="portal-btn portal-btn-primary" type="button">
                  {savingNote ? "Saving…" : "Add Note"}
                </button>
              </div>

              <div className="portal-list">
                {loadingData ? (
                  <div className="portal-muted">Loading…</div>
                ) : notes.length ? (
                  notes.map((n) => (
                    <div key={n.id} className="portal-item">
                      <div className="portal-itemtext">{n.content}</div>
                      <div className="portal-itemmeta">{n.created_at ? formatDT(n.created_at) : ""}</div>
                    </div>
                  ))
                ) : (
                  <div className="portal-muted">No notes yet. Add the first note after your next call.</div>
                )}
              </div>
            </section>
          </div>

          {/* RIGHT */}
          <aside className="portal-card portal-aside">
            <h2 className="portal-h2">Announcements</h2>
            <p className="portal-sub">Updates and reminders from the network.</p>

            <div className="portal-list">
              {loadingData ? (
                <div className="portal-muted">Loading…</div>
              ) : announcements.length ? (
                announcements.map((a) => (
                  <div key={a.id} className="portal-item">
                    <div className="portal-itemtitle">{a.title}</div>
                    {a.body ? <div className="portal-itembody">{a.body}</div> : null}
                    <div className="portal-itemmeta">{a.created_at ? formatDT(a.created_at) : ""}</div>
                  </div>
                ))
              ) : (
                <div className="portal-muted">No announcements yet. (Admins can add them from the Admin menu.)</div>
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* IMPORTANT: These styles are SCOPED to portal-scope so they can't break the rest of the site */}
      <style jsx global>{`
        .portal-scope {
          position: relative;
          min-height: 100vh;
          color: #fff;
          isolation: isolate;
        }

        .portal-bg {
          pointer-events: none;
          position: absolute;
          inset: 0;
          z-index: 0;
          background: radial-gradient(1200px 600px at 20% 10%, rgba(255, 255, 255, 0.10), transparent 60%),
            radial-gradient(900px 500px at 90% 20%, rgba(255, 255, 255, 0.08), transparent 60%),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.82), rgba(0, 0, 0, 0.62), rgba(0, 0, 0, 0.82));
        }

        .portal-wrap {
          position: relative;
          z-index: 1;
          max-width: 1100px;
          margin: 0 auto;
          padding: 44px 20px 60px;
        }

        .portal-card {
          border-radius: 26px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          box-shadow: 0 18px 44px rgba(0, 0, 0, 0.48);
          padding: 24px;
        }

        .portal-header {
          padding: 26px;
        }

        .portal-kicker {
          font-size: 12px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.68);
        }

        .portal-h1 {
          margin: 10px 0 0 0;
          font-size: 38px;
          line-height: 1.05;
          font-weight: 900;
          letter-spacing: -0.02em;
        }

        .portal-h2 {
          margin: 0;
          font-size: 22px;
          font-weight: 900;
          letter-spacing: -0.01em;
        }

        .portal-sub {
          margin-top: 10px;
          color: rgba(255, 255, 255, 0.74);
          font-size: 15px;
          line-height: 1.6;
        }

        .portal-chiprow {
          margin-top: 14px;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .portal-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 10px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          background: rgba(255, 255, 255, 0.06);
          color: rgba(255, 255, 255, 0.9);
          font-size: 12px;
          font-weight: 700;
        }

        .portal-header-top {
          display: flex;
          gap: 18px;
          align-items: flex-start;
          justify-content: space-between;
          flex-wrap: wrap;
        }

        .portal-actions {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .portal-admin {
          position: relative;
        }

        .portal-menu {
          position: absolute;
          right: 0;
          top: calc(100% + 8px);
          width: 220px;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
          padding: 8px;
          z-index: 50;
        }

        .portal-menu a {
          display: block;
          padding: 10px 10px;
          border-radius: 12px;
          font-weight: 800;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.92) !important;
        }

        .portal-menu a:hover {
          background: rgba(255, 255, 255, 0.10);
        }

        .portal-msgs {
          margin-top: 14px;
          display: grid;
          gap: 10px;
        }

        .portal-ok {
          border-radius: 14px;
          padding: 10px 12px;
          border: 1px solid rgba(52, 211, 153, 0.35);
          background: rgba(52, 211, 153, 0.12);
          color: rgba(236, 253, 245, 0.95);
          font-size: 13px;
        }

        .portal-err {
          border-radius: 14px;
          padding: 10px 12px;
          border: 1px solid rgba(248, 113, 113, 0.35);
          background: rgba(248, 113, 113, 0.12);
          color: rgba(254, 242, 242, 0.95);
          font-size: 13px;
        }

        .portal-grid {
          margin-top: 18px;
          display: grid;
          grid-template-columns: 1fr;
          gap: 18px;
        }

        .portal-col {
          display: grid;
          gap: 18px;
        }

        .portal-aside {
          height: fit-content;
        }

        @media (min-width: 1024px) {
          .portal-grid {
            grid-template-columns: 2fr 1fr;
            gap: 18px;
          }
          .portal-aside {
            position: sticky;
            top: 16px;
          }
        }

        .portal-inner {
          margin-top: 16px;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.10);
          background: rgba(0, 0, 0, 0.22);
          padding: 16px;
        }

        .portal-evtitle {
          font-weight: 900;
          font-size: 18px;
          letter-spacing: -0.01em;
        }

        .portal-evtime {
          margin-top: 6px;
          color: rgba(255, 255, 255, 0.68);
          font-size: 13px;
        }

        .portal-btngrid {
          margin-top: 14px;
          display: grid;
          grid-template-columns: 1fr;
          gap: 10px;
        }

        @media (min-width: 640px) {
          .portal-btngrid {
            grid-template-columns: 1fr 1fr;
          }
        }

        .portal-pill {
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          padding: 12px 14px;
          border: 1px solid rgba(255, 255, 255, 0.16);
          background: rgba(255, 255, 255, 0.06);
          font-weight: 900;
          color: rgba(255, 255, 255, 0.78);
          font-size: 13px;
        }

        .portal-field {
          margin-top: 14px;
          display: grid;
          gap: 8px;
        }

        .portal-label {
          font-weight: 900;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.9);
        }

        .portal-select,
        .portal-textarea,
        .portal-input {
          width: 100%;
          border-radius: 14px;
          border: 1px solid rgba(255, 255, 255, 0.16);
          background: rgba(0, 0, 0, 0.25);
          padding: 12px 14px;
          color: #fff;
          outline: none;
        }

        .portal-select:focus,
        .portal-textarea:focus,
        .portal-input:focus {
          border-color: rgba(255, 255, 255, 0.28);
          box-shadow: 0 0 0 6px rgba(255, 255, 255, 0.08);
        }

        .portal-textarea {
          min-height: 140px;
          resize: vertical;
        }

        .portal-help {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.58);
        }

        .portal-notesbar {
          margin-top: 12px;
          display: flex;
          gap: 12px;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
        }

        .portal-list {
          margin-top: 14px;
          display: grid;
          gap: 10px;
        }

        .portal-item {
          border-radius: 18px;
          border: 1px solid rgba(255, 255, 255, 0.10);
          background: rgba(0, 0, 0, 0.20);
          padding: 14px;
        }

        .portal-itemtitle {
          font-weight: 900;
          font-size: 14px;
        }

        .portal-itembody {
          margin-top: 8px;
          color: rgba(255, 255, 255, 0.78);
          font-size: 14px;
          line-height: 1.55;
        }

        .portal-itemtext {
          color: rgba(255, 255, 255, 0.88);
          font-size: 14px;
          line-height: 1.55;
        }

        .portal-itemmeta {
          margin-top: 8px;
          color: rgba(255, 255, 255, 0.55);
          font-size: 12px;
        }

        .portal-muted {
          color: rgba(255, 255, 255, 0.70);
          font-size: 14px;
        }

        .portal-btn {
          border-radius: 999px;
          padding: 12px 14px;
          font-weight: 900;
          cursor: pointer;
          border: 1px solid transparent;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          user-select: none;
        }

        .portal-btn-primary {
          background: #fff;
          color: #000 !important;
        }

        .portal-btn-primary:hover {
          background: rgba(255, 255, 255, 0.92);
        }

        .portal-btn-outline {
          border-color: rgba(255, 255, 255, 0.20);
          background: rgba(255, 255, 255, 0.06);
          color: rgba(255, 255, 255, 0.92) !important;
        }

        .portal-btn-outline:hover {
          background: rgba(255, 255, 255, 0.10);
        }

        .portal-btn-white {
          background: #fff;
          color: #000 !important;
        }

        .portal-btn-white:hover {
          background: rgba(255, 255, 255, 0.92);
        }

        /* kill any site-wide weird link styling inside portal */
        .portal-scope a:hover {
          text-decoration: underline !important;
          text-decoration-color: rgba(255, 255, 255, 0.35) !important;
        }

        @media (max-width: 640px) {
          .portal-h1 {
            font-size: 30px;
          }
          .portal-card {
            padding: 18px;
          }
          .portal-header {
            padding: 20px;
          }
        }
      `}</style>
    </main>
  );
}
