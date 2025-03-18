import { ApolloClient, InMemoryCache, HttpLink, split } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";

// https://apidirecciones-production.up.railway.app/
// HTTP link for queries and mutations
const httpLink = new HttpLink({
  uri: "/graphql", // Proxy to the backend
  credentials: "include", // Include cookies for authentication
});

// WebSocket link for subscriptions
const wsLink = new GraphQLWsLink(
  createClient({
    // url: "ws://localhost:4000/graphql", // WebSocket endpoint
    url: "wss://api-direcciones.onrender.com/graphql", // WebSocket endpoint
    // url: "wss://apidirecciones-production.up.railway.app/graphql",
    connectionParams: {
      credentials: "include",
    },
    on: {
      connected: () => console.log("✅ WebSocket connected"),
      error: (err) => console.error("❌ WebSocket error:", err),
      closed: () => console.log("🔴 WebSocket closed"),
    },
  })
);

// Split links based on operation type
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink, // Use WebSocket for subscriptions
  httpLink // Use HTTP for queries and mutations
);

// Apollo Client instance
export const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});
