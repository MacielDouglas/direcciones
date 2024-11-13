// import "symbol-observable";
import ReactDOM from "react-dom/client";
// import { Provider } from "react-redux";
// import { PersistGate } from "redux-persist/integration/react";
import App from "./App.jsx";
import { ApolloProvider } from "@apollo/client";
import "./index.css";
// import store, { persistor } from "./app/store.js";
import "react-toastify/dist/ReactToastify.css";
import { client } from "../apollo/client.js";
// import { client } from "./apollo/client.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <Provider store={store}>
  // <PersistGate loading={null} persistor={persistor}>
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
  // </PersistGate>
  // </Provider>
);

export { client };

// import {
//   ApolloClient,
//   ApolloProvider,
//   HttpLink,
//   InMemoryCache,
// } from "@apollo/client";
// import { createRoot } from "react-dom/client";
// import "./index.css";
// import App from "./App.jsx";
// import { ToastContainer } from "react-toastify";

// // uri: "https://minha-api-nine.vercel.app/graphql",
// const httpLink = new HttpLink({
//   uri: "http://localhost:8000/graphql",
//   credentials: "include", // Ensures cookies are sent with cross-origin requests
// });

// const client = new ApolloClient({
//   link: httpLink,
//   cache: new InMemoryCache(),
// });

// export default client;

// createRoot(document.getElementById("root")).render(
//   <ApolloProvider client={client}>
//     <ToastContainer />
//     {/* <Provider store={store}> */}
//     {/* <PersistGate loading={null} persistor={persistor}> */}
//     <App />
//     {/* </PersistGate> */}
//     {/* </Provider> */}
//   </ApolloProvider>
// );
