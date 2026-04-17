/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Required for server actions
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
