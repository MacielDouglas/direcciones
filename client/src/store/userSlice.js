import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    isAuthenticated: false,
    sessionExpiry: null, // Adicione a expiração da sessão
  },
  reducers: {
    setUser: (state, action) => {
      state.userData = action.payload.user;
      state.isAuthenticated = true;
      // Defina a expiração para 10 minutos a partir do login
      state.sessionExpiry = Date.now() + 60 * 60 * 1000;
    },
    clearUser: (state) => {
      state.userData = null;
      state.isAuthenticated = false;
      state.sessionExpiry = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
