import { gql } from "@apollo/client";

export const GET_ADDRESS = gql`
  query GET_ADDRESS($action: String!, $input: FilterAddressInput!) {
    address(action: $action, input: $input) {
      message
      success
      address {
        active
        street
        number
        complement
        neighborhood
        city
        gps
        id
        photo
        type
        userId
        visited
      }
    }
  }
`;
