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
    domains: ["localhost"], // Adjust the domain if your images are hosted elsewhere
  },
};

export default nextConfig;
