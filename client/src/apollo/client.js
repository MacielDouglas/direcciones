import { ApolloClient, InMemoryCache, HttpLink, split } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";

// Configuração do link HTTP para Queries e Mutations
const httpLink = new HttpLink({
  uri: "/graphql",
  credentials: "include",
});

// Configuração do link WebSocket para Subscriptions
const wsLink = new GraphQLWsLink(
  createClient({
    // url: `ws://${window.location.host}/graphql`, // Para ambiente local
    url: `ws://localhost:8000/graphql`, // Para ambiente local
    connectionParams: {
      credentials: "include",
    },
  })
);

// Função para escolher entre HTTP e WebSocket automaticamente
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink, // Usa WebSocket para Subscriptions
  httpLink // Usa HTTP para Queries e Mutations
);

export const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

// import { ApolloClient, InMemoryCache, HttpLink, split } from "@apollo/client";
// import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
// import { createClient } from "graphql-ws";
// import { getMainDefinition } from "@apollo/client/utilities";

// const isLocal = import.meta.env.MODE === "development";

// const httpLink = new HttpLink({
//   uri: isLocal
//     ? "http://localhost:8000/graphql"
//     : "https://direcciones.vercel.app/graphql",
//   credentials: "include",
// });

// // Configuração do WebSocket apenas para ambiente local ou outro servidor externo
// const wsLink = isLocal
//   ? new GraphQLWsLink(
//       createClient({
//         url: "ws://localhost:8000/graphql",
//         connectionParams: {
//           credentials: "include",
//         },
//       })
//     )
//   : null;

// // Escolher entre HTTP e WebSocket automaticamente
// const splitLink = wsLink
//   ? split(
//       ({ query }) => {
//         const definition = getMainDefinition(query);
//         return (
//           definition.kind === "OperationDefinition" &&
//           definition.operation === "subscription"
//         );
//       },
//       wsLink,
//       httpLink
//     )
//   : httpLink;

// export const client = new ApolloClient({
//   link: splitLink,
//   cache: new InMemoryCache(),
// });

// import { ApolloClient, InMemoryCache, HttpLink, split } from "@apollo/client";
// import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
// import { createClient } from "graphql-ws";
// import { getMainDefinition } from "@apollo/client/utilities";

// // Configuração do link HTTP para Queries e Mutations
// const httpLink = new HttpLink({
//   uri: "/graphql",
//   credentials: "include",
// });

// // Configuração do link WebSocket para Subscriptions
// const wsLink = new GraphQLWsLink(
//   createClient({
//     url: `ws://localhost:8000/graphql`, // Para ambiente local
//     connectionParams: {
//       credentials: "include",
//     },
//   })
// );

// // Função para escolher entre HTTP e WebSocket automaticamente
// const splitLink = split(
//   ({ query }) => {
//     const definition = getMainDefinition(query);
//     return (
//       definition.kind === "OperationDefinition" &&
//       definition.operation === "subscription"
//     );
//   },
//   wsLink, // Usa WebSocket para Subscriptions
//   httpLink // Usa HTTP para Queries e Mutations
// );

// export const client = new ApolloClient({
//   link: splitLink,
//   cache: new InMemoryCache(),
// });

// import { ApolloClient, InMemoryCache } from "@apollo/client";

// export const client = new ApolloClient({
//   uri: "/graphql",
//   cache: new InMemoryCache(),
//   credentials: "include",
// });
