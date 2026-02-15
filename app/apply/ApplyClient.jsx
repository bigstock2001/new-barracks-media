"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export default function ApplyClient() {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  // Keep agreement separate so we don’t break your Supabase schema.
  const [agreeTerms, setAgreeTerms] = useState(false);

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

    // Base required
    if (!form.full_name.trim()) missing.push("Your name");
    if (!form.email.trim()) missing.push("Email");
    if (!form.show_name.trim()) missing.push("Podcast name");
    if (!form.publish_frequency.trim()) missing.push("Publishing frequency");
    if (!form.focus.trim()) missing.push("Show focus");
    if (!form.path.trim()) missing.push("Partnership path");

    const whyLen = form.why_join.trim().length;
    if (whyLen < 40) missing.push(`Why join (needs 40+ characters — currently ${whyLen})`);

    // Path-specific (still enforced, but we don’t display the full rulebook here)
    if (form.path === "full") {
      const eps = Number(form.published_episodes || 0);
      const dl = Number(form.avg_downloads_30days || 0);
      if (!form.rss_url.trim()) missing.push("RSS feed URL");
      if (eps < 50) missing.push("Published episodes (50+ required)");
      if (dl < 50) missing.push("Avg downloads/episode (50+ required)");
    }

    if (form.path === "independent") {
      if (!form.rss_url.trim()) missing.push("RSS feed URL");
      if (!form.manual_stats_reporting) missing.push("Manual stats reporting checkbox");
    }

    if (!agreeTerms) missing.push("Agree to Terms (checkbox)");

    return {
      missing,
      canSubmit: missing.length === 0,
    };
  }, [form, agreeTerms]);

  const canSubmit = requirements.canSubmit;

  async function submit(e) {
    e.preventDefault();
    setError("");
    setDone(false);

    if (!canSubmit) {
      setError("Please complete the required items before submitting.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Don’t send agreeTerms to DB unless you’ve added the column.
        body: JSON.stringify(form),
      });

      const text = await res.text();
      let data = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = { error: text || "Non-JSON response from server." };
      }

      if (!res.ok) throw new Error(data?.error || "Submission failed.");

      setDone(true);
      setAgreeTerms(false);
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
      {/* APPLY-UI-REFRESH-0214 */}

      {/* Optional: keep controls readable */}
      <style jsx global>{`
        main input,
        main select {
          height: 56px !important;
          font-size: 16px !important;
          line-height: 1.2 !important;
        }
        main textarea {
          min-height: 220px !important;
          font-size: 16px !important;
          line-height: 1.6 !important;
        }
      `}</style>

      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-neutral-950 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.10),transparent_55%)]" />
      </div>

      <div className="mx-auto max-w-6xl px-6 sm:px-8 py-14 sm:py-16">
        {/* HERO */}
        <section className="rounded-3xl border border-white/10 bg-slate-900/45 backdrop-blur p-7 sm:p-10">
          <div className="flex flex-col gap-4 sm:gap-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs uppercase tracking-widest text-white/60">
                  Barracks Media Network
                </div>
                <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                  Apply to Join the Network
                </h1>
                <p className="mt-3 text-white/70 leading-relaxed max-w-2xl">
                  Submit your show for review. Choose the partnership path, then complete the
                  application. Requirements, payout rules, and terms live on the Terms page.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/apply/terms"
                  className="rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
                >
                  View Terms & Requirements
                </Link>
              </div>
            </div>

            {/* Path selector - simple + clean */}
            <div className="rounded-2xl border border-white/10 bg-slate-800/35 p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold text-white">Partnership path</div>
                  <div className="text-sm text-white/60">
                    This determines what details we need for review.
                  </div>
                </div>

                <select
                  value={form.path}
                  onChange={(e) => setForm({ ...form, path: e.target.value })}
                  className={cxSelect + " sm:w-[420px]"}
                >
                  <option value="full">Full Network Partner</option>
                  <option value="independent">Independent Network Partner</option>
                </select>
              </div>

              <div className="mt-3 text-xs text-white/55">
                Current selection:{" "}
                <span className="font-semibold text-white/80">{pathLabel}</span>
              </div>
            </div>
          </div>
        </section>

        {/* STATUS */}
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

        {/* FORM */}
        <form onSubmit={submit} className="mt-8 space-y-6">
          {/* Card 1: Basic */}
          <Card title="Basic Info" subtitle="Who you are and what your show is called.">
            <div className="grid sm:grid-cols-2 gap-5">
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

            <div className="grid sm:grid-cols-2 gap-5 mt-5">
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
          </Card>

          {/* Card 2: Podcast */}
          <Card title="Podcast Details" subtitle="Your feed, schedule, and topics.">
            <div className="grid sm:grid-cols-2 gap-5">
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

            <div className="grid sm:grid-cols-3 gap-5 mt-5">
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
                  placeholder="Leadership, recovery, history, faith…"
                />
              </Field>
            </div>
          </Card>

          {/* Card 3: Path-specific */}
          {form.path === "full" ? (
            <Card
              title="Performance Snapshot"
              subtitle="For Full Partners, we ask for a quick performance snapshot."
            >
              <div className="grid sm:grid-cols-2 gap-5">
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

              <div className="mt-5">
                <Field label="Stats proof link (optional)">
                  <input
                    value={form.stats_proof_url}
                    onChange={(e) => setForm({ ...form, stats_proof_url: e.target.value })}
                    className={cxInput}
                    placeholder="Optional: link to reports (Drive/Dropbox, etc.)"
                    inputMode="url"
                  />
                </Field>
              </div>
            </Card>
          ) : (
            <Card
              title="Reporting Agreement"
              subtitle="Independent Partners keep their RSS and provide manual stats reporting when requested."
            >
              <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/25 p-4">
                <input
                  type="checkbox"
                  checked={!!form.manual_stats_reporting}
                  onChange={(e) => setForm({ ...form, manual_stats_reporting: e.target.checked })}
                  className="mt-1 h-5 w-5 rounded border-white/10 bg-black/40 text-white"
                />
                <div>
                  <div className="font-semibold text-white">I can provide manual stats reporting</div>
                  <div className="text-sm text-white/60 leading-relaxed">
                    When requested, I can provide basic metrics for sponsorship verification.
                  </div>
                </div>
              </label>

              <div className="mt-5">
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
            </Card>
          )}

          {/* Card 4: Why Join */}
          <Card
            title="Why Join?"
            subtitle="Tell us who you serve, what your show stands for, and why this is a fit."
          >
            <Field label="Why do you want to join Barracks Media Network?" required>
              <textarea
                value={form.why_join}
                onChange={(e) => setForm({ ...form, why_join: e.target.value })}
                className={cxTextarea}
                placeholder="Who you serve, your mission, and why this network is a fit (40+ characters)."
              />
            </Field>
          </Card>

          {/* Card 5: Terms + Submit */}
          <Card
            title="Terms & Submission"
            subtitle="Review the Terms page and confirm your agreement before submitting."
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <Link
                href="/apply/terms"
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
              >
                Open Terms & Requirements
              </Link>

              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1 h-5 w-5 rounded border-white/10 bg-black/40 text-white"
                />
                <span className="text-sm text-white/70 leading-relaxed">
                  I have read and agree to the Terms & Requirements.
                </span>
              </label>
            </div>

            {!canSubmit ? (
              <div className="mt-5 rounded-2xl border border-white/10 bg-black/25 p-4">
                <div className="text-sm text-white/70 font-semibold">To enable Submit, complete:</div>
                <ul className="mt-2 text-sm text-white/60 space-y-1">
                  {requirements.missing.slice(0, 6).map((m) => (
                    <li key={m}>• {m}</li>
                  ))}
                  {requirements.missing.length > 6 ? (
                    <li>• …and {requirements.missing.length - 6} more</li>
                  ) : null}
                </ul>
              </div>
            ) : (
              <div className="mt-5 text-sm text-emerald-200/90 font-semibold">✅ Ready to submit</div>
            )}

            <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-sm text-white/55">
                After submission, your application is reviewed and queued for follow-up.
              </div>

              <button
                type="submit"
                disabled={loading || !canSubmit}
                className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 font-extrabold text-black disabled:opacity-60"
              >
                {loading ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </Card>
        </form>
      </div>
    </main>
  );
}

const cxInput =
  "w-full rounded-2xl border border-white/10 bg-black/35 px-5 text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-white/20";
const cxSelect =
  "w-full rounded-2xl border border-white/10 bg-black/35 px-5 text-white outline-none focus:ring-2 focus:ring-white/20";
const cxTextarea =
  "w-full rounded-2xl border border-white/10 bg-black/35 px-5 py-4 text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-white/20 resize-y";

function Field({ label, required, children }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <label className="text-sm font-semibold text-white">{label}</label>
        {required ? <span className="text-xs text-white/50">*</span> : null}
      </div>
      <div>{children}</div>
    </div>
  );
}

function Card({ title, subtitle, children }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-slate-900/45 backdrop-blur p-6 sm:p-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl sm:text-2xl font-bold text-white">{title}</h2>
        {subtitle ? <p className="text-sm text-white/60">{subtitle}</p> : null}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}
