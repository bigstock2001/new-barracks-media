export const metadata = {
  title: "Webinars | Barracks Media",
  description: "Live and on-demand webinars from the Barracks Media Network",
};

export default function WebinarsPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6">Webinars</h1>

      <p className="text-lg text-gray-400 mb-10">
        Watch exclusive live and recorded webinars from the Barracks Media Network.
      </p>

      {/* Webinar Embed */}
      <div className="w-full relative pb-[56.25%] overflow-hidden rounded-xl shadow-lg">
        <iframe
          src="https://streamyard.com/watch/Te6idvkZJnES?embed=true"
          className="absolute top-0 left-0 w-full h-full"
          frameBorder="0"
          allow="autoplay; fullscreen"
          allowFullScreen
        />
      </div>

      {/* Optional Description */}
      <div className="mt-8 text-gray-300">
        <h2 className="text-2xl font-semibold mb-3">
          Webinar: Building Media That Matters
        </h2>
        <p>
          This session covers storytelling, network growth, and how Barracks Media
          is building a mission-driven media ecosystem.
        </p>
      </div>
    </main>
  );
}
