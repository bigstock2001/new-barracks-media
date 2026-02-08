// sanity/schemaTypes/index.ts
import { type SchemaTypeDefinition } from "sanity";

import service from "./service";
import networkMetrics from "./networkMetrics";

// Existing podcast schemas
import podcastShow from "./podcastShow";
import podcastEpisode from "./podcastEpisode";

// ✅ NEW: Episode Blog Posts (SEO / Show Notes)
import episodePost from "./episodePost";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    service,
    networkMetrics,

    podcastShow,
    podcastEpisode,

    // ✅ SEO Blog / Episode Show Notes
    episodePost,
  ],
};
