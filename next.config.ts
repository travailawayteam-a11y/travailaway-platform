import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // Old "Work with us" address, kept so any old link still works.
      { source: "/work-with-us", destination: "/volunteer", permanent: false },
    ];
  },
};

export default nextConfig;
