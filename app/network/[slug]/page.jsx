import Link from "next/link";
import { notFound } from "next/navigation";
import { getShowBySlug } from "@/lib/shows";
import ShowEpisodes from "@/components/ShowEpisodes";

export async function generateMetadata({ params }) {
  const p = await params;
  const show = getShowBySlug(p?.slug);

  if (!show) return { title: "Show Not Found | Barracks Media" };

  return {
    title: `${show.title} | Barracks Media`,
    description: show.tagline,
  };
}

export default async function ShowPage({ params }) {
  const p = await params;
  const slug = p?.slug;

  const show = getShowBySlug(slug);
  if (!show) return notFound();

  let episodes = [];
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || ""}/api/episodes/${show.slug}`,
      { cache: "no-store" }
    );

    // If NEXT_PUBLIC_SITE_URL isn't set locally, fallback to relative fetch:
    if (!res.ok) {
      const localRes = await fetch(`http://localhost:3000/api/episodes/${show.slug}`, {
        cache: "no-store",
      });
      if (localRes.ok) {
        const data = await localRes.json();
        episodes = data.episodes || [];
      }
    } else {
      const data = await res.json();
      episodes = data.episodes || [];
    }
  } catch {
    episodes = [];
  }

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

      <ShowEpisodes show={show} episodes={episodes} />
    </>
  );
}
