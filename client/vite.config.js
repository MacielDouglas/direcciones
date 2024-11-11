import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/graphql": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: true,
      },
    },
  },
  plugins: [react()],
});
