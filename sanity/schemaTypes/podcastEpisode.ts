// sanity/schemaTypes/podcastEpisode.ts
import type { SchemaTypeDefinition } from "sanity";

const podcastEpisode: SchemaTypeDefinition = {
  name: "podcastEpisode",
  title: "Podcast Episode",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Episode Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "show",
      title: "Show",
      type: "reference",
      to: [{ type: "podcastShow" }],
      validation: (Rule) => Rule.required(),
    },
    {
      name: "publishedAt",
      title: "Published Date",
      type: "datetime",
    },
    {
      name: "description",
      title: "Episode Description (YouTube Description)",
      type: "text",
      rows: 10,
      validation: (Rule) => Rule.required(),
      description:
        "Paste your YouTube description here. Kate uses this + tags to recommend episodes.",
    },
    {
      name: "tags",
      title: "Tags (YouTube Tags)",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      description:
        "Use tags like entrepreneurship, veterans, healing, writing, podcasting, etc.",
    },
    {
      name: "youtubeUrl",
      title: "YouTube URL",
      type: "url",
      description: "Optional: link to the YouTube episode.",
    },
    {
      name: "episodePageUrl",
      title: "Episode Page URL",
      type: "string",
      description:
        "Optional: internal site path (example: /podcasts/authors-after-action/ep-12).",
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
  orderings: [
    {
      title: "Published date (newest)",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
    {
      title: "Sort order",
      name: "sortOrderAsc",
      by: [{ field: "sortOrder", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      showTitle: "show.title",
      publishedAt: "publishedAt",
    },
    prepare({ title, showTitle, publishedAt }) {
      const when = publishedAt
        ? new Date(publishedAt as string).toLocaleDateString()
        : "No date";
      return { title, subtitle: `${(showTitle as string) || "Unknown show"} • ${when}` };
    },
  },
};

export default podcastEpisode;
