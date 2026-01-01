import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';
const repoName = 'tarot-but-hours'; // 如果您的仓库名不是这个，请修改此处

const nextConfig: NextConfig = {
  output: 'export',
  basePath: isProd ? `/${repoName}` : '',
  assetPrefix: isProd ? `/${repoName}/` : '',
  images: {
    unoptimized: true,
  },
  /* config options here */
  turbopack: {
    root: process.cwd(),
  }
};

export default nextConfig;
