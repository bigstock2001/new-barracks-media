export const metadata = {
  title: "Website Design Reviews & Client Testimonials | Barracks Media",
  description:
    "Read real client reviews of Barracks Media's professional website design and podcast services. See why businesses trust our veteran-led team for custom, SEO-optimized digital platforms.",
  alternates: {
    canonical: "/testimonials",
  },
};

export default function TestimonialsPage() {
  return (
    <main className="section container-card">

      <h1 className="h1">
        Client Testimonials & Website Design Reviews
      </h1>

      <p className="p" style={{ marginTop: 20 }}>
        Barracks Media Inc is a veteran-led digital media company specializing in
        professional website design, podcast production, and authority-building
        digital platforms. Here’s what real clients have said about working with us.
      </p>

      {/* WEBSITE DESIGN REVIEW */}
      <section style={{ marginTop: 50 }}>
        <h2 className="h2">★★★★★ Website Design Experience</h2>

        <p className="p" style={{ fontStyle: "italic", marginTop: 15 }}>
          "Amazing experience from start to finish. Don was professional, creative,
          and super responsive. He built a beautiful website and made the entire
          process smooth and stress-free."
        </p>

        <p className="p" style={{ marginTop: 10 }}>
          — Julie Hurley, Google Review
        </p>
      </section>

      {/* PODCAST SUPPORT REVIEW */}
      <section style={{ marginTop: 40 }}>
        <h2 className="h2">★★★★★ Ongoing Media & Podcast Support</h2>

        <p className="p" style={{ fontStyle: "italic", marginTop: 15 }}>
          "I use Don to edit my podcast and couldn't be happier. It takes a lot of
          time and energy off my plate, and the quality is excellent."
        </p>

        <p className="p" style={{ marginTop: 10 }}>
          — Jeremy C., Google Review
        </p>
      </section>

      {/* AUTHORITY SECTION */}
      <section style={{ marginTop: 60 }}>
        <h2 className="h2">
          Why Clients Choose Barracks Media for Website Design
        </h2>

        <ul style={{ marginTop: 20, paddingLeft: 20 }}>
          <li>✔ Custom website design built for growth</li>
          <li>✔ SEO-optimized structure from day one</li>
          <li>✔ Fast, mobile-responsive performance</li>
          <li>✔ Direct communication with the founder</li>
          <li>✔ Veteran-owned, mission-driven company</li>
        </ul>

        <p className="p" style={{ marginTop: 20 }}>
          If you're searching for a professional website designer, small business
          website developer, or a trusted company to build your online presence,
          Barracks Media delivers results with integrity and precision.
        </p>
      </section>

      {/* CTA */}
      <section style={{ marginTop: 60 }}>
        <h2 className="h2">Ready to Build Your Website?</h2>

        <p className="p" style={{ marginTop: 15 }}>
          Visit our{" "}
          <a href="/services/web-design" style={{ textDecoration: "underline" }}>
            Website Design Services
          </a>{" "}
          page to learn more or schedule a consultation today.
        </p>
      </section>

      {/* REVIEW SCHEMA FOR SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Barracks Media Inc",
            url: "https://barracksmedia.com",
            review: [
              {
                "@type": "Review",
                author: {
                  "@type": "Person",
                  name: "Julie Hurley",
                },
                reviewRating: {
                  "@type": "Rating",
                  ratingValue: "5",
                  bestRating: "5",
                },
                reviewBody:
                  "Amazing experience from start to finish. Don was professional, creative, and super responsive. He built a beautiful website and made the entire process smooth and stress-free.",
              },
              {
                "@type": "Review",
                author: {
                  "@type": "Person",
                  name: "Jeremy C.",
                },
                reviewRating: {
                  "@type": "Rating",
                  ratingValue: "5",
                  bestRating: "5",
                },
                reviewBody:
                  "I use Don to edit my podcast and couldn't be happier. It takes a lot of time and energy off my plate, and the quality is excellent.",
              },
            ],
          }),
        }}
      />

    </main>
  );
}
