// lib/sanity.ts
import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

if (!projectId || !dataset) {
  // This fails loudly instead of silently showing an empty page.
  throw new Error(
    "Missing Sanity env vars. Set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET."
  );
}

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  useCdn: true, // fine for public services list
});

export async function getServices() {
  const query = /* groq */ `
    *[
      _type == "service"
      && !(_id in path("drafts.**"))
    ]
    | order(title asc)
    {
      _id,
      title,
      "slug": slug.current,
      shortDescription,
      features,
      ctaLabel,
      stripeMode,
      lookupKey,
      stripePriceId
    }
  `;

  const services = await sanityClient.fetch(query);
  return Array.isArray(services) ? services : [];
}
