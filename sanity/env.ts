// sanity/env.ts
/**
 * Sanity Studio env loader (safe for deploy)
 *
 * ✅ Supports both:
 * - SANITY_STUDIO_PROJECT_ID / SANITY_STUDIO_DATASET (recommended)
 * - NEXT_PUBLIC_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_DATASET (fallback)
 *
 * ✅ Strips quotes + trims whitespace
 * ✅ Validates projectId format required by Sanity CLI
 */

function clean(value: string | undefined) {
  if (!value) return "";
  // trim whitespace and remove wrapping quotes if present
  return value.trim().replace(/^['"]|['"]$/g, "");
}

const rawProjectId =
  clean(process.env.SANITY_STUDIO_PROJECT_ID) ||
  clean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);

const rawDataset =
  clean(process.env.SANITY_STUDIO_DATASET) ||
  clean(process.env.NEXT_PUBLIC_SANITY_DATASET) ||
  "production";

export const projectId = rawProjectId;
export const dataset = rawDataset;

// Keep a stable apiVersion for Studio tools
export const apiVersion = "2024-01-01";

// Validate projectId: only a-z, 0-9, dashes
const validProjectId = /^[a-z0-9-]+$/;

if (!projectId) {
  throw new Error(
    `Missing Sanity projectId. Set SANITY_STUDIO_PROJECT_ID (recommended) or NEXT_PUBLIC_SANITY_PROJECT_ID.`
  );
}

if (!validProjectId.test(projectId)) {
  throw new Error(
    `Invalid Sanity projectId "${projectId}". It must contain only a-z, 0-9, and dashes.\n` +
      `Fix your env vars:\n` +
      `- SANITY_STUDIO_PROJECT_ID=xxxxx\n` +
      `- SANITY_STUDIO_DATASET=production\n` +
      `or\n` +
      `- NEXT_PUBLIC_SANITY_PROJECT_ID=xxxxx\n` +
      `- NEXT_PUBLIC_SANITY_DATASET=production\n`
  );
}
