import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
// https://direcciones.vercel.app/graphql
export default defineConfig({
  server: {
    proxy: {
      "/graphql": {
        // target: "http://localhost:8000",
        // target: "https://direcciones.vercel.app",
        target: "https://apidirecciones-production.up.railway.app",
        changeOrigin: true,
        secure: true,
      },
    },
  },
  plugins: [react()],
});
