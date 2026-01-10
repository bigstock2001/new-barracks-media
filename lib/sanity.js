// lib/sanity.js
import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

if (!projectId || !dataset) {
  throw new Error(
    "Missing Sanity env vars. Set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET."
  );
}

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  useCdn: true, // fine for public pages
});

/**
 * Returns all published services.
 * Normalizes slug to a string: "slug": slug.current
 */
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

/**
 * Returns a single published service by slug (string).
 * Normalizes slug to a string: "slug": slug.current
 */
export async function getServiceBySlug(slug) {
  if (!slug || typeof slug !== "string") return null;

  const query = /* groq */ `
    *[
      _type == "service"
      && slug.current == $slug
      && !(_id in path("drafts.**"))
    ][0]{
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

  const service = await sanityClient.fetch(query, { slug });
  return service || null;
}
