import { gql } from "@apollo/client";

export const GET_ADDRESS = gql`
  query ADDRESS {
    address {
      message
      success
      address {
        id
        street
        number
        neighborhood
        city
        complement
        gps
        type
        group
        active
        confirmed
        visited
        photo
      }
    }
  }
`;
