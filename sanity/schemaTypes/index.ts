import { type SchemaTypeDefinition } from "sanity";
import service from "./service";
import networkMetrics from "./networkMetrics";

export const schemaTypes: SchemaTypeDefinition[] = [
  service,
  networkMetrics,
];
