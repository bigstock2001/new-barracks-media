// sanity/schemaTypes/networkMetrics.js

export default {
  name: "networkMetrics",
  title: "Network Metrics",
  type: "document",

  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      initialValue: "Rolling 30-Day Network Metrics",
      validation: (Rule) => Rule.required(),
    },

    {
      name: "periodDays",
      title: "Rolling Period (Days)",
      type: "number",
      initialValue: 30,
      validation: (Rule) => Rule.required().min(1).max(365),
    },

    {
      name: "podcastDownloads30d",
      title: "Podcast Downloads (Rolling 30 Days)",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    },

    {
      name: "socialReach30d",
      title: "Social Reach / Impressions (Rolling 30 Days)",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    },

    {
      name: "videoViews30d",
      title: "Video Views (Rolling 30 Days)",
      type: "number",
      description: "Optional — only used if included in total.",
      validation: (Rule) => Rule.min(0),
    },

    {
      name: "includeVideoInTotal",
      title: "Include Video Views in Estimated Total?",
      type: "boolean",
      initialValue: false,
    },

    {
      name: "lastUpdated",
      title: "Last Updated",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    },

    {
      name: "publicMethodology",
      title: "Public Methodology (Optional)",
      type: "text",
      description:
        "Optional explanation shown on the Sponsorship page. Keep sponsor-friendly.",
    },

    {
      name: "notes",
      title: "Internal Notes",
      type: "text",
      description:
        "Internal only — where the numbers came from (Captivate report date, Metricool range, etc.)",
    },
  ],

  preview: {
    select: {
      title: "title",
      downloads: "podcastDownloads30d",
      reach: "socialReach30d",
      updated: "lastUpdated",
    },
    prepare({ title, downloads, reach, updated }) {
      return {
        title,
        subtitle: `Downloads: ${downloads ?? 0} • Social: ${
          reach ?? 0
        } • Updated: ${
          updated ? new Date(updated).toLocaleDateString() : "—"
        }`,
      };
    },
  },
};
