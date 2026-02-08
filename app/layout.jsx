// app/layout.jsx
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

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
        {/* ✅ Restores site background no matter what page you’re on */}
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

        {/* ✅ Soft overlay to keep text readable */}
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
        {children}
        <Footer />
      </body>
    </html>
  );
}
