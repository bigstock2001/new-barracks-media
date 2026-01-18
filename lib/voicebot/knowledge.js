// lib/voicebot/knowledge.js

export const SERVICES = [
  {
    key: "web_design",
    name: "Web Design",
    summary:
      "Custom websites, redesigns, landing pages, basic SEO, and performance improvements.",
    bookingUrl: "/onboarding/web-design",
  },
  {
    key: "podcast_production",
    name: "Podcast Production",
    summary:
      "End-to-end podcast setup and production: planning, recording workflow, packaging, publishing guidance, and promos.",
    bookingUrl: "/onboarding/podcast-production",
  },
  {
    key: "editing",
    name: "Editing Services",
    summary:
      "Audio/video editing, cleanup, multicam assembly, clip creation for shorts, and YouTube packaging.",
    bookingUrl: "/onboarding/editing",
  },
  {
    key: "hosting",
    name: "Hosting Services",
    summary:
      "Website hosting and support, maintenance, updates, basic security and uptime help.",
    bookingUrl: "/onboarding/hosting",
  },
];

export const PODCASTS = [
  {
    key: "after_the_uniform",
    title: "After the Uniform",
    vibe:
      "Veteran stories focused on life after service, identity, transition, and purpose.",
    // keep URL for routing on-site, but DO NOT include it in spoken knowledge
    url: "/network/after-the-uniform",
  },
  {
    key: "authors_after_action",
    title: "Authors After Action",
    vibe:
      "Conversations with authors about their books, writing journeys, and creative process.",
    url: "/network/authors-after-action",
  },
  {
    key: "built_from_scratch",
    title: "Built From Scratch",
    vibe:
      "Entrepreneurship stories about building businesses, systems, and hard-earned lessons.",
    url: "/network/built-from-scratch",
  },
  {
    key: "creators_at_work",
    title: "Creators at Work",
    vibe:
      "Content creation, workflows, tools, and how creators build and grow.",
    url: "/network/creators-at-work",
  },
];

/**
 * IMPORTANT:
 * This string is fed to the LLM and also ends up being spoken aloud.
 * So we keep it "voice safe":
 * - No URLs
 * - No internal paths
 * - No "Link:" fields
 * - Titles + vibes only
 */
export function formatKnowledgeForPrompt() {
  const servicesBlock = SERVICES.map(
    (s) => `- ${s.name}: ${s.summary} Booking: ${s.bookingUrl}`
  ).join("\n");

  const podcastsBlock = PODCASTS.map(
    (p) => `- ${p.title}: ${p.vibe}`
  ).join("\n");

  return `BARRACKS MEDIA SERVICES:\n${servicesBlock}\n\nBARRACKS MEDIA PODCASTS:\n${podcastsBlock}\n`;
}
