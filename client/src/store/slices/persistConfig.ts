// Configuração do redux-persist

import storage from "redux-persist/lib/storage"; // mantém síncrono
import expireReducer from "redux-persist-expire";

export const authPersistConfig = {
  key: "auth",
  storage,
  transforms: [
    expireReducer("auth", {
      expireSeconds: 3600,
      expiredState: {
        user: null,
        isAuthenticated: false,
      },
      autoExpire: true,
      // 👇 ADICIONE ISSO PARA FUNCIONAR COM localStorage
    }),
  ],
};
