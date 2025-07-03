import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../index";

export const selectUserState = (state: RootState) => state.user;

export const selectUserId = createSelector(
  selectUserState,
  (user) => user.userData?.id ?? ""
);

export const selectUserName = createSelector(
  selectUserState,
  (user) => user.userData?.name ?? ""
);

export const selectIsAdmin = createSelector(
  selectUserState,
  (user) => user.userData?.isAdmin ?? false
);

export const selectIsSS = createSelector(
  selectUserState,
  (user) => user.userData?.isSS ?? false
);

export const selectProfilePicture = createSelector(
  selectUserState,
  (user) => user.userData?.profilePicture ?? ""
);

export const selectGroup = createSelector(
  selectUserState,
  (user) => user.userData?.group ?? ""
);

export const selectCodUser = createSelector(
  selectUserState,
  (user) => user.userData?.codUser ?? 0
);

export const selectUserData = createSelector(
  selectUserState,
  (user) => user.userData
);

export const userIsAuthenticated = createSelector(
  selectUserState,
  (user) => user.isAuthenticated
);

export const userSessionExpiry = createSelector(
  selectUserState,
  (user) => user.sessionExpiry
);
