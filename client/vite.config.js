import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Para produção, o frontend será servido pela API, na raiz do serviço
  base: "/",

  // Configuração do servidor para desenvolvimento
  server: {
    proxy: {
      "/graphql": {
        // Durante o desenvolvimento, faz o proxy para o Render ou sua API local
        target: "https://direcciones.onrender.com", // API no Render
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },

  // Plugins
  plugins: [react()],
});

// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// export default defineConfig({
//   server: {
//     proxy: {
//       "/graphql": {
//         // target: "http://localhost:8000",
//         target: "https://direccioness.onrender.com",
//         changeOrigin: true,
//         secure: false,
//         ws: true,
//       },
//     },
//   },
//   plugins: [react()],
// });
