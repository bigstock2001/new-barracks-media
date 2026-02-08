/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ Next 16 uses Turbopack by default on Vercel.
  // Adding an empty turbopack config avoids conflicts and build errors.
  turbopack: {},
};

export default nextConfig;
