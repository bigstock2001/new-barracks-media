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
