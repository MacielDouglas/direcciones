// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// export default defineConfig({
//   // Para produção, o frontend será servido pela API, na raiz do serviço
//   base: "/",
//   // Configuração do servidor para desenvolvimento
//   server: {
//     proxy: {
//       "/graphql": {
//         // Durante o desenvolvimento, faz o proxy para o Render ou sua API local
//         target: "https://direcciones.onrender.com", // API no Render
//         changeOrigin: true,
//         secure: false,
//         ws: true,
//       },
//     },
//   },

//   // Plugins
//   plugins: [react()],
//   build: {
//     rollupOptions: {
//       output: {
//         manualChunks: {
//           vendor: ["react", "react-dom"], // Exemplo: cria um chunk separado para bibliotecas
//         },
//       },
//     },
//   },
// });

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  server: {
    proxy: {
      "/graphql": {
        target:
          "https://personal-address-git-test-websocket-douglas-projects-83bb388e.vercel.app",
        // target: "https://direccioness.onrender.com",
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
  plugins: [react()],
});
