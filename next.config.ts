import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "davidwhyte.com" },
    ],
  },
  async headers() {
    return [
      {
        source: '/',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
        ],
      },
      {
        source: '/index.html',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
        ],
      },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/',
          destination: '/index.html',
        },
      ],
      fallback: [
        {
          source: '/wp-content/themes/fatmanur/:path*',
          destination: 'https://davidwhyte.com/wp-content/themes/davidwhyte/:path*'
        },
        {
          source: '/:path*',
          destination: 'https://davidwhyte.com/:path*',
        },
      ],
    };
  },
};

export default nextConfig;
