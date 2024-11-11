import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  query Login($action: String!, $email: String!, $password: String!) {
    user(action: $action, email: $email, password: $password) {
      message
      success
      user {
        name
        id
        group
        isAdmin
        isSS
        profilePicture
        comments {
          cardId
          text
        }
      }
    }
  }
`;

export const LOGOUT = gql`
  query Logout($action: String!) {
    user(action: $action) {
      message
      success
    }
  }
`;
