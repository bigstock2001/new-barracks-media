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
            src="/books/ironandash.jpg"
            alt="Iron and Ash Volume 2 of the secret of the hindu kush"
            width={900}
            height={1200}
            style={styles.image}
          />
        </div>

        <div style={styles.content}>
          <p style={styles.eyebrow}>Volume 2</p>

          <h1 style={styles.title}>Iron and Ash Volume 2 of the secret of the hindu kush</h1>

          <p style={styles.text}>
            War leaves scars. Some you can see. Some you can't.
          </p>

          <p style={styles.text}>
            Marcus Holloway made it through the last deployment—but he didn't come back the same.
          </p>

          <p style={styles.text}>
            When a new threat emerges in the mountains of Afghanistan, Marcus and his team are thrust back into a conflict that is spiraling out of control. The enemy is smarter. The missions are deadlier. And every decision carries consequences that reach far beyond the battlefield.
          </p>

          <p style={styles.text}>
            As the fighting intensifies, Marcus must navigate a war that no longer has clear sides—and confront the truth that the greatest danger may not be the enemy…
          </p>

          <p style={styles.text}>
            …but what the war is turning him into.
          </p>

          <p style={styles.text}>
            Iron and Ash raises the stakes in this powerful military series, delivering relentless action, brotherhood, and the psychological toll of combat.
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
            src="/books/dustandiron.jpg"
            alt="Dust and Iron Volume 1 of the secret of the Hindu Kush"
            width={900}
            height={1200}
            style={styles.image}
          />
        </div>

        <div style={styles.content}>
          <p style={styles.eyebrow}>Volume 1</p>

          <h1 style={styles.title}>Dust and Iron Volume 1 of the secret of the Hindu Kush</h1>

          <p style={styles.text}>
            Some wars are fought with bullets. Others are fought in the mind.
          </p>

          <p style={styles.text}>
            Marcus Holloway has lived both.
          </p>

          <p style={styles.text}>
            A seasoned Ranger medic with multiple deployments behind him, Marcus knows the reality of war—the chaos, the brotherhood, and the weight of decisions that never leave you. When he returns to Afghanistan for another tour, he steps back into a world where danger hides in every shadow and trust is a luxury no one can afford.
          </p>

          <p style={styles.text}>
            In the mountains of the Hindu Kush, every mission is a gamble. Every village holds secrets. And every man in his squad is counting on him to bring them home.
          </p>

          <p style={styles.text}>
            But as the violence escalates and the lines between enemy and ally blur, Marcus begins to realize something far more dangerous than the battlefield itself:
          </p>

          <p style={styles.text}>
            War changes you… and not everyone comes back whole.
          </p>

          <p style={styles.text}>
            Dust and Iron is a raw, powerful story of combat, sacrifice, and the unseen scars carried long after the fight is over.
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
            What if the demons we fight in our heads aren't just in our heads?
          </p>

          <p style={styles.text}>
            When homeless veteran Marcus "Tank" Rodriguez starts seeing shadows that move wrong and feeling hunted by something that shouldn't exist, he assumes he's finally lost his mind to PTSD. But when other veterans living under Atlanta's bridges report identical supernatural experiences, Tank realizes they're facing an enemy no military manual prepared them for.
          </p>

          <p style={styles.text}>
            The shadows followed them home from Iraq and Afghanistan—literal demons that feed on trauma, guilt, and isolation. These entities have been systematically hunting American veterans, recruiting the broken and forgotten for something called "the final deployment." Their mission: transform America's warriors into supernatural soldiers for a darker cause.
          </p>

          <p style={styles.text}>
            As Tank forges his fellow homeless veterans into a fighting unit, they discover this isn't just happening in Atlanta. Resistance cells across the country are battling the same invisible war. From abandoned warehouses to weapons manufacturing facilities, these forgotten soldiers must prove that military bonds forged in combat can stand against supernatural forces that want to turn their greatest strength—their brotherhood—into their ultimate weakness.
          </p>

          <p style={styles.text}>
            Armed with nothing but their training, their loyalty to each other, and the discovery that some demons fear fire as much as they crave darkness, Tank's unit faces an impossible choice: let the shadows convert every veteran in America, or fight a war that most people don't believe exists against an enemy that shouldn't be real.
          </p>

          <p style={styles.text}>
            Because when supernatural forces threaten everything they fought to protect overseas, these homeless veterans will remind the world what happens when you hunt soldiers who've already been through hell and come back fighting. Some oaths don't end when you take off the uniform—they find new enemies to fight.
          </p>

          <p style={styles.text}>
            A supernatural military thriller that asks: What if the real battle begins when the war comes home?
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
            In the shadows of service, behind the laughter that fades, lies a story untold of battles waged not on distant lands, but within the quiet confines of home and self. "Echoes of Silence" is a deeply personal journey through the invisible wounds of war, chronicled by a veteran whose life was forever altered by the choices made in youth, the silence kept in strength, and the path walked in solitude. This is not just a tale of struggle with PTSD; it is a beacon for those navigating the aftermath of their own battles, seeking a glimmer of understanding in a sea of unspoken pain.
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