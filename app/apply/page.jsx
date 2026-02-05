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
    path: "full",
    stats_proof_url: "",
    published_episodes: "",
    avg_downloads_30days: "",
    manual_stats_reporting: false,
  });

  const canSubmit = useMemo(() => {
    const basic =
      form.full_name.trim() &&
      form.email.trim() &&
      form.show_name.trim() &&
      form.publish_frequency.trim() &&
      form.focus.trim() &&
      form.path.trim() &&
      form.why_join.trim().length >= 40;

    if (!basic) return false;

    if (form.path === "full") {
      const eps = Number(form.published_episodes || 0);
      const dl = Number(form.avg_downloads_30days || 0);
      return eps >= 50 && dl >= 50 && form.rss_url.trim();
    }

    if (form.path === "independent") {
      return form.rss_url.trim() && form.manual_stats_reporting === true;
    }

    return basic;
  }, [form]);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setDone(false);

    if (!canSubmit) {
      setError("Please complete all required fields and ensure the selected path-specific requirements are met.");
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
        path: "full",
        stats_proof_url: "",
        published_episodes: "",
        avg_downloads_30days: "",
        manual_stats_reporting: false,
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
          <span className="text-xs uppercase tracking-widest text-white/60">Barracks Media Network</span>

          <h1 className="mt-3 text-4xl md:text-5xl font-extrabold tracking-tight text-white">Apply to Join the Network</h1>

          <p className="mt-5 text-lg text-white/80 max-w-3xl leading-relaxed">
            The Barracks Media Network partners with creators who produce consistent, high-quality podcasts that serve communities through storytelling, education, and lived experience. Choose the partnership path that fits your show: full network integration, or an independent partnership while keeping your own RSS feed.
          </p>
        </section>

        <section className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h3 className="text-xl font-bold text-white">Full Network Partner</h3>
            <p className="mt-2 text-white/70">RSS hosted and distributed by Barracks Media. Full integration into network sponsorships and ad programs.</p>
            <ul className="mt-4 space-y-2 text-white/75">
              <li>• Minimum 50 published episodes</li>
              <li>• Minimum 50 downloads per episode within 30 days</li>
              <li>• RSS hosted and distributed by Barracks Media</li>
              <li>• Eligible for network-wide sponsorships</li>
              <li>• Revenue split: 70% to creators / 30% to Barracks Media</li>
            </ul>
            <div className="mt-4 text-sm text-white/70">Example: $1,000 sponsorship → $300 Barracks Media, $700 split proportionally by episode downloads.</div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h3 className="text-xl font-bold text-white">Independent Network Partner</h3>
            <p className="mt-2 text-white/70">Keep your own RSS feed and provide manual stats reporting when requested. Limited sponsorship eligibility; option to upgrade later.</p>
            <ul className="mt-4 space-y-2 text-white/75">
              <li>• Creator keeps their own RSS feed</li>
              <li>• Manual stats reporting required</li>
              <li>• Limited sponsorship eligibility</li>
              <li>• Revenue split: 30% to creator / 70% to Barracks Media</li>
              <li>• Option to upgrade to Full Network Partner later</li>
            </ul>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-8">
          <h2 className="text-2xl font-bold text-white">Sponsorships & Revenue Model</h2>
          <p className="mt-3 text-white/75">Sponsorships are distributed according to partnership eligibility and the revenue split defined by each path.</p>

          <h3 className="mt-6 text-lg font-semibold text-white">Payout Rules</h3>
          <ul className="mt-2 text-white/75 space-y-1">
            <li>• Minimum payout threshold: $100</li>
            <li>• Payouts issued on the first of each month</li>
            <li>• Earnings roll forward until threshold is met</li>
            <li>• Payments via Stripe Connect (ACH only) — No PayPal, no checks</li>
          </ul>
        </section>

        <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-10">
          <h2 className="text-2xl font-bold text-white">Application</h2>
          <p className="mt-2 text-white/70">Submit the form below. Depending on the partnership path you choose, the form will request the appropriate details for review.</p>

          {error ? (<div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-100">{error}</div>) : null}
          {done ? (<div className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-100">Application submitted. If it’s a fit, you’ll hear back with next steps.</div>) : null}

          <form onSubmit={submit} className="mt-8 grid gap-5">
            <Field label="Your name" required>
              <input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-white/20" placeholder="Full name" />
            </Field>

            <Field label="Email" required>
              <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-white/20" placeholder="you@example.com" type="email" />
            </Field>

            <div className="grid md:grid-cols-2 gap-5">
              <Field label="Podcast name" required>
                <input value={form.show_name} onChange={(e) => setForm({ ...form, show_name: e.target.value })} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-white/20" placeholder="Show title" />
              </Field>

              <Field label="Website (optional)">
                <input value={form.show_website} onChange={(e) => setForm({ ...form, show_website: e.target.value })} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-white/20" placeholder="https://..." />
              </Field>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <Field label="RSS feed URL" required>
                <input value={form.rss_url} onChange={(e) => setForm({ ...form, rss_url: e.target.value })} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-white/20" placeholder="https://.../feed" />
              </Field>

              <Field label="Host platform (optional)">
                <input value={form.host_platform} onChange={(e) => setForm({ ...form, host_platform: e.target.value })} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-white/20" placeholder="Captivate, Buzzsprout, Spotify for Podcasters..." />
              </Field>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              <Field label="Publishing frequency" required>
                <select value={form.publish_frequency} onChange={(e) => setForm({ ...form, publish_frequency: e.target.value })} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-white/20">
                  <option>Weekly</option>
                  <option>Bi-weekly</option>
                  <option>Monthly</option>
                  <option>Seasonal</option>
                  <option>Inconsistent</option>
                </select>
              </Field>

              <Field label="Your show is mainly..." required>
                <select value={form.focus} onChange={(e) => setForm({ ...form, focus: e.target.value })} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-white/20">
                  <option value="helping">Helping others</option>
                  <option value="storytelling">Storytelling</option>
                  <option value="both">Both</option>
                </select>
              </Field>

              <Field label="Partnership path" required>
                <select value={form.path} onChange={(e) => setForm({ ...form, path: e.target.value })} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-white/20">
                  <option value="full">Full Network Partner (RSS hosted by Barracks Media)</option>
                  <option value="independent">Independent Network Partner (keep your RSS)</option>
                </select>
              </Field>
            </div>

            <Field label="Primary topics (optional)">
              <input value={form.primary_topics} onChange={(e) => setForm({ ...form, primary_topics: e.target.value })} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-white/20" placeholder="Leadership, transition, recovery, history, faith, etc." />
            </Field>

            {form.path === "full" ? (
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                <div className="text-sm font-semibold text-white">Full Network Requirements</div>
                <p className="mt-2 text-white/70 text-sm">To qualify as a Full Network Partner you must meet the minima below. These metrics are used when reviewing migration to network-hosted RSS and sponsorship eligibility.</p>

                <div className="mt-4 grid md:grid-cols-2 gap-4">
                  <Field label="Published episodes (total)" required>
                    <input value={form.published_episodes} onChange={(e) => setForm({ ...form, published_episodes: e.target.value.replace(/[^0-9]/g, "") })} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-white/20" placeholder="Number of published episodes" inputMode="numeric" />
                  </Field>

                  <Field label="Avg downloads per episode (30 days)" required>
                    <input value={form.avg_downloads_30days} onChange={(e) => setForm({ ...form, avg_downloads_30days: e.target.value.replace(/[^0-9]/g, "") })} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-white/20" placeholder="Average downloads in 30 days" inputMode="numeric" />
                  </Field>
                </div>

                <Field label="Stats proof link (optional)">
                  <input value={form.stats_proof_url} onChange={(e) => setForm({ ...form, stats_proof_url: e.target.value })} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-white/20" placeholder="e.g., Google Drive / Dropbox folder link" />
                </Field>
              </div>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                <div className="text-sm font-semibold text-white">Independent Partner Details</div>
                <p className="mt-2 text-white/70 text-sm">Independent partners keep their RSS feed and must provide manual stats reporting when requested. Limited sponsorship eligibility applies; you may upgrade later.</p>

                <Field label="I will provide manual stats reporting" required>
                  <div className="flex items-center gap-3">
                    <label className="inline-flex items-center gap-2">
                      <input type="checkbox" checked={!!form.manual_stats_reporting} onChange={(e) => setForm({ ...form, manual_stats_reporting: e.target.checked })} className="h-4 w-4 rounded border-white/10 bg-black/40 text-white" />
                      <span className="text-white/75">Yes, I can provide manual stats reporting</span>
                    </label>
                  </div>
                </Field>

                <Field label="Stats proof link (optional)">
                  <input value={form.stats_proof_url} onChange={(e) => setForm({ ...form, stats_proof_url: e.target.value })} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-white/20" placeholder="Optional: link to reports or analytics" />
                </Field>
              </div>
            )}

            <Field label="Why do you want to join Barracks Media Network?" required>
              <textarea value={form.why_join} onChange={(e) => setForm({ ...form, why_join: e.target.value })} className="w-full min-h-[140px] rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-white/20" placeholder="Who your show serves, what it stands for, and why this network is a fit. (40+ characters)" />
            </Field>

            <div className="flex items-center gap-3">

              <div className="text-sm text-white/60">Minimums: Full Partner — 50 episodes & 50 downloads/ep (30d).</div>
            </div>
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
 
