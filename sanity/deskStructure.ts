// sanity/deskStructure.ts
import type { StructureResolver } from "sanity/desk";

export const deskStructure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      // Default document type list items
      ...S.documentTypeListItems(),
    ]);
