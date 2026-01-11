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
  useCdn: false, // ✅ OFF for instant updates while debugging
});

const SERVICE_FIELDS = /* groq */ `
{
  _id,
  title,
  "slug": slug.current,
  shortDescription,
  longDescription,
  features,
  ctaLabel,
  stripeMode,
  stripeLookupKey,
  successPath,
  active,
  sortOrder,

  // ✅ Service Image
  image {
    alt,
    asset->{
      url
    }
  }
}
`;

export async function getServices() {
  const query = /* groq */ `
    *[
      _type == "service"
      && active == true
      && !(_id in path("drafts.**"))
    ]
    | order(sortOrder asc, title asc)
    ${SERVICE_FIELDS}
  `;
  const services = await sanityClient.fetch(query);
  return Array.isArray(services) ? services : [];
}

export async function getServiceBySlug(slug) {
  if (!slug || typeof slug !== "string") return null;

  const query = /* groq */ `
    *[
      _type == "service"
      && slug.current == $slug
      && active == true
      && !(_id in path("drafts.**"))
    ][0]
    ${SERVICE_FIELDS}
  `;
  const service = await sanityClient.fetch(query, { slug });
  return service || null;
}
