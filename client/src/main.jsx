import { StrictMode } from "react";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

const client = new ApolloClient({
  uri: "/graphql",
  cache: new InMemoryCache(),
});

export default client;

createRoot(document.getElementById("root")).render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
