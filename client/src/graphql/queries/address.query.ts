import { gql } from "@apollo/client";

export const ADDRESSES = gql`
  query ADDRESSES {
    addresses {
      message
      success
      addresses {
        id
        street
        number
        neighborhood
        city
        gps
        complement
        photo
        confirmed
        visited
        type
        active
        group
        createdAt
        customName
      }
    }
  }
`;
