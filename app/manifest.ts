import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Evolute Kingdom: Mage Duel",
    short_name: "Mage Duel",
    description: "A WebGL game by EvoluteStudio",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    orientation: "landscape",
    icons: [
      {
        src: "icon-72.png",
        sizes: "72x72",
        type: "image/png",
      },
      {
        src: "icon-128.png",
        sizes: "128x128",
        type: "image/png",
      },
      {
        src: "icon-144.png",
        sizes: "144x144",
        type: "image/png",
      },
      {
        src: "icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "icon-1024.png",
        sizes: "1024x1024",
        type: "image/png",
      },
    ],
  };
}
