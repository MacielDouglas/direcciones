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
