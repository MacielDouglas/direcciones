import { gql } from "@apollo/client";

export const DELETE_USER = gql`
  mutation DeleteUser($action: String!, $userMutationId: ID!) {
    userMutation(action: $action, id: $userMutationId) {
      message
      success
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UPDATE_USER($action: String!, $updateUserInput: UpdateUserInput!) {
    userMutation(action: $action, updateUserInput: $updateUserInput) {
      message
      success
      user {
        id
        name
        codUser
        group
        isAdmin
        isSS
        myCards {
          date
          cardId
        }
        myTotalCards {
          cardId
          date
        }
      }
    }
  }
`;

export const LOGIN_GOOGLE = gql`
  mutation LOGIN_GOOGLE($user: UserGoogle!) {
    loginGoogle(user: $user) {
      message
      success
      user {
        name
        id
        isAdmin
        group
        isSS
        codUser
        profilePicture
        myCards {
          cardId
          date
        }
        myTotalCards {
          cardId
          date
        }
        comments {
          cardId
          text
        }
      }
    }
  }
`;
