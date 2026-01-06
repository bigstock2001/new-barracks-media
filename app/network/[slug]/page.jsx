export default function PodcastPage({ params }) {
  const { slug } = params;

  const title = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return (
    <section className="container-card section">
      <h2 className="h1" style={{ fontSize: 18 }}>
        {title}
      </h2>
      <p className="p">
        This is the show page placeholder for <strong>{slug}</strong>. Next we’ll add:
        description, subscribe buttons, episode embeds, and links.
      </p>
    </section>
  );
}
