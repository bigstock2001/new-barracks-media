// lib/voicebot/knowledge.js

export const SERVICES = [
  {
    key: "web_design",
    name: "Web Design",
    whoItsFor:
      "Businesses and creators who want a clean, modern website that converts visitors into leads.",
    outcomes: [
      "A professional site that loads fast",
      "Clear service pages and calls-to-action",
      "Mobile-friendly design",
      "Basic SEO foundations",
    ],
    bookingUrl: "/onboarding/web-design",
  },
  {
    key: "podcast_production",
    name: "Podcast Production",
    whoItsFor:
      "Podcasters who want recording, editing, publishing, and growth support without the stress.",
    outcomes: [
      "Editing + leveling + cleanup",
      "Intro/outro + branding help",
      "Publishing workflow guidance",
      "Clips/reels strategy",
    ],
    bookingUrl: "/onboarding/editing",
  },
  {
    key: "editing",
    name: "Editing Services",
    whoItsFor:
      "Creators who want their audio/video to sound and look pro (podcasts, interviews, multicam).",
    outcomes: [
      "Cleaner audio, fewer distractions",
      "Tighter pacing",
      "Broadcast-ready export settings",
      "Short-form cutdowns if needed",
    ],
    bookingUrl: "/onboarding/editing",
  },
  {
    key: "hosting",
    name: "Hosting Services",
    whoItsFor:
      "People who want their site and/or content hosted reliably with fewer tech headaches.",
    outcomes: [
      "Setup + guidance",
      "Uptime-focused configuration",
      "Simple maintenance plan options",
    ],
    bookingUrl: "/onboarding/hosting",
  },
];

// Update these with your real network shows.
// Keep it short and accurate so recommendations feel “real.”
export const PODCASTS = [
  {
    key: "spirits_and_stories",
    title: "Spirits and Stories with Donald Dunn",
    description:
      "Human stories, veterans, creators, and big conversations — reflective, honest, and curiosity-driven.",
    tags: ["veterans", "storytelling", "entrepreneurship", "healing", "longform"],
    url: "/podcasts/spirits-and-stories",
  },
  {
    key: "forgotten_oath",
    title: "The Forgotten Oath",
    description:
      "Veteran-focused stories and conversations about identity, purpose, and life after service.",
    tags: ["veterans", "purpose", "life", "resilience"],
    url: "/podcasts/the-forgotten-oath",
  },
  {
    key: "authors_after_action",
    title: "Authors After Action",
    description:
      "Authors and creators break down their work, process, and lessons learned — practical and motivating.",
    tags: ["authors", "writing", "publishing", "creators", "process"],
    url: "/podcasts/authors-after-action",
  },
];

export function formatKnowledgeForPrompt() {
  const servicesText = SERVICES.map((s) => {
    return `- ${s.name}: ${s.whoItsFor}
  Outcomes: ${s.outcomes.join("; ")}
  Booking: ${s.bookingUrl}`;
  }).join("\n");

  const podcastsText = PODCASTS.map((p) => {
    return `- ${p.title}: ${p.description}
  Tags: ${p.tags.join(", ")}
  Link: ${p.url}`;
  }).join("\n");

  return `SERVICES:\n${servicesText}\n\nPODCAST NETWORK:\n${podcastsText}`;
}
