// sanity/schemaTypes/index.ts
import { type SchemaTypeDefinition } from "sanity";

import service from "./service";
import networkMetrics from "./networkMetrics";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    service,
    networkMetrics,
  ],
};
