// app/layout.jsx
import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://barracksmedia.com"),
  title: {
    default: "Barracks Media",
    template: "%s | Barracks Media",
  },
  description:
    "Barracks Media helps veterans and creators launch, grow, and monetize podcasts and media brands—built clean, built to scale.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://barracksmedia.com",
    siteName: "Barracks Media",
    title: "Barracks Media",
    description:
      "Podcast production, web design, and network growth—built clean, built to scale.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Barracks Media",
    description:
      "Podcast production, web design, and network growth—built clean, built to scale.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
