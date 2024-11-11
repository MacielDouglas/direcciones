import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ToastContainer } from "react-toastify";

// uri: "https://minha-api-nine.vercel.app/graphql",
const httpLink = new HttpLink({
  uri: "http://localhost:8000/graphql",
  credentials: "include", // Ensures cookies are sent with cross-origin requests
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default client;

createRoot(document.getElementById("root")).render(
  <ApolloProvider client={client}>
    <ToastContainer />
    {/* <Provider store={store}> */}
    {/* <PersistGate loading={null} persistor={persistor}> */}
    <App />
    {/* </PersistGate> */}
    {/* </Provider> */}
  </ApolloProvider>
);
