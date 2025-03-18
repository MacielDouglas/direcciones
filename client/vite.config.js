import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  server: {
    proxy: {
      "/graphql": {
        // target: "https://apidirecciones-production.up.railway.app", // Backend URL for HTTP
        // target: "http://localhost:4000", // Backend URL for HTTP
        target: "https://api-direcciones.onrender.com", // Backend URL for HTTP

        changeOrigin: true,
        secure: true,
        // ws: true, // Enable WebSocket proxying
      },
    },
  },
  plugins: [react()],
});

// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// export default defineConfig({
//   server: {
//     proxy: {
//       "/graphql": {
//         target: "http://localhost:4000",
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
