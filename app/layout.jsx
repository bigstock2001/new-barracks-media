// app/layout.jsx
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Script from "next/script";

// ✅ Kate bot
import FloatingVoiceBot from "@/components/FloatingVoiceBot";

export const metadata = {
  metadataBase: new URL("https://barracksmedia.com"),

  // ✅ Strong default title + template for subpages
  title: {
    default: "Barracks Media | Podcast Production, Editing & Web Design",
    template: "%s | Barracks Media",
  },

  // ✅ Strong default meta description
  description:
    "Barracks Media helps creators and veteran-led brands launch, grow, and monetize podcasts and media brands with podcast production, editing, and web design—built clean, built to scale.",

  // ✅ Canonical for the root (prevents duplicate URL variants)
  alternates: {
    canonical: "/",
  },

  // ✅ Better link previews
  openGraph: {
    title: "Barracks Media | Podcast Production, Editing & Web Design",
    description:
      "Podcast production, editing, launch support, and web design—built clean, built to scale.",
    url: "https://barracksmedia.com/",
    siteName: "Barracks Media",
    type: "website",
  },

  // ✅ Helps social previews on X
  twitter: {
    card: "summary_large_image",
    title: "Barracks Media | Podcast Production, Editing & Web Design",
    description:
      "Podcast production, editing, launch support, and web design—built clean, built to scale.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* ✅ Google Analytics (site-wide) */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-FX4Q6WRJ9H"
        strategy="afterInteractive"
      />
      <Script id="ga-gtag" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-FX4Q6WRJ9H');
        `}
      </Script>

      <body>
        {/* Background */}
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: -2,
            backgroundImage: "url(/background.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />

        {/* Overlay */}
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: -1,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.55), rgba(0,0,0,0.70))",
          }}
        />

        <Navigation />

        {/* ✅ Kate bot back site-wide */}
        <FloatingVoiceBot />

        {children}

        <Footer />
      </body>
    </html>
  );
}
