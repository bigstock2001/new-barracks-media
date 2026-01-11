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

    // ✅ NEW: Service Image (upload inside Sanity)
    defineField({
      name: "image",
      title: "Service Image",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
          description: "Short description for accessibility & SEO.",
        }),
      ],
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

    // ✅ lookup key replaces price ID
    defineField({
      name: "stripeLookupKey",
      title: "Stripe Lookup Key",
      type: "string",
      description:
        "Matches the Stripe PRICE lookup key (not the Product). Example: starter_website",
      validation: (Rule) =>
        Rule.required()
          .min(3)
          .max(128)
          .regex(/^[a-z0-9_-]+$/, {
            name: "lookupKeyFormat",
            invert: false,
          })
          .error(
            "Use lowercase letters/numbers with underscores or hyphens only (example: starter_website)."
          ),
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
