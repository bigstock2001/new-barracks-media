// sanity/schemaTypes/index.ts
import { type SchemaTypeDefinition } from "sanity";

import service from "./service";
import networkMetrics from "./networkMetrics";

// ✅ NEW
import podcastShow from "./podcastShow";
import podcastEpisode from "./podcastEpisode";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    service,
    networkMetrics,

    // ✅ NEW
    podcastShow,
    podcastEpisode,
  ],
};
