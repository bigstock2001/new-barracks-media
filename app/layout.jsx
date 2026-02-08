// app/layout.jsx
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

// ✅ Kate bot (pick the one you actually use; we’ll try the most likely)
import FloatingVoiceBot from "@/components/FloatingVoiceBot";

export const metadata = {
  metadataBase: new URL("https://barracksmedia.com"),
  title: {
    default: "Barracks Media",
    template: "%s | Barracks Media",
  },
  description:
    "Barracks Media helps veterans and creators launch, grow, and monetize podcasts and media brands—built clean, built to scale.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
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
