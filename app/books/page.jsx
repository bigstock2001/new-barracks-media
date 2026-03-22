import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "The Secret of the Hindu Kush | Book Series | Barracks Media",
  description:
    "Get Books One and Two of The Secret of the Hindu Kush series. Buy both books now.",
  alternates: {
    canonical: "/books",
  },
  openGraph: {
    title: "The Secret of the Hindu Kush | Book Series",
    description:
      "Get Books One and Two of The Secret of the Hindu Kush series. Buy both books now.",
    url: "https://barracksmedia.com/books",
    type: "website",
    images: ["/books/bookseries.jpg"],
  },
};

export default function BooksPage() {
  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.imageWrap}>
          <Image
            src="/books/bookseries.jpg"
            alt="The Secret of the Hindu Kush book series including Book One and Book Two"
            width={900}
            height={1200}
            style={styles.image}
            priority
          />
        </div>

        <div style={styles.content}>
          <p style={styles.eyebrow}>Book Series</p>

          <h1 style={styles.title}>The Secret of the Hindu Kush</h1>

          <p style={styles.subtitle}>
            Own Book One and Book Two of the series in one place.
          </p>

          <p style={styles.text}>
            Step into a story shaped by war, mystery, danger, and the weight of
            what men carry long after the mission ends. This series pulls readers
            into a world of conflict, loyalty, and hidden truths buried deep in
            the mountains of Afghanistan.
          </p>

          <p style={styles.text}>
            This page features the first product in your store: Books One and Two
            of <strong>The Secret of the Hindu Kush</strong>.
          </p>

          <div style={styles.buttonRow}>
            <Link
              href="https://buy.stripe.com/cNibJ1g113uifDz6El3cc03"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.button}
            >
              Buy Now
            </Link>
          </div>
        </div>
      </section>

      <section style={styles.hero}>
        <div style={styles.imageWrap}>
          <Image
            src="/books/dustandiron.jpg"
            alt="Dust to Iron Volume 1 of the Secret of the Hindu Kush"
            width={900}
            height={1200}
            style={styles.image}
          />
        </div>

        <div style={styles.content}>
          <p style={styles.eyebrow}>Volume 1</p>

          <h1 style={styles.title}>Dust to Iron Volume 1 of the Secret of the Hindu Kush</h1>

          <p style={styles.text}>
            A seasoned Ranger medic returns to Afghanistan where every mission carries weight. A raw, powerful story of combat, sacrifice, and the unseen scars carried long after the fight is over.
          </p>

          <div style={styles.buttonRow}>
            <Link
              href="https://buy.stripe.com/bJeeVdg117Ky8b7geV3cc05"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.button}
            >
              Buy Now
            </Link>
          </div>
        </div>
      </section>

      <section style={styles.hero}>
        <div style={styles.imageWrap}>
          <Image
            src="/books/ironandash.jpg"
            alt="Iron to Ash Volume 2 of the Secret of the Hindu Kush"
            width={900}
            height={1200}
            style={styles.image}
          />
        </div>

        <div style={styles.content}>
          <p style={styles.eyebrow}>Volume 2</p>

          <h1 style={styles.title}>Iron to Ash Volume 2 of the Secret of the Hindu Kush</h1>

          <p style={styles.text}>
            War leaves scars—some you can see, some you can't.
          </p>

          <p style={styles.text}>
            As the conflict escalates, Marcus must face a truth more dangerous than the enemy… what the war is turning him into.
          </p>

          <div style={styles.buttonRow}>
            <Link
              href="https://buy.stripe.com/dRmfZhcOPaWKajf2o53cc04"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.button}
            >
              Buy Now
            </Link>
          </div>
        </div>
      </section>

      <section style={styles.hero}>
        <div style={styles.imageWrap}>
          <Image
            src="/books/whendemonsfollowyouhome.jpg"
            alt="When Demons Follow You Home"
            width={900}
            height={1200}
            style={styles.image}
          />
        </div>

        <div style={styles.content}>
          <p style={styles.eyebrow}>Standalone Novel</p>

          <h1 style={styles.title}>When Demons Follow You Home</h1>

          <p style={styles.text}>
            What if the demons we fight in our heads aren’t just in our heads? A group of veterans discovers the war followed them home—literally.
          </p>

          <div style={styles.buttonRow}>
            <Link
              href="https://buy.stripe.com/00waEX8yz5CqcrnbYF3cc06"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.button}
            >
              Buy Now
            </Link>
          </div>
        </div>
      </section>

      <section style={styles.hero}>
        <div style={styles.imageWrap}>
          <Image
            src="/books/echoesofwar.jpg"
            alt="Echoes of War The Silent Transition of a Soldier"
            width={900}
            height={1200}
            style={styles.image}
          />
        </div>

        <div style={styles.content}>
          <p style={styles.eyebrow}>Standalone Novel</p>

          <h1 style={styles.title}>Echoes of War The Silent Transition of a Soldier</h1>

          <p style={styles.text}>
            A deeply personal journey through the invisible wounds of war.
          </p>

          <p style={styles.text}>
            A story of battles fought not overseas, but within—offering understanding for those navigating life after service.
          </p>

          <div style={styles.buttonRow}>
            <Link
              href="https://buy.stripe.com/6oU6oH7uv3uigHD9Qx3cc07"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.button}
            >
              Buy Now
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "48px 20px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  hero: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "40px",
    alignItems: "center",
  },
  imageWrap: {
    width: "100%",
  },
  image: {
    width: "100%",
    height: "auto",
    borderRadius: "18px",
    boxShadow: "0 12px 35px rgba(0,0,0,0.22)",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  eyebrow: {
    fontSize: "14px",
    textTransform: "uppercase",
    letterSpacing: "1.5px",
    fontWeight: 700,
    opacity: 0.75,
    margin: 0,
  },
  title: {
    fontSize: "clamp(2.2rem, 5vw, 4rem)",
    lineHeight: 1.05,
    fontWeight: 800,
    margin: 0,
  },
  subtitle: {
    fontSize: "1.2rem",
    fontWeight: 600,
    margin: 0,
    opacity: 0.9,
  },
  text: {
    fontSize: "1rem",
    lineHeight: 1.7,
    margin: 0,
    maxWidth: "700px",
  },
  buttonRow: {
    marginTop: "12px",
    display: "flex",
    flexWrap: "wrap",
    gap: "14px",
  },
  button: {
    display: "inline-block",
    padding: "14px 26px",
    borderRadius: "999px",
    textDecoration: "none",
    fontWeight: 700,
    fontSize: "1rem",
    background: "#111",
    color: "#fff",
    boxShadow: "0 8px 20px rgba(0,0,0,0.18)",
  },
};