import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }),
    react(),
  ],
  // base: "/surat/",
  build: {
    target: ["chrome80", "firefox99", "edge80", "safari14"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/files": {
        target: "http://localhost:3010",
        changeOrigin: true,
        rewrite: (path) => `/api/surat${path}`,
      },
    },
  },
});
