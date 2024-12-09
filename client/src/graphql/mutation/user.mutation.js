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
  mutation UPDATE_USER($action: String!, $userMutationId: ID!) {
    userMutation(action: $action, id: $userMutationId) {
      message
      success
      user {
        name
        group
        myCards {
          id
          number
          streets {
            number
            active
          }
        }
      }
    }
  }
`;
