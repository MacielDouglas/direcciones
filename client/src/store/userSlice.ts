import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

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

interface UserState {
  userData: User | null;
  isAuthenticated: boolean;
  sessionExpiry: number | null;
}

const initialState: UserState = {
  userData: null,
  isAuthenticated: false,
  sessionExpiry: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setMyUser: (state, action: PayloadAction<{ user: User }>) => {
      state.userData = action.payload.user;
      state.isAuthenticated = true;
      state.sessionExpiry = Date.now() + 60 * 60 * 1000;
    },
    clearMyUser: (state) => {
      state.userData = null;
      state.isAuthenticated = false;
      state.sessionExpiry = null;
    },
  },
});

export const { setMyUser, clearMyUser } = userSlice.actions;
export default userSlice.reducer;
