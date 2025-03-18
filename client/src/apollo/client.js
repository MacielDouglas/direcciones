import { ApolloClient, InMemoryCache, HttpLink, split } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";

// HTTP link para queries e mutations
const httpLink = new HttpLink({
  uri: "/graphql", // URL da API GraphQL
  credentials: "include", // Inclui cookies para autenticação
});

// WebSocket link para subscriptions
const wsLink = new GraphQLWsLink(
  createClient({
    url: "wss://api-direcciones.onrender.com/graphql", // WebSocket endpoint
    connectionParams: {
      credentials: "include", // Inclui cookies para autenticação
    },
    on: {
      connected: () => console.log("✅ WebSocket conectado"),
      error: (err) => console.error("❌ Erro no WebSocket:", err),
      closed: () => console.log("🔴 WebSocket desconectado"),
    },
  })
);

// Split link para usar WebSocket para subscriptions e HTTP para o resto
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink, // Usa WebSocket para subscriptions
  httpLink // Usa HTTP para queries e mutations
);

// Instância do Apollo Client
export const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

// import { ApolloClient, InMemoryCache, HttpLink, split } from "@apollo/client";
// import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
// import { createClient } from "graphql-ws";
// import { getMainDefinition } from "@apollo/client/utilities";

// // https://apidirecciones-production.up.railway.app/
// // HTTP link for queries and mutations
// const httpLink = new HttpLink({
//   uri: "/graphql", // Proxy to the backend
//   credentials: "include", // Include cookies for authentication
// });

// // WebSocket link for subscriptions
// const wsLink = new GraphQLWsLink(
//   createClient({
//     // url: "ws://localhost:4000/graphql", // WebSocket endpoint
//     url: "wss://api-direcciones.onrender.com/graphql", // WebSocket endpoint
//     // url: "wss://apidirecciones-production.up.railway.app/graphql",
//     connectionParams: {
//       credentials: "include",
//     },
//     on: {
//       connected: () => console.log("✅ WebSocket connected"),
//       error: (err) => console.error("❌ WebSocket error:", err),
//       closed: () => console.log("🔴 WebSocket closed"),
//     },
//   })
// );

// // Split links based on operation type
// const splitLink = split(
//   ({ query }) => {
//     const definition = getMainDefinition(query);
//     return (
//       definition.kind === "OperationDefinition" &&
//       definition.operation === "subscription"
//     );
//   },
//   wsLink, // Use WebSocket for subscriptions
//   httpLink // Use HTTP for queries and mutations
// );

// // Apollo Client instance
// export const client = new ApolloClient({
//   link: splitLink,
//   cache: new InMemoryCache(),
// });
