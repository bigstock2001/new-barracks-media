export default {
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "YOUR_PROJECT_ID",
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  },
};
