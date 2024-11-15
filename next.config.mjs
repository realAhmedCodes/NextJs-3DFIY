/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/api/socket",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store",
          },
        ],
      },
    ];
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false, os: false };
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.free3d.com",
      },
      {
        protocol: "https",
        hostname: "preview.free3d.com",
      },
      {
        protocol: "https",
        hostname: "localhost",
      },
    ],
  },
};

export default nextConfig;
