import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import userReducer from "./userSlice.js";
import addressesReducer from "./addressesSlice.js";
import expireReducer from "redux-persist-expire";

// Configuração de persistência
const persistConfig = {
  key: "root",
  storage,
  transforms: [
    expireReducer(
      "user",
      {
        expireSeconds: 3600, // 15 minutos
        autoExpire: true, // Limpa automaticamente após expiração
      },
      "addresses",
      {
        expireSeconds: 3600,
        autoExpire: true,
      }
    ),
  ],
};

const rootReducer = combineReducers({
  user: userReducer,
  addresses: addressesReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore as ações específicas do redux-persist
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);
