import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable PostCSS since we're not using Tailwind
  experimental: {
    optimizeCss: false,
  },
};

export default nextConfig;
