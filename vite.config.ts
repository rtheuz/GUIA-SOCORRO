import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => ({
  // MOVE BASE HERE - This is the "Gold" fix
  base: mode === 'production' ? '/GUIA-SOCORRO/' : '/',

  server: {
    host: "::",
    port: 8080,
    allowedHosts: ['https://curvy-singers-fry.loca.lt/'], 
    hmr: { overlay: false },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    VitePWA({
      // REMOVE base from here (it's redundant now)
      registerType: "autoUpdate",
      includeAssets: ["favicon.png", "icons/icon-192.png", "icons/icon-512.png"],
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,json,woff2}"],
        navigateFallbackDenylist: [/^\/~oauth/],
        // ... (keep your runtimeCaching as is)
      },
      manifest: {
        name: "GUIA SOCORRO",
        short_name: "GUIA SOCORRO",
        description: "Guia de emergência médica e localização de serviços de saúde em Santo André - SP",
        theme_color: "#c40000",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait",
        start_url: "./index.html", 
        icons: [
          { src: "icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icons/icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));