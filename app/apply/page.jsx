"use client";

import { useMemo, useState } from "react";

export default function ApplyPage() {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    show_name: "",
    show_website: "",
    rss_url: "",
    host_platform: "",
    publish_frequency: "Weekly",
    focus: "both",
    primary_topics: "",
    why_join: "",
    path: "partner",
    stats_proof_url: "",
  });

  const canSubmit = useMemo(() => {
    return (
      form.full_name.trim() &&
      form.email.trim() &&
      form.show_name.trim() &&
      form.publish_frequency.trim() &&
      form.focus.trim() &&
      form.path.trim() &&
      form.why_join.trim().length >= 40
    );
  }, [form]);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setDone(false);

    if (!canSubmit) {
      setError(
        "Please complete all required fields (and write a bit more in the final answer)."
      );
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Submission failed.");

      setDone(true);
      setForm({
        full_name: "",
        email: "",
        show_name: "",
        show_website: "",
        rss_url: "",
        host_platform: "",
        publish_frequency: "Weekly",
        focus: "both",
        primary_topics: "",
        why_join: "",
        path: "partner",
        stats_proof_url: "",
      });
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-neutral-950 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.10),transparent_55%)]" />
      </div>

      <div className="mx-auto max-w-5xl px-5 py-16">
        <section className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur p-10">
          <span className="text-xs uppercase tracking-widest text-white/60">
            Barracks Media Network
          </span>

          <h1 className="mt-3 text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Apply to Join the Network
          </h1>

          <p className="mt-5 text-lg text-white/80 max-w-3xl leading-relaxed">
            We accept podcasts that do <span className="font-semibold text-white">one or both</span>:
            <br />
            <span className="font-semibold text-white">helping others</span> or{" "}
            <span className="font-semibold text-white">meaningful storytelling</span>.
          </p>

          <div className="mt-6 grid md:grid-cols-2 gap-4 text-sm text-white/75">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="font-semibold text-white">We’re for:</div>
              <ul className="mt-2 space-y-1">
                <li>• Education, transition, healing, leadership, faith</li>
                <li>• Lived experience, history, culture, real stories</li>
                <li>• Consistent publishing + quality standards</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="font-semibold text-white">We’re not for:</div>
              <ul className="mt-2 space-y-1">
                <li>• Political commentary / partisan platforms</li>
                <li>• Sales-first / marketing-first / funnel shows</li>
                <li>• Rage-bait, shock content, or “clout” plays</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-white/10 bg-white/[0.04] p-10">
          <h2 className="text-2xl font-bold text-white">Application</h2>
          <p className="mt-2 text-white/70">
            Submitting doesn’t guarantee acceptance. We review alignment, quality, and consistency.
          </p>

          {error ? (
            <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-100">
              {error}
            </div>
          ) : null}

          {done ? (
            <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-100">
              Application submitted. If it’s a fit, you’ll hear back with next steps.
            </div>
          ) : null}

          <form onSubmit={submit} className="mt-8 grid gap-5">
            <Field label="Your name" required>
              <input
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-white/20"
                placeholder="Full name"
              />
            </Field>

            <Field label="Email" required>
              <input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-white/20"
                placeholder="you@example.com"
                type="email"
              />
            </Field>

            <div className="grid md:grid-cols-2 gap-5">
              <Field label="Podcast name" required>
                <input
                  value={form.show_name}
                  onChange={(e) => setForm({ ...form, show_name: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-white/20"
                  placeholder="Show title"
                />
              </Field>

              <Field label="Website (optional)">
                <input
                  value={form.show_website}
                  onChange={(e) => setForm({ ...form, show_website: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-white/20"
                  placeholder="https://..."
                />
              </Field>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <Field label="RSS feed URL (optional)">
                <input
                  value={form.rss_url}
                  onChange={(e) => setForm({ ...form, rss_url: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-white/20"
                  placeholder="https://.../feed"
                />
              </Field>

              <Field label="Host platform (optional)">
                <input
                  value={form.host_platform}
                  onChange={(e) => setForm({ ...form, host_platform: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-white/20"
                  placeholder="Captivate, Buzzsprout, Spotify for Podcasters..."
                />
              </Field>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              <Field label="Publishing frequency" required>
                <select
                  value={form.publish_frequency}
                  onChange={(e) => setForm({ ...form, publish_frequency: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-white/20"
                >
                  <option>Weekly</option>
                  <option>Bi-weekly</option>
                  <option>Monthly</option>
                  <option>Seasonal</option>
                  <option>Inconsistent</option>
                </select>
              </Field>

              <Field label="Your show is mainly..." required>
                <select
                  value={form.focus}
                  onChange={(e) => setForm({ ...form, focus: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-white/20"
                >
                  <option value="helping">Helping others</option>
                  <option value="storytelling">Storytelling</option>
                  <option value="both">Both</option>
                </select>
              </Field>

              <Field label="Membership path" required>
                <select
                  value={form.path}
                  onChange={(e) => setForm({ ...form, path: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-white/20"
                >
                  <option value="partner">Network Partner (no RSS transfer)</option>
                  <option value="full">Full Member (RSS integrated)</option>
                </select>
              </Field>
            </div>

            <Field label="Primary topics (optional)">
              <input
                value={form.primary_topics}
                onChange={(e) => setForm({ ...form, primary_topics: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-white/20"
                placeholder="Leadership, transition, recovery, history, faith, etc."
              />
            </Field>

            <Field label="Stats proof link (optional)">
              <input
                value={form.stats_proof_url}
                onChange={(e) => setForm({ ...form, stats_proof_url: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-white/20"
                placeholder="Google Drive / Dropbox folder link"
              />
            </Field>

            <Field label="Why do you want to join Barracks Media Network?" required>
              <textarea
                value={form.why_join}
                onChange={(e) => setForm({ ...form, why_join: e.target.value })}
                className="w-full min-h-[140px] rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-white/20"
                placeholder="Who your show serves, what it stands for, and why this network is a fit."
              />
            </Field>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex items-center justify-center rounded-full bg-white px-8 py-3 font-extrabold text-black disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}

function Field({ label, required, children }) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <label className="text-sm font-semibold text-white">{label}</label>
        {required ? <span className="text-xs text-white/50">*</span> : null}
      </div>
      <div className="mt-2">{children}</div>
    </div>
  );
}
