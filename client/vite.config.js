import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  server: {
    proxy: {
      "/graphql": {
        // target:
        //   "https://personal-address-git-test-websocket-douglas-projects-83bb388e.vercel.app",
        // target: "https://direcciones.onrender.com",
        target: "https://direcciones.vercel.app",
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
  plugins: [react()],
});
