import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../index";

export const selectOthersUserState = (state: RootState) => state.otherUsers;

export const selectAllUsersOthers = createSelector(
  selectOthersUserState,
  (users) => users.usersData
);
