// sanity.config.ts
import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { visionTool } from "@sanity/vision";

import { apiVersion, dataset, projectId } from "./sanity/env";
import { schema } from "./sanity/schemaTypes";
import { deskStructure } from "./sanity/deskStructure";

export default defineConfig({
  name: "default",
  title: "Barracks Media",
  projectId,
  dataset,
  apiVersion,
  basePath: "/studio",

  plugins: [
    deskTool({ structure: deskStructure }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],

  // ✅ Your schemaTypes file already exports { types: [] }
  schema,
});
