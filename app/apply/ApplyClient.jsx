"use client";

import { useMemo, useState } from "react";

export default function ApplyClient() {
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

  const requirements = useMemo(() => {
    const missing = [];

    // Base required for all paths
    if (!form.full_name.trim()) missing.push("Your name");
    if (!form.email.trim()) missing.push("Email");
    if (!form.show_name.trim()) missing.push("Podcast name");
    if (!form.publish_frequency.trim()) missing.push("Publishing frequency");
    if (!form.focus.trim()) missing.push("Show focus");
    if (!form.path.trim()) missing.push("Partnership path");

    const whyLen = form.why_join.trim().length;
    if (whyLen < 40) missing.push(`Why join (needs 40+ characters — currently ${whyLen})`);

    // Path-specific requirements
    if (form.path === "full") {
      const eps = Number(form.published_episodes || 0);
      const dl = Number(form.avg_downloads_30days || 0);

      if (!form.rss_url.trim()) missing.push("RSS feed URL");
      if (eps < 50) missing.push("Published episodes (50+ required)");
      if (dl < 50) missing.push("Avg downloads per episode in 30 days (50+ required)");
    }

    if (form.path === "independent") {
      if (!form.rss_url.trim()) missing.push("RSS feed URL");
      if (!form.manual_stats_reporting) missing.push("Manual stats reporting checkbox");
    }

    return {
      missing,
      canSubmit: missing.length === 0,
    };
  }, [form]);

  const canSubmit = requirements.canSubmit;

  async function submit(e) {
    e.preventDefault();
    setError("");
    setDone(false);

    if (!canSubmit) {
      setError("Please complete the required fields below before submitting.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      // Safe parse (handles HTML error pages too)
      const text = await res.text();
      let data = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = { error: text || "Non-JSON response from server." };
      }

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
      setError(err?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const pathLabel =
    form.path === "full" ? "Full Network Partner" : "Independent Network Partner";

  return (
    <main className="relative overflow-hidden">
      {/* APPLY-FINGERPRINT-0205 */}

      {/* FORCE thick, readable form controls on this page (beats global CSS) */}
      <style jsx global>{`
        main input,
        main select {
          height: 64px !important;
          font-size: 18px !important;
          line-height: 1.2 !important;
        }

        main textarea {
          min-height: 340px !important;
          font-size: 18px !important;
          line-height: 1.6 !important;
        }
      `}</style>

      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-neutral-950 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),transparent_55%)]" />
      </div>

      {/* Wider page wrap */}
      <div className="mx-auto max-w-[92rem] px-6 sm:px-8 lg:px-12 py-16 lg:py-20">
        {/* Hero */}
        <section className="rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur p-8 md:p-12">
          <span className="text-xs uppercase tracking-widest text-white/60">
            Barracks Media Network
          </span>

          {/* Funny H1 so you can confirm this file is deployed */}
          <h1 className="mt-3 text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            If you can read this, you’re on the right Apply page — and yes, we fired the “tiny font”
            guy.
          </h1>

          <h2 className="mt-4 text-xl md:text-2xl lg:text-3xl font-bold tracking-tight text-white/90">
            Apply to Join the Network
          </h2>

          <p className="mt-6 max-w-5xl text-base md:text-lg lg:text-xl text-white/80 leading-relaxed">
            The Barracks Media Network partners with creators who produce consistent, high-quality
            podcasts that serve communities through storytelling, education, and lived experience.
            Choose the partnership path that fits your show: full network integration, or an
            independent partnership while keeping your own RSS feed.
          </p>

          {/* Partnership selector */}
          <div className="mt-8 rounded-2xl border border-white/10 bg-slate-800/35 p-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-1">
                <div className="text-sm font-semibold text-white">
                  Choose your partnership path
                </div>
                <div className="text-sm text-white/65 leading-relaxed">
                  This selection updates the requirements section in the application form.
                </div>
              </div>

              <select
                value={form.path}
                onChange={(e) => setForm({ ...form, path: e.target.value })}
                className={cxSelect + " md:w-[520px]"}
              >
                <option value="full">Full Network Partner (RSS hosted by Barracks Media)</option>
                <option value="independent">Independent Network Partner (keep your RSS)</option>
              </select>
            </div>

            <div className="mt-3 text-xs text-white/55">
              Current selection:{" "}
              <span className="font-semibold text-white/80">{pathLabel}</span>
            </div>
          </div>
        </section>

        {/* Partnership cards */}
        <section className="mt-8 grid lg:grid-cols-2 gap-6">
          <PathCard
            title="Full Network Partner"
            subtitle="RSS hosted and distributed by Barracks Media. Full integration into network sponsorships and ad programs."
          >
            <InfoCard title="Eligibility Minimums">
              <ul className="space-y-2 text-white/75 leading-relaxed">
                <li>• Minimum <b>50 published episodes</b></li>
                <li>
                  • Minimum <b>50 downloads per episode</b> within <b>30 days</b>
                </li>
              </ul>
            </InfoCard>

            <InfoCard title="Benefits">
              <ul className="space-y-2 text-white/75 leading-relaxed">
                <li>• RSS hosted and distributed by Barracks Media</li>
                <li>• Eligible for network-wide sponsorships</li>
                <li>• Full integration into network ad programs</li>
              </ul>
            </InfoCard>

            <InfoCard title="Revenue Split">
              <div className="text-white/75 leading-relaxed">
                <b>70%</b> to creators / <b>30%</b> to Barracks Media
              </div>
            </InfoCard>

            <InfoCard title="Example Distribution">
              <div className="text-white/75 leading-relaxed">
                Example: $1,000 sponsorship → $300 Barracks Media, $700 split proportionally by
                episode downloads.
              </div>
            </InfoCard>
          </PathCard>

          <PathCard
            title="Independent Network Partner"
            subtitle="Keep your own RSS feed and provide manual stats reporting when requested. Limited sponsorship eligibility; option to upgrade later."
          >
            <InfoCard title="What stays yours">
              <ul className="space-y-2 text-white/75 leading-relaxed">
                <li>• You keep your RSS feed + hosting platform</li>
                <li>• You control publishing and distribution</li>
              </ul>
            </InfoCard>

            <InfoCard title="Requirements">
              <ul className="space-y-2 text-white/75 leading-relaxed">
                <li>• Manual stats reporting required (when requested)</li>
                <li>• Limited sponsorship eligibility</li>
                <li>• Option to upgrade later</li>
              </ul>
            </InfoCard>

            <InfoCard title="Revenue Split">
              <div className="text-white/75 leading-relaxed">
                <b>30%</b> to creator / <b>70%</b> to Barracks Media
              </div>
            </InfoCard>

            <InfoCard title="Upgrade Path">
              <div className="text-white/75 leading-relaxed">
                When your show reaches the Full Partner minimums, you can apply to upgrade.
              </div>
            </InfoCard>
          </PathCard>
        </section>

        {/* Sponsorship + payouts */}
        <section className="mt-8 grid lg:grid-cols-2 gap-6">
          <Card title="Sponsorships & Revenue Model">
            <p className="mt-3 text-white/75 leading-relaxed max-w-prose">
              Sponsorships are distributed according to partnership eligibility and the revenue split
              defined by each path. Full Network Partners are eligible for network-wide sponsorship
              programs. Independent partners may participate in limited sponsorship opportunities.
            </p>
          </Card>

          <Card title="Payout Rules">
            <ul className="mt-3 text-white/75 space-y-2 leading-relaxed">
              <li>
                • Minimum payout threshold: <b>$100</b>
              </li>
              <li>
                • Payouts issued on the <b>first of each month</b>
              </li>
              <li>• Earnings roll forward until threshold is met</li>
              <li>
                • Payments via <b>Stripe Connect (ACH only)</b> — no PayPal, no checks
              </li>
            </ul>
          </Card>
        </section>

        {/* Application */}
        <section className="mt-8 rounded-3xl border border-white/10 bg-slate-900/40 p-8 md:p-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Application</h2>
          <p className="mt-3 max-w-5xl text-white/70 leading-relaxed">
            Submit the form below. Depending on the partnership path you choose, the form will request
            the appropriate details for review.
          </p>

          {error ? (
            <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-100 leading-relaxed">
              {error}
            </div>
          ) : null}

          {done ? (
            <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-100 leading-relaxed">
              Application submitted. If it’s a fit, you’ll hear back with next steps.
            </div>
          ) : null}

          <form onSubmit={submit} className="mt-8 grid gap-7">
            {/* Basic Info */}
            <div className="rounded-2xl border border-white/10 bg-slate-800/40 p-6 space-y-5">
              <h3 className="text-lg md:text-xl font-semibold text-white">Basic Info</h3>

              <div className="grid md:grid-cols-2 gap-5">
                <Field label="Your name" required>
                  <input
                    value={form.full_name}
                    onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                    className={cxInput}
                    placeholder="Full name"
                    autoComplete="name"
                  />
                </Field>

                <Field label="Email" required>
                  <input
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={cxInput}
                    placeholder="you@example.com"
                    type="email"
                    autoComplete="email"
                  />
                </Field>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <Field label="Podcast name" required>
                  <input
                    value={form.show_name}
                    onChange={(e) => setForm({ ...form, show_name: e.target.value })}
                    className={cxInput}
                    placeholder="Show title"
                  />
                </Field>

                <Field label="Website (optional)">
                  <input
                    value={form.show_website}
                    onChange={(e) => setForm({ ...form, show_website: e.target.value })}
                    className={cxInput}
                    placeholder="https://..."
                    inputMode="url"
                  />
                </Field>
              </div>
            </div>

            {/* Podcast Details */}
            <div className="rounded-2xl border border-white/10 bg-slate-800/40 p-6 space-y-5">
              <h3 className="text-lg md:text-xl font-semibold text-white">Podcast Details</h3>

              <div className="grid md:grid-cols-2 gap-5">
                <Field label="RSS feed URL" required>
                  <input
                    value={form.rss_url}
                    onChange={(e) => setForm({ ...form, rss_url: e.target.value })}
                    className={cxInput}
                    placeholder="https://.../feed"
                    inputMode="url"
                  />
                </Field>

                <Field label="Host platform (optional)">
                  <input
                    value={form.host_platform}
                    onChange={(e) => setForm({ ...form, host_platform: e.target.value })}
                    className={cxInput}
                    placeholder="Captivate, Buzzsprout, Spotify for Podcasters..."
                  />
                </Field>
              </div>

              <div className="grid md:grid-cols-3 gap-5">
                <Field label="Publishing frequency" required>
                  <select
                    value={form.publish_frequency}
                    onChange={(e) => setForm({ ...form, publish_frequency: e.target.value })}
                    className={cxSelect}
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
                    className={cxSelect}
                  >
                    <option value="helping">Helping others</option>
                    <option value="storytelling">Storytelling</option>
                    <option value="both">Both</option>
                  </select>
                </Field>

                <Field label="Primary topics (optional)">
                  <input
                    value={form.primary_topics}
                    onChange={(e) => setForm({ ...form, primary_topics: e.target.value })}
                    className={cxInput}
                    placeholder="Leadership, transition, recovery, history, faith, etc."
                  />
                </Field>
              </div>
            </div>

            {/* Conditional */}
            {form.path === "full" ? (
              <div className="rounded-2xl border border-white/10 bg-slate-800/40 p-6 space-y-5">
                <h3 className="text-lg md:text-xl font-semibold text-white">
                  Full Network Requirements
                </h3>

                <div className="grid md:grid-cols-2 gap-5">
                  <Field label="Published episodes (total)" required>
                    <input
                      value={form.published_episodes}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          published_episodes: e.target.value.replace(/[^0-9]/g, ""),
                        })
                      }
                      className={cxInput}
                      placeholder="Number of published episodes"
                      inputMode="numeric"
                    />
                  </Field>

                  <Field label="Avg downloads per episode (30 days)" required>
                    <input
                      value={form.avg_downloads_30days}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          avg_downloads_30days: e.target.value.replace(/[^0-9]/g, ""),
                        })
                      }
                      className={cxInput}
                      placeholder="Average downloads in 30 days"
                      inputMode="numeric"
                    />
                  </Field>
                </div>

                <Field label="Stats proof link (optional)">
                  <input
                    value={form.stats_proof_url}
                    onChange={(e) => setForm({ ...form, stats_proof_url: e.target.value })}
                    className={cxInput}
                    placeholder="e.g., Google Drive / Dropbox folder link"
                    inputMode="url"
                  />
                </Field>
              </div>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-slate-800/40 p-6 space-y-5">
                <h3 className="text-lg md:text-xl font-semibold text-white">Reporting & Proof</h3>

                <Field label="I will provide manual stats reporting" required>
                  <label className="inline-flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={!!form.manual_stats_reporting}
                      onChange={(e) =>
                        setForm({ ...form, manual_stats_reporting: e.target.checked })
                      }
                      className="mt-1 h-5 w-5 rounded border-white/10 bg-black/40 text-white"
                    />
                    <span className="text-white/75 leading-relaxed">
                      Yes, I can provide manual stats reporting when requested.
                    </span>
                  </label>
                </Field>

                <Field label="Stats proof link (optional)">
                  <input
                    value={form.stats_proof_url}
                    onChange={(e) => setForm({ ...form, stats_proof_url: e.target.value })}
                    className={cxInput}
                    placeholder="Optional: link to reports or analytics"
                    inputMode="url"
                  />
                </Field>
              </div>
            )}

            {/* Why Join */}
            <div className="rounded-2xl border border-white/10 bg-slate-800/40 p-6 space-y-2">
              <Field label="Why do you want to join Barracks Media Network?" required>
                <textarea
                  value={form.why_join}
                  onChange={(e) => setForm({ ...form, why_join: e.target.value })}
                  className={cxTextarea}
                  placeholder="Who your show serves, what it stands for, and why this network is a fit. (40+ characters)"
                />
              </Field>
            </div>

            {/* Submit */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="text-sm md:text-base text-white/60 leading-relaxed max-w-4xl">
                Full Partner minimums: 50 episodes & 50 downloads/episode (30 days). Payouts monthly
                (min $100).
              </div>

              {!canSubmit ? (
                <div className="md:text-right">
                  <div className="text-sm text-white/70 font-semibold">
                    To enable Submit, complete:
                  </div>
                  <ul className="mt-2 text-sm text-white/60 space-y-1">
                    {requirements.missing.slice(0, 5).map((m) => (
                      <li key={m}>• {m}</li>
                    ))}
                    {requirements.missing.length > 5 ? (
                      <li>• …and {requirements.missing.length - 5} more</li>
                    ) : null}
                  </ul>
                </div>
              ) : (
                <div className="text-sm text-emerald-200/90 font-semibold">
                  ✅ Ready to submit
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !canSubmit}
                className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 font-extrabold text-black disabled:opacity-60"
              >
                {loading ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}

const cxInput =
  "w-full rounded-xl border border-white/10 bg-black/40 px-5 text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-white/20";
const cxSelect =
  "w-full rounded-xl border border-white/10 bg-black/40 px-5 text-white outline-none focus:ring-2 focus:ring-white/20";
const cxTextarea =
  "w-full rounded-xl border border-white/10 bg-black/40 px-5 py-5 text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-white/20 resize-y";

function Field({ label, required, children }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <label className="text-sm md:text-base font-semibold text-white">{label}</label>
        {required ? <span className="text-xs text-white/50">*</span> : null}
      </div>
      <div>{children}</div>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-8">
      <h2 className="text-2xl md:text-3xl font-bold text-white">{title}</h2>
      {children}
    </div>
  );
}

function PathCard({ title, subtitle, children }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-8">
      <h2 className="text-2xl md:text-3xl font-bold text-white">{title}</h2>
      <p className="mt-3 text-white/75 leading-relaxed">{subtitle}</p>
      <div className="mt-6 grid sm:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

function InfoCard({ title, children }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-800/35 p-5">
      <div className="text-sm font-semibold text-white">{title}</div>
      <div className="mt-3">{children}</div>
    </div>
  );
}
