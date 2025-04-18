import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async headers() {
    return [
      {
        source: "/:path*.br",
        headers: [
          {
            key: "Content-Encoding",
            value: "br",
          },
          {
            key: "Content-Type",
            value: "application/javascript",
          },
        ],
      },
    ];
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.br$/,
      use: [
        {
          loader: "file-loader",
          options: {
            name: "[name].[ext]",
          },
        },
      ],
    });
    return config;
  },
};

export default nextConfig;
