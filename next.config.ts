import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true // Ignore TypeScript errors during build
  },
  eslint: {
    ignoreDuringBuilds: true // Ignore ESLint errors during build
  },
  output: 'standalone' // Output as standalone build
  /* config options here */
};

export default nextConfig;
