import { gql } from "@apollo/client";

export const GET_ADDRESS = gql`
  query GetAddress(
    $action: String!
    $addressId: ID!
    $input: FilterAddressInput!
  ) {
    address(action: $action, id: $addressId, input: $input) {
      message
      success
      address {
        id
        street
        city
        complement
        gps
        neighborhood
        confirmed
        userId
        visited
        number
        active
        type
        photo
      }
    }
  }
`;
