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
    vibe: "Veteran stories, transition, identity, and purpose.",
    url: "/network/after-the-uniform",
  },
  {
    key: "authors_after_action",
    title: "Authors After Action",
    vibe: "Authors, books, writing journeys, and behind-the-scenes creative work.",
    url: "/network/authors-after-action",
  },
  {
    key: "built_from_scratch",
    title: "Built From Scratch",
    vibe: "Entrepreneurship, building businesses, systems, and hard-earned lessons.",
    url: "/network/built-from-scratch",
  },
  {
    key: "creators_at_work",
    title: "Creators at Work",
    vibe: "Content creation, workflows, tools, and how creators build and grow.",
    url: "/network/creators-at-work",
  },
];

export function formatKnowledgeForPrompt() {
  const servicesBlock = SERVICES.map(
    (s) => `- ${s.name}: ${s.summary} (Booking: ${s.bookingUrl})`
  ).join("\n");

  const podcastsBlock = PODCASTS.map(
    (p) => `- ${p.title}: ${p.vibe} (Link: ${p.url})`
  ).join("\n");

  return `SERVICES:\n${servicesBlock}\n\nPODCASTS:\n${podcastsBlock}\n`;
}
