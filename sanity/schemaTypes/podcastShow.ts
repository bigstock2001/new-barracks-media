// sanity/schemaTypes/podcastShow.ts
import type { SchemaTypeDefinition } from "sanity";

const podcastShow: SchemaTypeDefinition = {
  name: "podcastShow",
  title: "Podcast Show",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Show Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "shortDescription",
      title: "Short Description",
      type: "text",
      rows: 3,
      description: "One to two sentences about the show (voice-safe).",
    },
    {
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      description: "Show-level tags (optional).",
    },

    // ✅ NEW: Leaderboard Metrics (you update these from Captivate)
    {
      name: "leaderboard",
      title: "Leaderboard Metrics",
      type: "object",
      description:
        "Update these numbers from Captivate. The leaderboard page will automatically reorder cards based on score.",
      fields: [
        {
          name: "downloads7",
          title: "Downloads (Last 7 days)",
          type: "number",
          initialValue: 0,
          validation: (Rule) => Rule.min(0),
          description:
            "Captivate → Summary → Downloads → Last 7 days. Drives Trending.",
        },
        {
          name: "downloads28",
          title: "Downloads (Last 28 days)",
          type: "number",
          initialValue: 0,
          validation: (Rule) => Rule.min(0),
          description:
            "Captivate → Summary → Downloads → Last 28 days. Stabilizes rankings.",
        },
        {
          name: "uniqueListeners28",
          title: "Unique Listeners (Last 28 days)",
          type: "number",
          initialValue: 0,
          validation: (Rule) => Rule.min(0),
          description:
            "Captivate → Summary/Audience → Unique Listeners → Last 28 days. Rewards real audience size.",
        },
        {
          name: "engagementScore",
          title: "Engagement Score (0–100)",
          type: "number",
          initialValue: 50,
          validation: (Rule) => Rule.min(0).max(100),
          description:
            "Your quick rating of listener quality/engagement. Keep it consistent week to week.",
        },
        {
          name: "consistency",
          title: "Consistency (0–10)",
          type: "number",
          initialValue: 5,
          validation: (Rule) => Rule.min(0).max(10),
          description:
            "0–3 inconsistent, 4–6 mostly consistent, 7–10 rock solid schedule.",
        },
        {
          name: "lastUpdated",
          title: "Metrics Last Updated",
          type: "datetime",
          description:
            "Optional. Helps you remember when you last refreshed Captivate stats.",
        },
      ],
    },

    {
      name: "active",
      title: "Active",
      type: "boolean",
      initialValue: true,
    },
    {
      name: "sortOrder",
      title: "Sort Order",
      type: "number",
      initialValue: 100,
    },
  ],
  preview: {
    select: { title: "title", subtitle: "shortDescription" },
  },
};

export default podcastShow;
