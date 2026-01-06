import Link from "next/link";
import { notFound } from "next/navigation";

const shows = [
  {
    slug: "spirits-and-stories",
    title: "Spirits and Stories with Donald Dunn",
    image: "/podcasts/spirits-and-stories-with-donald-dunn.jpg",
    tagline: "Conversations at the edge of the seen and unseen.",
    description:
      "A long-form interview show exploring veteran stories, spirituality, leadership, and the strange realities that don’t fit neatly into a box.",
  },
  {
    slug: "veteran-spiritual-task-force",
    title: "The Veteran Spiritual Task Force",
    image: "/podcasts/the-veterans-spiritual-task-force.jpg",
    tagline: "Trauma, healing, spirituality, and the battles that follow us home.",
    description:
      "A veteran-led mission focused on healing and truth — exploring trauma, identity, and what followed us home.",
  },
  {
    slug: "after-the-uniform",
    title: "After the Uniform",
    image: "/podcasts/after-the-uniform.jpg",
    tagline: "Life after service — identity, purpose, and rebuilding.",
    description:
      "Stories of transition, hard resets, and rebuilding life after service — with practical takeaways and real conversations.",
  },
  {
    slug: "authors-after-action",
    title: "Authors After Action",
    image: "/podcasts/authors-after-action.jpg",
    tagline: "Veteran authors, stories, and the missions behind the books.",
    description:
      "Interviews with authors and storytellers — the why behind the work, the process, and the message.",
  },
  {
    slug: "built-from-scratch",
    title: "Built From Scratch",
    image: "/podcasts/built-from-scratch.jpg",
    tagline: "Entrepreneurship, grit, and building something real.",
    description:
      "A builder’s show: business, systems, failures, wins — and what it really takes to create something from nothing.",
  },
  {
    slug: "creators-at-work",
    title: "Creators at Work",
    image: "/podcasts/creators-at-work.jpg",
    tagline: "Behind the scenes with creators, producers, and builders.",
    description:
      "Production talk, creator workflows, and the real-world mechanics of making content that hits.",
  },
  {
    slug: "driven-automotive-world",
    title: "Driven: Automotive World",
    image: "/podcasts/driven-automotive-world.jpg",
    tagline: "Cars, culture, and the stories behind the wheel.",
    description:
      "Automotive stories, builds, culture, and the people that make the car world move.",
  },
  {
    slug: "finding-the-why",
    title: "Finding the Why",
    image: "/podcasts/finding-the-why.jpg",
    tagline: "Purpose-driven conversations and real-life pivots.",
    description:
      "Conversations about purpose, meaning, and pivot points — what changes people and what keeps them going.",
  },
  {
    slug: "history-told-forward",
    title: "History Told Forward",
    image: "/podcasts/history-told-forward.jpg",
    tagline: "Lessons from history — told to move us forward.",
    description:
      "Short-form and long-form storytelling rooted in history — built to inform decisions today.",
  },
  {
    slug: "mystery-at-the-windham-inn",
    title: "Mystery at the Windham Inn",
    image: "/podcasts/mystery-at-the-windham-inn.jpg",
    tagline: "A mystery series with atmosphere and bite.",
    description:
      "A narrative mystery experience — episodes built like chapters with mood, tension, and payoff.",
  },
  {
    slug: "the-healing-side",
    title: "The Healing Side",
    image: "/podcasts/the-healing-side.jpg",
    tagline: "Healing journeys, tools, and transformation.",
    description:
      "A show focused on healing — practical tools, lived experience, and conversations that move people forward.",
  },
  {
    slug: "the-real-leadership-brief",
    title: "The Real Leadership Brief",
    image: "/podcasts/the-real-leadership-brief.jpg",
    tagline: "Leadership, discipline, and decision-making under pressure.",
    description:
      "A leadership-focused show built on real decision-making, discipline, and mindset — not fluff.",
  },
];

export function generateMetadata({ params }) {
  const show = shows.find((s) => s.slug === params.slug);
  if (!show) return { title: "Show Not Found | Barracks Media" };
  return {
    title: `${show.title} | Barracks Media`,
    description: show.tagline,
  };
}

export default function ShowPage({ params }) {
  const show = shows.find((s) => s.slug === params.slug);
  if (!show) return notFound();

  return (
    <>
      <section className="container-card section">
        <Link className="link" href="/network">
          ← Back to Network
        </Link>

        <div className="showLayout" style={{ marginTop: 14 }}>
          <div
            style={{
              borderRadius: 18,
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.04)",
            }}
          >
            <img
              src={show.image}
              alt={show.title}
              style={{ width: "100%", height: "auto", display: "block" }}
              loading="lazy"
            />
          </div>

          <div>
            <h1 className="h1" style={{ fontSize: 28 }}>
              {show.title}
            </h1>
            <p className="p" style={{ marginTop: 10 }}>
              {show.tagline}
            </p>

            <div className="divider" style={{ marginTop: 16, marginBottom: 16 }} />

            <p className="p" style={{ marginTop: 0 }}>
              {show.description}
            </p>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 18 }}>
              <Link className="tab" href="/network">
                All Shows
              </Link>
              <Link className="tab" href="/services">
                Work with Barracks Media
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container-card section">
        <h2 className="h1" style={{ fontSize: 18 }}>
          Episodes (coming next)
        </h2>
        <p className="p" style={{ marginTop: 10 }}>
          Next step: we’ll add an embedded playlist/player per show (Captivate, YouTube, or both),
          plus a clean episode list.
        </p>
      </section>
    </>
  );
}
