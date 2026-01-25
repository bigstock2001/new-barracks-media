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
  const services = await sanityClient.fetch(query, {}, { cache: "no-store" });
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
  const service = await sanityClient.fetch(query, { slug }, { cache: "no-store" });
  return service || null;
}

/**
 * Network Metrics (Rolling 30 days)
 * ✅ Uses GROQ select() (NO ternary operator)
 * ✅ Disables Next fetch caching
 */
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
      notes,
      publicMethodology,

      "estimatedTotalReach30d":
        coalesce(podcastDownloads30d, 0)
        + coalesce(socialReach30d, 0)
        + select(
            includeVideoInTotal == true => coalesce(videoViews30d, 0),
            0
          )
    }
  `;

  const metrics = await sanityClient.fetch(query, {}, { cache: "no-store" });
  return metrics || null;
}

/**
 * Podcast Shows (optional, but nice for later)
 */
export async function getPodcastShows(limit = 100) {
  const query = /* groq */ `
    *[
      _type == "podcastShow"
      && active == true
      && !(_id in path("drafts.**"))
    ]
    | order(sortOrder asc, title asc)[0...$limit]{
      _id,
      title,
      "slug": slug.current,
      shortDescription,
      tags,
      active,
      sortOrder
    }
  `;
  const shows = await sanityClient.fetch(query, { limit }, { cache: "no-store" });
  return Array.isArray(shows) ? shows : [];
}

/**
 * Episodes for Kate recommendations
 * Pull a batch; we score locally against the user's question.
 */
export async function getPodcastEpisodesForRecommendations(limit = 250) {
  const query = /* groq */ `
    *[
      _type == "podcastEpisode"
      && active == true
      && !(_id in path("drafts.**"))
    ]
    | order(publishedAt desc, sortOrder asc, title asc)[0...$limit]{
      _id,
      title,
      publishedAt,
      description,
      tags,
      youtubeUrl,
      episodePageUrl,
      "showTitle": show->title,
      "showSlug": show->slug.current
    }
  `;
  const episodes = await sanityClient.fetch(query, { limit }, { cache: "no-store" });
  return Array.isArray(episodes) ? episodes : [];
}

/**
 * ✅ NEW: Leaderboard Shows (scored + sorted)
 *
 * We read these fields from podcastShow.leaderboard:
 * - downloads7
 * - downloads28
 * - uniqueListeners28
 * - engagementScore
 * - consistency
 *
 * Scoring weights:
 * - Downloads 7d: 30%
 * - Downloads 28d: 20%
 * - Unique Listeners 28d: 25%
 * - Engagement score: 15%
 * - Consistency: 10%
 */
export async function getLeaderboardShows(limit = 100) {
  const query = /* groq */ `
    *[
      _type == "podcastShow"
      && active == true
      && !(_id in path("drafts.**"))
    ]{
      _id,
      title,
      "slug": slug.current,
      shortDescription,
      tags,
      sortOrder,

      "downloads7": coalesce(leaderboard.downloads7, 0),
      "downloads28": coalesce(leaderboard.downloads28, 0),
      "uniqueListeners28": coalesce(leaderboard.uniqueListeners28, 0),
      "engagementScore": coalesce(leaderboard.engagementScore, 0),
      "consistency": coalesce(leaderboard.consistency, 0),
      "lastUpdated": leaderboard.lastUpdated,

      "score":
        (coalesce(leaderboard.downloads7, 0) * 0.30)
        + (coalesce(leaderboard.downloads28, 0) * 0.20)
        + (coalesce(leaderboard.uniqueListeners28, 0) * 0.25)
        + (coalesce(leaderboard.engagementScore, 0) * 0.15)
        + (coalesce(leaderboard.consistency, 0) * 10 * 0.10)
    }
    | order(score desc, sortOrder asc, title asc)[0...$limit]
  `;

  const shows = await sanityClient.fetch(query, { limit }, { cache: "no-store" });
  return Array.isArray(shows) ? shows : [];
}

/**
 * ✅ NEW: Leaderboard Categories
 * category:
 * - overall   (score desc)
 * - trending  (downloads7 desc)
 * - audience  (uniqueListeners28 desc)
 * - engaged   (engagementScore desc)
 */
export async function getLeaderboardShowsByCategory(category = "overall", limit = 100) {
  const base = /* groq */ `
    *[
      _type == "podcastShow"
      && active == true
      && !(_id in path("drafts.**"))
    ]{
      _id,
      title,
      "slug": slug.current,
      shortDescription,
      tags,
      sortOrder,

      "downloads7": coalesce(leaderboard.downloads7, 0),
      "downloads28": coalesce(leaderboard.downloads28, 0),
      "uniqueListeners28": coalesce(leaderboard.uniqueListeners28, 0),
      "engagementScore": coalesce(leaderboard.engagementScore, 0),
      "consistency": coalesce(leaderboard.consistency, 0),
      "lastUpdated": leaderboard.lastUpdated,

      "score":
        (coalesce(leaderboard.downloads7, 0) * 0.30)
        + (coalesce(leaderboard.downloads28, 0) * 0.20)
        + (coalesce(leaderboard.uniqueListeners28, 0) * 0.25)
        + (coalesce(leaderboard.engagementScore, 0) * 0.15)
        + (coalesce(leaderboard.consistency, 0) * 10 * 0.10)
    }
  `;

  let orderClause = `| order(score desc, sortOrder asc, title asc)`;
  if (category === "trending") orderClause = `| order(downloads7 desc, score desc, title asc)`;
  if (category === "audience") orderClause = `| order(uniqueListeners28 desc, score desc, title asc)`;
  if (category === "engaged") orderClause = `| order(engagementScore desc, score desc, title asc)`;

  const query = `${base} ${orderClause}[0...$limit]`;

  const shows = await sanityClient.fetch(query, { limit }, { cache: "no-store" });
  return Array.isArray(shows) ? shows : [];
}
