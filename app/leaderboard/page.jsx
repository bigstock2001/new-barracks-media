// app/leaderboard/page.jsx
import Link from "next/link";
import { getLeaderboardShowsByCategory } from "@/lib/sanity";

function Pill({ children }) {
  return <span className="lb-pill">{children}</span>;
}

function Stat({ label, value }) {
  return (
    <div className="lb-stat">
      <div className="lb-stat-label">{label}</div>
      <div className="lb-stat-value">{value}</div>
    </div>
  );
}

function ShowCard({ rank, show }) {
  const lastUpdated = show?.lastUpdated
    ? new Date(show.lastUpdated).toLocaleDateString()
    : null;

  return (
    <div className="container-card px-4 py-4">
      <div className="flex items-start gap-4">
        <div className="lb-rank">#{rank}</div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="truncate text-lg font-black text-white">{show.title}</div>
            <Pill>Score: {Math.round(show.score)}</Pill>
            {lastUpdated ? <Pill>Updated: {lastUpdated}</Pill> : null}
          </div>

          {show.shortDescription ? (
            <p className="mt-2 clamp-2 text-sm text-white/80">{show.shortDescription}</p>
          ) : null}

          {Array.isArray(show.tags) && show.tags.length ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {show.tags.slice(0, 8).map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/75"
                >
                  {t}
                </span>
              ))}
            </div>
          ) : null}

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Stat label="Downloads (7d)" value={show.downloads7} />
            <Stat label="Downloads (28d)" value={show.downloads28} />
            <Stat label="Listeners (28d)" value={show.uniqueListeners28} />
            <Stat label="Engagement" value={show.engagementScore} />
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="text-xs text-white/75">
              Consistency: <span className="font-black text-white">{show.consistency}</span>/10
            </div>

            {/* If you have a different route for show pages, change it here */}
            {show.slug ? (
              <Link
                href={`/shows/${show.slug}`}
                className="text-sm font-black text-white/85 hover:text-white"
              >
                View show →
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function LeaderboardPage({ searchParams }) {
  const category = searchParams?.category || "overall";

  const shows = await getLeaderboardShowsByCategory(category, 100);

  const tabs = [
    { key: "overall", label: "Overall" },
    { key: "trending", label: "Trending (7d)" },
    { key: "audience", label: "Audience (28d)" },
    { key: "engaged", label: "Most Engaged" },
  ];

  return (
    <main className="main">
      <div className="container-card hero-strip">
        <h1 className="h1">Network Leaderboard</h1>
        <p className="p">
          Update Captivate numbers inside Sanity → publish → this page automatically reorders.
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {tabs.map((t) => {
            const active = t.key === category;
            return (
              <Link
                key={t.key}
                href={`/leaderboard?category=${t.key}`}
                className={[
                  "rounded-full px-4 py-2 text-sm font-black transition",
                  active
                    ? "bg-white text-black"
                    : "border border-white/15 bg-white/5 text-white/85 hover:bg-white/10",
                ].join(" ")}
              >
                {t.label}
              </Link>
            );
          })}
        </div>
      </div>

      <section className="container-card section">
        <div className="lb-grid">
          {shows.length ? (
            shows.map((show, idx) => (
              <ShowCard key={show._id} rank={idx + 1} show={show} />
            ))
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white/80">
              No shows found. Make sure your Podcast Shows are marked <b>Active</b> and that you
              filled in the <b>Leaderboard Metrics</b> fields in Sanity.
            </div>
          )}
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/80">
          <div className="text-base font-black text-white">How scoring works</div>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li><b>Downloads (7 days)</b> drives momentum.</li>
            <li><b>Downloads (28 days)</b> stabilizes rankings.</li>
            <li><b>Unique listeners (28 days)</b> rewards real audience size.</li>
            <li><b>Engagement + consistency</b> reward quality and discipline.</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
