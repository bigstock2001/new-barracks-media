/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ Force stable webpack builds on Vercel (avoids Turbopack internal crash)
  webpack: (config) => config,

  // Optional: helps avoid weird cache behavior during rapid changes
  experimental: {
    // Keep Turbopack features off in production builds where possible
  },
};

export default nextConfig;
