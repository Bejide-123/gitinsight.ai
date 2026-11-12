import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "github.com",
      }
    ],
  },
  async headers() {
    if (process.env.NODE_ENV !== "production") {
      return [];
    }

    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
