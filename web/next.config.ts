import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  /* config options here */
  turbopack: {
    root: process.cwd(),
  }
};

export default nextConfig;
