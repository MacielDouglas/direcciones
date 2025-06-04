// Configuração da store

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
// import storage from 'redux-persist/lib/storage'; // ou sessionStorage, se preferir
import authReducer from "./slices/authSlice";
import { authPersistConfig } from "./slices/persistConfig";
// import { authPersistConfig } from './persistConfig';

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
