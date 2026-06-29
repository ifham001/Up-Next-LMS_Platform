import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  crossOrigin: "anonymous",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "storage.googleapis.com" },
      { protocol: "https", hostname: "lms-platform12.storage.googleapis.com" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};


export default nextConfig;
