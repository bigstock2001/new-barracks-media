// sanity/schemaTypes/episodePost.js

export default {
  name: "episodePost",
  title: "Episode Blog Post",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Post Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "publishedAt",
      title: "Published Date",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "excerpt",
      title: "Excerpt / Meta Description",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.max(160),
    },
    {
      name: "featuredImage",
      title: "Featured Image",
      type: "image",
      options: { hotspot: true },
    },
    {
      name: "body",
      title: "Episode Show Notes & Content",
      type: "array",
      of: [{ type: "block" }],
      validation: (Rule) => Rule.required(),
    },

    {
      name: "showName",
      title: "Podcast Show Name",
      type: "string",
    },
    {
      name: "episodeNumber",
      title: "Episode Number",
      type: "string",
    },
    {
      name: "guestName",
      title: "Guest Name",
      type: "string",
    },
    {
      name: "episodeEmbedUrl",
      title: "Episode Embed URL",
      type: "url",
    },
    {
      name: "episodeDuration",
      title: "Episode Duration",
      type: "string",
    },

    {
      name: "seoTitle",
      title: "SEO Title (Optional Override)",
      type: "string",
    },
    {
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
      rows: 3,
    },

    {
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
    },
  ],
};
