import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { apiVersion, dataset, projectId } from "./sanity/env";
import { schemaTypes } from "./sanity/schemaTypes";
import { deskStructure } from "./sanity/deskStructure";

export default defineConfig({
  name: "default",
  title: "Barracks Media Studio",

  projectId,
  dataset,
  apiVersion,

  basePath: "/studio",

  schema: {
    types: schemaTypes,
  },

  plugins: [
    structureTool({ structure: deskStructure }),
    visionTool(),
  ],
});
