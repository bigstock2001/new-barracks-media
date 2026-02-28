export const metadata = {
  title: "Art to Help the Mind and Body | Veteran Voice Radio Webinar",
  description:
    "A free structured art resilience workshop for veterans and first responders led by retired police officer Rex Nielson. Learn pointillism as a tool for focus, stress reduction, and emotional balance.",
};

export default function WebinarsPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6">
        Art to Help the Mind and Body
      </h1>

      <p className="text-lg text-gray-400 mb-10">
        A free structured art resilience workshop designed specifically for
        veterans and first responders. Led by retired police officer Rex
        Nielson, this program provides a disciplined creative outlet to help
        manage stress, improve focus, and build emotional balance.
      </p>

      {/* Webinar Embed */}
      <div className="w-full relative pb-[56.25%] overflow-hidden rounded-xl shadow-lg">
        <iframe
          src="https://streamyard.com/watch/K2rkMhNVu5yW?embed=true"
          className="absolute top-0 left-0 w-full h-full"
          frameBorder="0"
          allow="autoplay; fullscreen"
          allowFullScreen
        />
      </div>

      {/* Program Details */}
      <div className="mt-10 text-gray-300 space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-3">
            About the Workshop
          </h2>
          <p>
            This workshop teaches pointillism, an artistic technique that
            builds images using small, intentional dots. The repetition of
            precise movements encourages controlled breathing, steady focus,
            and calm concentration. Rather than broad strokes or fast motion,
            participants build structure through patience and discipline.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">
            Why Pointillism?
          </h2>
          <p>
            Pointillism promotes mindfulness through repetition. The slow,
            deliberate placement of each dot helps regulate the nervous system
            and reduce mental noise. Over time, the structured process can help
            participants improve focus, emotional control, and resilience.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">
            Who This Is For
          </h2>
          <p>
            This program is open to veterans and first responders. Participants
            only need basic art supplies and a willingness to engage in a
            focused creative practice. The workshop is free and offered twice
            per month on Thursdays and Saturdays. Attendees choose one session
            per month — both sessions cover the same material.
          </p>
        </div>
      </div>
    </main>
  );
}