// sanity.config.ts
import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { visionTool } from "@sanity/vision";

import { schema } from "./sanity/schemaTypes";
import { deskStructure } from "./sanity/deskStructure";

export default defineConfig({
  name: "default",
  title: "Barracks Media",

  // 🔒 HARD LOCK — avoids CLI/env conflicts
  projectId: "jemktqop",
  dataset: "production",
  apiVersion: "2024-01-01",

  basePath: "/studio",

  plugins: [
    deskTool({ structure: deskStructure }),
    visionTool({ defaultApiVersion: "2024-01-01" }),
  ],

  schema,
});
