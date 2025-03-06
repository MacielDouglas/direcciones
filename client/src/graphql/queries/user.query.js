import { gql } from "@apollo/client";

export const LOGOUT = gql`
  query LOGOUT {
    logout {
      message
      success
    }
  }
`;

export const GET_USERS = gql`
  query GET_USERS {
    getUsers {
      id
      name
      profilePicture
      group
      codUser
    }
  }
`;
