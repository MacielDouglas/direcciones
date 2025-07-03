import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../types/user.types";

interface OtherUsersState {
  usersData: User[];
  sessionExpiry: number | null;
}

const initialState: OtherUsersState = {
  usersData: [],
  sessionExpiry: null,
};

const otherUsersSlice = createSlice({
  name: "otherUsers",
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<{ users: User[] }>) => {
      state.usersData = action.payload.users;
      state.sessionExpiry = Date.now() + 60 * 60 * 1000;
    },
    clearUsers: (state) => {
      state.usersData = [];
      state.sessionExpiry = null;
    },
    addUser: (state, action: PayloadAction<User>) => {
      state.usersData.push(action.payload);
    },
    updateUser: (state, action: PayloadAction<User>) => {
      const index = state.usersData.findIndex(
        (user) => user.id === action.payload.id
      );
      if (index !== -1) {
        state.usersData[index] = action.payload;
      }
    },
    removeUser: (state, action: PayloadAction<string>) => {
      state.usersData = state.usersData.filter(
        (user) => user.id !== action.payload
      );
    },
  },
});

export const { setUsers, clearUsers, addUser, updateUser, removeUser } =
  otherUsersSlice.actions;
export default otherUsersSlice.reducer;
