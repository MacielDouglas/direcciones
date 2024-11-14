import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
// https://direcciones.vercel.app/graphql
// target: "http://localhost:8000",
export default defineConfig({
  server: {
    proxy: {
      "/graphql": {
        target: "https://direcciones.vercel.app",
        changeOrigin: true,
        secure: true,
      },
    },
  },
  plugins: [react()],
});
