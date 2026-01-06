import Link from "next/link";

const shows = [
  {
    title: "Spirits and Stories",
    desc: "Conversations at the edge of the seen and unseen.",
    href: "/network",
  },
  {
    title: "Veteran Voice Radio",
    desc: "Programming built for veterans, by veterans.",
    href: "/network",
  },
  {
    title: "Barracks Media",
    desc: "Services, creator tools, and production workflows.",
    href: "/services",
  },
];

export default function PodcastCarousel() {
  return (
    <section className="section">
      <div className="container-card">
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <h2 className="h2">Featured</h2>
          <Link className="p" href="/network" style={{ textDecoration: "underline" }}>
            View all
          </Link>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 12,
            marginTop: 12,
          }}
        >
          {shows.map((s) => (
            <Link
              key={s.title}
              href={s.href}
              className="card"
              style={{
                display: "block",
                padding: 14,
                borderRadius: 14,
                border: "1px solid rgba(0,0,0,0.08)",
              }}
            >
              <div style={{ fontWeight: 700 }}>{s.title}</div>
              <div style={{ opacity: 0.8, marginTop: 6 }}>{s.desc}</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
