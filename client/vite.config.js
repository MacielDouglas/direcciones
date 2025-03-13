import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  server: {
    proxy: {
      "/graphql": {
        target: process.env.VITE_API_URL || "http://localhost:4000", // Usa a variável de ambiente ou o valor padrão
        changeOrigin: true,
        secure: true,
      },
      "/sse/cards": {
        target: process.env.VITE_API_URL || "http://localhost:4000", // Usa a variável de ambiente ou o valor padrão
        changeOrigin: true,
        secure: true,
      },
    },
  },
  plugins: [react()],
});

// target: "http://localhost:4000/graphql", // Backend URL for HTTP
// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// export default defineConfig({
//   server: {
//     proxy: {
//       "/graphql": {
//         changeOrigin: true,
//         secure: false,
//       },
//     },
//   },
//   plugins: [react()],
// });

// // https://vite.dev/config/
// // export default defineConfig({
// //   server: {
// //     proxy: {
// //       "/graphql": {
// //         target: "http://localhost:4000", // Configuração do HTTP
// //         changeOrigin: true,
// //         secure: false, // Deixe "false" se estiver em ambiente de desenvolvimento local
// //       },
// //       "/graphql-ws": {
// //         target: "ws://localhost:4000", // Configuração para WebSocket
// //         ws: true, // Especifica que a conexão é WebSocket
// //       },
// //     },
// //   },
// //   plugins: [react()],
// // });

// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// // https://vite.dev/config/
// // https://direcciones.vercel.app/graphql
// export default defineConfig({
//   server: {
//     proxy: {
//       "/graphql": {
//         target: "http://localhost:4000",
//         // target: "https://direcciones.vercel.app",
//         // target: "https://apidirecciones-production.up.railway.app",
//         changeOrigin: true,
//         secure: false,
//         ws: true,
//       },
//     },
//   },
//   plugins: [react()],
// });
