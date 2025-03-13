import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

// HTTP link for queries and mutations
const httpLink = new HttpLink({
  uri: "/graphql", // Proxy to the backend
  credentials: "include", // Include cookies for authentication
});

// Apollo Client instance
export const client = new ApolloClient({
  link: httpLink, // Use HTTP for queries and mutations
  cache: new InMemoryCache(),
});
