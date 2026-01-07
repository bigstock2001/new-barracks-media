import type { StructureResolver } from "sanity/structure";

export const deskStructure: StructureResolver = (S) => S.list().title("Content").items(S.documentTypeListItems());
