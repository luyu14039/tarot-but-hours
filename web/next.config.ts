import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';
const repoName = 'tarot-but-hours';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: isProd ? `/${repoName}` : '',
  assetPrefix: isProd ? `/${repoName}/` : '',
  env: {
    NEXT_PUBLIC_BASE_PATH: isProd ? `/${repoName}` : '',
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
