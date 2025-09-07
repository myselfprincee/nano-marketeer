import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: 'res.cloudinary.com',
        pathname: "/princeecloud/image/upload/**"
      },
      {
        protocol: "https",
        hostname: 'pub-9019c1c749314af881f08068ab68abc1.r2.dev',
        pathname: "**"
      }
    ]
  },
};

export default nextConfig;
