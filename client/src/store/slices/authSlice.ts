// Slice de autenticação
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../index";

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

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
export const selectAuthUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
