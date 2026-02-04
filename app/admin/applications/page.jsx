"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseBrowser";

export default function AdminApplicationsPage() {
  const [session, setSession] = useState(null);
  const [member, setMember] = useState(null);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const isAdmin = useMemo(() => member?.role === "admin", [member]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session || null);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession || null);
      setMember(null);
      setApps([]);
      setErr("");
      setLoading(true);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }

    (async () => {
      setLoading(true);
      setErr("");

      const { data: m, error: mErr } = await supabase
        .from("members")
        .select("*")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (mErr) {
        setErr(mErr.message);
        setLoading(false);
        return;
      }
      setMember(m || null);

      // If admin, load applications
      const role = m?.role;
      if (role !== "admin") {
        setLoading(false);
        return;
      }

      const { data: a, error: aErr } = await supabase
        .from("applications")
        .select("*")
        .order("created_at", { ascending: false });

      if (aErr) {
        setErr(aErr.message);
        setLoading(false);
        return;
      }

      setApps(a || []);
      setLoading(false);
    })();
  }, [session?.user?.id]);

  async function updateStatus(id, status) {
    setErr("");
    const { error } = await supabase
      .from("applications")
      .update({ status })
      .eq("id", id);

    if (error) {
      setErr(error.message);
      return;
    }

    setApps((prev) => prev.map((x) => (x.id === id ? { ...x, status } : x)));
  }

  return (
    <main className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-neutral-950 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.10),transparent_55%)]" />
      </div>

      <div className="mx-auto max-w-6xl px-5 py-16">
        <section className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur p-10 text-white">
          <h1 className="text-3xl font-extrabold">Admin: Applications</h1>
          <p className="mt-2 text-white/70">
            Review incoming network applications.
          </p>

          {err ? (
            <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-100">
              {err}
            </div>
          ) : null}

          {!session?.user ? (
            <div className="mt-8 rounded-2xl border border-white/10 bg-black/30 p-6 text-white/80">
              You must be logged into the portal to access this page.
              <div className="mt-2 text-white/60">Go to /portal and log in.</div>
            </div>
          ) : loading ? (
            <div className="mt-8 text-white/70">Loading…</div>
          ) : !isAdmin ? (
            <div className="mt-8 rounded-2xl border border-white/10 bg-black/30 p-6 text-white/80">
              Access denied. Your account is not marked as admin.
            </div>
          ) : (
            <div className="mt-8 overflow-hidden rounded-2xl border border-white/10">
              <div className="grid grid-cols-12 bg-black/40 text-xs uppercase tracking-widest text-white/60 px-4 py-3">
                <div className="col-span-2">Status</div>
                <div className="col-span-3">Applicant</div>
                <div className="col-span-3">Show</div>
                <div className="col-span-2">Path</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>

              {apps.length === 0 ? (
                <div className="p-6 text-white/70">No applications yet.</div>
              ) : (
                apps.map((a) => (
                  <div
                    key={a.id}
                    className="grid grid-cols-12 gap-2 px-4 py-4 border-t border-white/10 bg-white/[0.03]"
                  >
                    <div className="col-span-2 font-bold">
                      {a.status}
                      <div className="text-xs text-white/50">
                        {new Date(a.created_at).toLocaleString()}
                      </div>
                    </div>

                    <div className="col-span-3">
                      <div className="font-semibold">{a.full_name}</div>
                      <div className="text-sm text-white/70">{a.email}</div>
                    </div>

                    <div className="col-span-3">
                      <div className="font-semibold">{a.show_name}</div>
                      <div className="text-sm text-white/70">
                        {a.host_platform || "—"} • {a.publish_frequency || "—"}
                      </div>
                      {a.show_website ? (
                        <a
                          className="text-xs underline text-white/70 hover:text-white"
                          href={a.show_website}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Website
                        </a>
                      ) : null}
                      {a.stats_proof_url ? (
                        <span className="text-xs text-white/50"> • </span>
                      ) : null}
                      {a.stats_proof_url ? (
                        <a
                          className="text-xs underline text-white/70 hover:text-white"
                          href={a.stats_proof_url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Stats Proof
                        </a>
                      ) : null}
                    </div>

                    <div className="col-span-2">
                      <div className="font-semibold">{a.path}</div>
                      <div className="text-sm text-white/70">{a.focus}</div>
                    </div>

                    <div className="col-span-2 flex justify-end gap-2">
                      <button
                        onClick={() => updateStatus(a.id, "reviewing")}
                        className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold hover:bg-white/15"
                      >
                        Review
                      </button>
                      <button
                        onClick={() => updateStatus(a.id, "accepted")}
                        className="rounded-full bg-emerald-500/20 px-4 py-2 text-sm font-bold hover:bg-emerald-500/30"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => updateStatus(a.id, "declined")}
                        className="rounded-full bg-red-500/20 px-4 py-2 text-sm font-bold hover:bg-red-500/30"
                      >
                        Decline
                      </button>
                    </div>

                    <div className="col-span-12 text-sm text-white/75 mt-2">
                      <div className="text-xs uppercase tracking-widest text-white/50">
                        Why join
                      </div>
                      <div className="mt-1">{a.why_join || "—"}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
