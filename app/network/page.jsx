import Link from "next/link";

export const metadata = {
  title: "Network | Barracks Media",
  description: "Explore the Barracks Media network of shows and podcasts.",
};

const shows = [
  {
    slug: "spirits-and-stories",
    title: "Spirits and Stories with Donald Dunn",
    image: "/podcasts/spirits-and-stories-with-donald-dunn.jpg",
    tagline: "Conversations at the edge of the seen and unseen.",
  },
  {
    slug: "veteran-spiritual-task-force",
    title: "The Veteran Spiritual Task Force",
    image: "/podcasts/the-veterans-spiritual-task-force.jpg",
    tagline: "Trauma, healing, spirituality, and the battles that follow us home.",
  },
  {
    slug: "after-the-uniform",
    title: "After the Uniform",
    image: "/podcasts/after-the-uniform.jpg",
    tagline: "Life after service — identity, purpose, and rebuilding.",
  },
  {
    slug: "authors-after-action",
    title: "Authors After Action",
    image: "/podcasts/authors-after-action.jpg",
    tagline: "Veteran authors, stories, and the missions behind the books.",
  },
  {
    slug: "built-from-scratch",
    title: "Built From Scratch",
    image: "/podcasts/built-from-scratch.jpg",
    tagline: "Entrepreneurship, grit, and building something real.",
  },
  {
    slug: "creators-at-work",
    title: "Creators at Work",
    image: "/podcasts/creators-at-work.jpg",
    tagline: "Behind the scenes with creators, producers, and builders.",
  },
  {
    slug: "driven-automotive-world",
    title: "Driven: Automotive World",
    image: "/podcasts/driven-automotive-world.jpg",
    tagline: "Cars, culture, and the stories behind the wheel.",
  },
  {
    slug: "finding-the-why",
    title: "Finding the Why",
    image: "/podcasts/finding-the-why.jpg",
    tagline: "Purpose-driven conversations and real-life pivots.",
  },
  {
    slug: "history-told-forward",
    title: "History Told Forward",
    image: "/podcasts/history-told-forward.jpg",
    tagline: "Lessons from history — told to move us forward.",
  },
  {
    slug: "mystery-at-the-windham-inn",
    title: "Mystery at the Windham Inn",
    image: "/podcasts/mystery-at-the-windham-inn.jpg",
    tagline: "A mystery series with atmosphere and bite.",
  },
  {
    slug: "the-healing-side",
    title: "The Healing Side",
    image: "/podcasts/the-healing-side.jpg",
    tagline: "Healing journeys, tools, and transformation.",
  },
  {
    slug: "the-real-leadership-brief",
    title: "The Real Leadership Brief",
    image: "/podcasts/the-real-leadership-brief.jpg",
    tagline: "Leadership, discipline, and decision-making under pressure.",
  },
];

export default function NetworkPage() {
  return (
    <>
      <section className="container-card section hero-strip">
        <h1 className="h1">The Network</h1>
        <p className="p" style={{ marginTop: 10 }}>
          All shows in one place. Click into any show to view details and episodes.
        </p>
      </section>

      <section className="container-card section">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
          }}
        >
          {shows.map((s) => (
            <Link
              key={s.slug}
              href={`/network/${s.slug}`}
              className="podCard"
              style={{ width: "100%" }}
            >
              <div className="podCoverWrap" style={{ aspectRatio: "16 / 10" }}>
                {/* plain img keeps it simple with your existing CSS */}
                <img
                  src={s.image}
                  alt={s.title}
                  className="podCover"
                  loading="lazy"
                />
              </div>

              <div className="podMeta">
                <div className="podTitle">{s.title}</div>
                <div className="podCta">{s.tagline}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
