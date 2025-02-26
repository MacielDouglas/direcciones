import { gql } from "@apollo/client";

export const LOGIN = gql`
  mutation LOGIN_USER($user: UserGoogleInput!) {
    loginWithGoogle(user: $user) {
      message
      success
      user {
        id
        name
        codUser
        group
        isAdmin
        isSS
        profilePicture
      }
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UPDATE_USER(
    $updateUserId: ID!
    $action: String!
    $updates: UpdateUserInput!
  ) {
    updateUser(id: $updateUserId, action: $action, updates: $updates) {
      message
      success
      user {
        id
        name
        codUser
        group
        isAdmin
        isSS
        profilePicture
      }
    }
  }
`;

export const DELETE_USER = gql`
  mutation DELETE_USER($deleteUserId: ID!) {
    deleteUser(id: $deleteUserId) {
      message
      success
    }
  }
`;
