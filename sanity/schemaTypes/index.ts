import type { SchemaTypeDefinition } from "sanity";
import service from "./service";
import networkMetrics from "./networkMetrics";

export const schemaTypes: SchemaTypeDefinition[] = [
  service,
  networkMetrics as SchemaTypeDefinition,
];

// ✅ sanity.config.ts expects this export name
export const schema = {
  types: schemaTypes,
};
