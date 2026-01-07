import { type SchemaTypeDefinition } from "sanity";
import service from "./service";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [service],
};
