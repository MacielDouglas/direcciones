import { gql } from "@apollo/client";

export const GET_CARDS = gql`
  query GET_CARDS {
    card {
      id
      number
      startDate
      endDate
      group
      street {
        id
        street
        number
        neighborhood
        city
        complement
        gps
        group
        type
        confirmed
        visited
        active
        photo
      }
      usersAssigned {
        date
        userId
      }
    }
  }
`;

export const MY_CARDS = gql`
  query MY_CARDS($myCardsId: ID!) {
    myCards(id: $myCardsId) {
      id
      startDate
      endDate
      number
      street {
        id
        active
        city
        complement
        confirmed
        customName
        gps
        group
        neighborhood
        number
        photo
        street
        type
        visited
      }
    }
  }
`;
