import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  compress: true,

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
      {
        source: "/:path*.wasm",
        headers: [
          {
            key: "Content-Type",
            value: "application/wasm",
          },
        ],
      },
      {
        source: "/:path*.wasm.br",
        headers: [
          {
            key: "Content-Type",
            value: "application/wasm",
          },
        ],
      },
      {
        source: "/:path*.wasm.gz",
        headers: [
          {
            key: "Content-Type",
            value: "application/wasm",
          },
        ],
      },
      {
        source: "/:path*.data",
        headers: [
          {
            key: "Content-Type",
            value: "application/octet-stream",
          },
        ],
      },
      {
        source: "/:path*.data.gz",
        headers: [
          {
            key: "Content-Type",
            value: "application/gzip",
          },
        ],
      },
      {
        source: "/.well-known/apple-app-site-association",
        headers: [
          {
            key: "Content-Type",
            value: "application/json",
          },
          {
            key: "Content-Disposition",
            value: "inline",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=3600",
          },
        ],
      },

      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
      {
        source: "/sw.js",
        headers: [
          {
            key: "Content-Type",
            value: "application/javascript; charset=utf-8",
          },
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self'",
          },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "frame-src 'self' https://x.cartridge.gg https://cartridge.gg https://*.cartridge.gg",
              "connect-src 'self' https://x.cartridge.gg https://cartridge.gg https://*.cartridge.gg wss: https://discord.com",
            ].join("; "),
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

    // Додаємо правило для WASM файлів
    config.module.rules.push({
      test: /\.wasm$/,
      type: "asset/resource",
    });

    // Додаємо правило для .data файлів
    config.module.rules.push({
      test: /\.data$/,
      type: "asset/resource",
    });

    // Включаємо експериментальну підтримку WASM
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };

    return config;
  },
};

export default nextConfig;
