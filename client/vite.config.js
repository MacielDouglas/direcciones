import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/graphql": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react()],
});
