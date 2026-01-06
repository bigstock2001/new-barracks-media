import PodcastCarousel from "@/components/PodcastCarousel";

export default function HomePage() {
  return (
    <>
      <PodcastCarousel />

      <section className="container-card section">
        <h2 className="h1" style={{ fontSize: 18 }}>
          Welcome
        </h2>
        <p className="p" style={{ marginTop: 10 }}>
          Barracks Media is rebuilding clean on a coded stack. The network is live,
          and we’ll be layering in services and creator tools next.
        </p>
      </section>
    </>
  );
}