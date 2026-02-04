"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseBrowser";

const STREAMYARD_LINK = "https://streamyard.com/mktvjvvtvn";

export default function PortalPage() {
  const [session, setSession] = useState(null);
  const [member, setMember] = useState(null);
  const [mode, setMode] = useState("login"); // login | signup
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const isAuthed = useMemo(() => !!session?.user?.id, [session]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session || null));

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession || null);
      setMember(null);
      setMsg("");
      setErr("");
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!isAuthed) return;

    (async () => {
      const userId = session.user.id;

      // Ensure member row exists
      const { data: existing, error: selErr } = await supabase
        .from("members")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (selErr) {
        setErr(selErr.message);
        return;
      }

      if (!existing) {
        const { error: insErr } = await supabase.from("members").insert({
          user_id: userId,
          name: name || session.user.email,
          role: "member",
          approved: false,
        });
        if (insErr) {
          setErr(insErr.message);
          return;
        }

        const { data: created } = await supabase
          .from("members")
          .select("*")
          .eq("user_id", userId)
          .maybeSingle();

        setMember(created || null);
      } else {
        setMember(existing);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthed, session?.user?.id]);

  async function handleAuth(e) {
    e.preventDefault();
    setLoading(true);
    setErr("");
    setMsg("");

    try {
      if (!email || !password) throw new Error("Enter email and password.");

      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMsg("Account created. Check your email if confirmation is required, then log in.");
        setMode("login");
        setPassword("");
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setMsg("Logged in.");
    } catch (e2) {
      setErr(e2.message || "Auth error.");
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
  }

  return (
    <main className="relative overflow-hidden min-h-[70vh]">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-neutral-950 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.10),transparent_55%)]" />
      </div>

      <div className="mx-auto max-w-4xl px-5 py-16">
        <section className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur p-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-white">
            Network Portal
          </h1>
          <p className="mt-3 text-white/70">
            Member access for Barracks Media Network. Monthly meeting link, updates, and resources.
          </p>

          {err ? (
            <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-100">
              {err}
            </div>
          ) : null}
          {msg ? (
            <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-100">
              {msg}
            </div>
          ) : null}

          {!isAuthed ? (
            <div className="mt-8 grid md:grid-cols-2 gap-8">
              <div className="rounded-2xl border border-white/10 bg-black/30 p-6">
                <div className="flex gap-2">
                  <button
                    onClick={() => setMode("login")}
                    className={`rounded-full px-4 py-2 text-sm font-bold ${
                      mode === "login"
                        ? "bg-white text-black"
                        : "bg-white/10 text-white"
                    }`}
                  >
                    Log in
                  </button>
                  <button
                    onClick={() => setMode("signup")}
                    className={`rounded-full px-4 py-2 text-sm font-bold ${
                      mode === "signup"
                        ? "bg-white text-black"
                        : "bg-white/10 text-white"
                    }`}
                  >
                    Create account
                  </button>
                </div>

                <form onSubmit={handleAuth} className="mt-6 grid gap-4">
                  {mode === "signup" ? (
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-white/20"
                      placeholder="Name (optional)"
                    />
                  ) : null}

                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-white/20"
                    placeholder="Email"
                    type="email"
                  />
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-white/20"
                    placeholder="Password"
                    type="password"
                  />

                  <button
                    disabled={loading}
                    className="rounded-full bg-white px-6 py-3 font-extrabold text-black disabled:opacity-60"
                  >
                    {loading
                      ? "Working..."
                      : mode === "signup"
                      ? "Create account"
                      : "Log in"}
                  </button>
                </form>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/30 p-6 text-white/80">
                <div className="font-semibold text-white">Why the portal exists</div>
                <ul className="mt-3 space-y-2 text-sm">
                  <li>• Monthly network meeting access</li>
                  <li>• Member-only updates + resources</li>
                  <li>• Collaboration and promo swaps (coming next)</li>
                </ul>
                <p className="mt-4 text-xs text-white/55">
                  Approval is manual. Creating an account does not automatically grant membership benefits.
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-8 grid gap-6">
              <div className="rounded-2xl border border-white/10 bg-black/30 p-6 text-white">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm text-white/60">Signed in as</div>
                    <div className="text-lg font-bold">{session.user.email}</div>
                    <div className="mt-2 text-sm">
                      Status:{" "}
                      {member?.approved ? (
                        <span className="font-bold text-emerald-200">Approved Member</span>
                      ) : (
                        <span className="font-bold text-yellow-200">Pending Approval</span>
                      )}
                    </div>
                    {member?.role === "admin" ? (
                      <div className="mt-1 text-xs text-white/60">
                        Admin: you can review applications at <span className="text-white">/admin/applications</span>
                      </div>
                    ) : null}
                  </div>

                  <button
                    onClick={logout}
                    disabled={loading}
                    className="rounded-full bg-white px-5 py-2 font-extrabold text-black disabled:opacity-60"
                  >
                    Log out
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-white">
                <div className="text-sm text-white/60">Monthly Network Meeting (StreamYard)</div>
                <div className="mt-2 text-2xl font-extrabold">Same Link Every Month</div>

                <a
                  href={STREAMYARD_LINK}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center justify-center rounded-full bg-white px-8 py-3 font-extrabold text-black"
                >
                  Open StreamYard Link
                </a>

                <p className="mt-3 text-xs text-white/55">
                  Link: {STREAMYARD_LINK}
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
