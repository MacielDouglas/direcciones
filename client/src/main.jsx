import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import App from "./App.jsx";
import { ApolloProvider } from "@apollo/client";
import "./index.css";
import { persistor, store } from "./store/index.js";
import "react-toastify/dist/ReactToastify.css";
import { client } from "./apollo/client.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ApolloProvider client={client}>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </ApolloProvider>
);
