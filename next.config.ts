import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "187.124.157.146",
        port: "5001",
        pathname: "/uploads/**",
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://187.124.157.146:5001/api/:path*",
      },
      {
        source: "/uploads/:path*",
        destination: "http://187.124.157.146:5001/uploads/:path*",
      },
    ];
  },
};

export default nextConfig;