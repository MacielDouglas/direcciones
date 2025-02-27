import { gql } from "@apollo/client";

export const LOGOUT = gql`
  query LOGOUT {
    logoutUser {
      message
      success
    }
  }
`;

export const GET_USER = gql`
  query GET_USER($getUserId: ID!) {
    getUser(id: $getUserId) {
      message
      success
      user {
        id
        codUser
        name
        profilePicture
        isSS
        isAdmin
      }
    }
  }
`;

export const USERS = gql`
  query GET_USERS {
    getUsers {
      message
      success
      users {
        id
        name
        codUser
        group
        profilePicture
      }
    }
  }
`;

export const MY_CARDS_SUBSCRIPTION = gql`
  subscription MY_CARDS_SUBSCRIPTION {
    myCardsUpdated {
      success
      message
      card {
        id
        number
      }
      # cards {
      #   id
      #   number
      #   startDate
      #   street {
      #     id
      #     street
      #     number
      #     neighborhood
      #     city
      #     type
      #     gps
      #     group
      #     complement
      #     confirmed
      #     visited
      #     active
      #     photo
      #     userId
      #   }
      # }
    }
  }
`;
