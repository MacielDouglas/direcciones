import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../index";

export const selectUserState = (state: RootState) => state.user;

export const selectUserId = createSelector(
  selectUserState,
  (user) => user.userData?.id ?? null
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
  (user) => user.userData?.codUser ?? ""
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

// import { createSelector } from "@reduxjs/toolkit";

// export const selectUserId = createSelector(
//   (state) => state.user,
//   (user) => user?.userData.id
// );
// export const selectUserName = createSelector(
//   (state) => state.user,
//   (user) => user?.userData.name
// );
// export const selectIsAdmin = createSelector(
//   (state) => state.user,
//   (user) => user?.userData.isAdmin
// );
// export const selectIsSS = createSelector(
//   (state) => state.user,
//   (user) => user?.userData.isSS
// );
// export const selectProfilePicture = createSelector(
//   (state) => state.user,
//   (user) => user?.userData.profilePicture
// );
// export const selectGroup = createSelector(
//   (state) => state.user,
//   (user) => user?.userData.group
// );
// export const selectCodUser = createSelector(
//   (state) => state.user,
//   (user) => user?.userData.codUser
// );

// export const selectUserData = createSelector(
//   (state) => state.user,
//   (user) => user?.userData
// );
// // isAuthenticated
// export const userIsAuthenticated = createSelector(
//   (state) => state.user,
//   (user) => user?.isAuthenticated
// );

// export const userSessionExpiry = createSelector(
//   (state) => state.user,
//   (user) => user?.sessionExpiry
// );
