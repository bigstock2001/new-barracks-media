import { defineType, defineField } from "sanity";

export default defineType({
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "shortDescription",
      title: "Short Description (Card)",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "longDescription",
      title: "Long Description (Page)",
      type: "array",
      of: [{ type: "block" }],
    }),

    defineField({
      name: "features",
      title: "Features (Bullets)",
      type: "array",
      of: [{ type: "string" }],
    }),

    defineField({
      name: "ctaLabel",
      title: "CTA Label",
      type: "string",
      initialValue: "Get Started",
    }),

    defineField({
      name: "stripeMode",
      title: "Stripe Mode",
      type: "string",
      options: {
        list: [
          { title: "One-time payment", value: "payment" },
          { title: "Subscription", value: "subscription" },
        ],
        layout: "radio",
      },
      initialValue: "payment",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "stripePriceId",
      title: "Stripe Price ID",
      type: "string",
      description: "Example: price_123...",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "successPath",
      title: "Success Path (Onboarding Page)",
      type: "string",
      description: "Example: /onboarding/web-design",
    }),

    defineField({
      name: "active",
      title: "Active",
      type: "boolean",
      initialValue: true,
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "sortOrder",
      title: "Sort Order",
      type: "number",
      initialValue: 10,
    }),
  ],
});
