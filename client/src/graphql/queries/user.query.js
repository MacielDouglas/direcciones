import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  query Login($action: String!, $email: String!, $password: String!) {
    user(action: $action, email: $email, password: $password) {
      message
      success
      user {
        name
        id
        isAdmin
        group
        isSS
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

export const LOGOUT = gql`
  query Logout($action: String!) {
    user(action: $action) {
      message
      success
    }
  }
`;

export const GET_USERS = gql`
  query GET_USERS {
    getUsers {
      message
      success
      users {
        id
        name
        group
      }
    }
  }
`;
