import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import expireReducer from "redux-persist-expire";
import userReducer from "./userSlice";

// Expiração automática do estado do usuário após 1h
const expireUser = expireReducer("user", {
  expireSeconds: 3600, // 1 hora
  expiredState: {
    userData: null,
    isAuthenticated: false,
    sessionExpiry: null,
  },
  autoExpire: true,
});

// Configuração de persistência para o user reducer
const userPersistConfig = {
  key: "user",
  storage,
  transforms: [expireUser],
};

const rootReducer = combineReducers({
  user: persistReducer(userPersistConfig, userReducer),
  // Outros reducers podem ser adicionados aqui
});

// Criação do store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});

// Persistor do redux-persist
export const persistor = persistStore(store);

// ✅ Tipos para uso em toda a aplicação
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
