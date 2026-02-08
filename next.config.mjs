/** @type {import('next').NextConfig} */
const nextConfig = {
  // 🔥 CRITICAL: force Next to use server rendering, not static export
  output: "standalone",

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
