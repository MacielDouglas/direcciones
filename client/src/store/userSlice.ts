import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// Definição da interface do usuário
export interface User {
  id: string;
  isAdmin: boolean;
  name: string;
  profilePicture: string;
  group: string;
  isSS: boolean;
  myCards: object;
  myTotalCards: object;
  comments: object;
  codUser: string;
  isSCards: boolean;
}

// Interface do estado do slice
interface UserState {
  userData: User | null;
  isAuthenticated: boolean;
  sessionExpiry: number | null; // timestamp em milissegundos
}

// Estado inicial
const initialState: UserState = {
  userData: null,
  isAuthenticated: false,
  sessionExpiry: null,
};

// Criação do slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ user: User }>) => {
      state.userData = action.payload.user;
      state.isAuthenticated = true;
      state.sessionExpiry = Date.now() + 60 * 60 * 1000; // 1 hora
    },
    clearUser: (state) => {
      state.userData = null;
      state.isAuthenticated = false;
      state.sessionExpiry = null;
    },
  },
});

// Exportações
export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;

// import { createSlice } from "@reduxjs/toolkit";

// export interface User {
//   id: string;
//   isAdmin: boolean;
//   name: string;
//   profilePicture: string;
//   group: string;
//   isSS: boolean;
//   myCards: object;
//   myTotalCards: object;
//   comments: object;
//   codUser: string;
//   isSCards: boolean;
// }

// const userSlice = createSlice({
//   name: "user",
//   initialState: {
//     userData: User | null,
//     isAuthenticated: false,
//     sessionExpiry: null, // Adicione a expiração da sessão
//   },
//   reducers: {
//     setUser: (state, action) => {
//       state.userData = action.payload.user;
//       state.isAuthenticated = true;
//       // Defina a expiração para 10 minutos a partir do login
//       state.sessionExpiry = Date.now() + 60 * 60 * 1000;
//     },
//     clearUser: (state) => {
//       state.userData = null;
//       state.isAuthenticated = false;
//       state.sessionExpiry = null;
//     },
//   },
// });

// export const { setUser, clearUser } = userSlice.actions;
// export default userSlice.reducer;

// interface AuthState {
//   user: User | null;
//   isAuthenticated: boolean;
// }
