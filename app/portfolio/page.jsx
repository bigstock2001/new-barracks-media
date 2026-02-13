import WebsitePortfolioCarousel from "@/components/WebsitePortfolioCarousel";

export const metadata = {
  title: "Portfolio",
  description:
    "Barracks Media web design portfolio — fast, clean, conversion-focused websites built to scale.",
};

export default function PortfolioPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-12">
      <WebsitePortfolioCarousel variant="page" autoMs={4500} />
    </main>
  );
}
