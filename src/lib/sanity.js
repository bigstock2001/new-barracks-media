import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

if (!projectId || !dataset) {
  // Don’t throw at import-time in production builds, but make it obvious in dev.
  console.warn(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET"
  );
}

export const sanity = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  useCdn: true,
});

export async function getServices() {
  return sanity.fetch(
    `*[_type=="service" && active==true] | order(sortOrder asc, title asc) {
      _id,
      title,
      "slug": slug.current,
      shortDescription,
      features,
      ctaLabel,
      stripeMode,
      stripePriceId,
      successPath
    }`
  );
}

export async function getServiceBySlug(slug) {
  return sanity.fetch(
    `*[_type=="service" && slug.current==$slug][0]{
      _id,
      title,
      "slug": slug.current,
      shortDescription,
      longDescription,
      features,
      ctaLabel,
      stripeMode,
      stripePriceId,
      successPath,
      active
    }`,
    { slug }
  );
}
