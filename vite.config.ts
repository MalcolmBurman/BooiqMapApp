import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  server: {
    host: true,
    port: 5173,
    watch: {
      usePolling: true,
    },
    hmr: {
      host: "localhost",
      port: 5173,
    },
    proxy: {
      "/api/auth": {
        target: "http://api:3001",
        changeOrigin: true,
      },
    },
  },
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
});
