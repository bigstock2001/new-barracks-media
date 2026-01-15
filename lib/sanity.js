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
  useCdn: false,
});

/* ---------------------------------------------
   SERVICES
--------------------------------------------- */

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
  image {
    alt,
    asset->{ url }
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
  return await sanityClient.fetch(query);
}

export async function getServiceBySlug(slug) {
  if (!slug) return null;

  const query = /* groq */ `
    *[
      _type == "service"
      && slug.current == $slug
      && active == true
      && !(_id in path("drafts.**"))
    ][0]
    ${SERVICE_FIELDS}
  `;
  return await sanityClient.fetch(query, { slug });
}

/* ---------------------------------------------
   NETWORK METRICS (ROLLING 30 DAYS)
--------------------------------------------- */

export async function getNetworkMetrics() {
  const query = /* groq */ `
    *[
      _type == "networkMetrics"
      && !(_id in path("drafts.**"))
    ]
    | order(lastUpdated desc)[0]{
      _id,
      title,
      periodDays,
      podcastDownloads30d,
      socialReach30d,
      videoViews30d,
      includeVideoInTotal,
      lastUpdated,
      publicMethodology,
      notes,

      "estimatedTotalReach30d":
        podcastDownloads30d
        + socialReach30d
        + (
          includeVideoInTotal == true
          && defined(videoViews30d)
          ? videoViews30d
          : 0
        )
    }
  `;

  return await sanityClient.fetch(query);
}
