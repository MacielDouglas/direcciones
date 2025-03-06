import { gql } from "@apollo/client";

export const LOGIN_GOOGLE = gql`
  mutation LOGIN_USER($user: UserGoogle!) {
    loginWithGoogle(user: $user) {
      message
      success
      user {
        id
        name
        codUser
        group
        profilePicture
        isAdmin
        isSS
      }
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UPDATE_USER($updateUserId: ID!, $user: UpdateUserInput!) {
    updateUser(id: $updateUserId, user: $user) {
      success
      message
      user {
        id
        codUser
        group
        name
        profilePicture
        isSS
        isAdmin
      }
    }
  }
`;
