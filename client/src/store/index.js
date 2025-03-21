import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import expireReducer from "redux-persist-expire";
import userReducer from "./userSlice.js";
import addressesReducer from "./addressesSlice.js";
import cardsReducer from "./cardsSlice.js";

// Configuração de expiração para cada reducer
const expireUser = expireReducer("user", {
  expireSeconds: 3600, // 1 hora
  expiredState: { user: null }, // Estado após expiração
  autoExpire: true, // Limpa automaticamente após expiração
});

const expireAddresses = expireReducer("addresses", {
  expireSeconds: 3600, // 1 hora
  expiredState: { addresses: [] }, // Estado após expiração
  autoExpire: true,
});

const expireCards = expireReducer("cards", {
  expireSeconds: 3600, // 1 hora
  expiredState: { cards: [] }, // Estado após expiração
  autoExpire: true,
});

// Configuração de persistência para cada reducer
const userPersistConfig = {
  key: "user",
  storage,
  transforms: [expireUser],
};

const addressesPersistConfig = {
  key: "addresses",
  storage,
  transforms: [expireAddresses],
};

const cardsPersistConfig = {
  key: "cards",
  storage,
  transforms: [expireCards],
};

// Combine os reducers com persistência
const rootReducer = combineReducers({
  user: persistReducer(userPersistConfig, userReducer),
  addresses: persistReducer(addressesPersistConfig, addressesReducer),
  cards: persistReducer(cardsPersistConfig, cardsReducer),
});

// Configuração do store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
  devTools: process.env.NODE_ENV !== "production", // Ativa o Redux DevTools apenas em desenvolvimento
});

// Persistor para o redux-persist
export const persistor = persistStore(store);
