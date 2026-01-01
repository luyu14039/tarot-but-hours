import type { NextConfig } from "next";

const repoName = 'tarot-but-hours';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: `/${repoName}`,
  assetPrefix: `/${repoName}/`,
  env: {
    NEXT_PUBLIC_BASE_PATH: `/${repoName}`,
  },
  images: {
    unoptimized: true,
  },
  /* config options here */
  turbopack: {
    root: process.cwd(),
  }
};

export default nextConfig;
