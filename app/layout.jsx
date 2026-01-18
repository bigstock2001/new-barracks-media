// app/layout.jsx
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FloatingVoiceBot from "@/app/components/FloatingVoiceBot";

export const metadata = {
  title: "Barracks Media",
  description: "Barracks Media — Services, podcasts, and production.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Sticky background layer */}
        <div className="bg-layer" aria-hidden="true" />

        <div className="site">
          <Navigation />
          <main className="main">{children}</main>
          <Footer />
        </div>

        {/* Floating site-wide voice bot */}
        <FloatingVoiceBot />
      </body>
    </html>
  );
}
