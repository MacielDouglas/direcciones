import { gql } from "@apollo/client";

export const NEW_ADDRESS = gql`
  mutation NewAddress($action: String!, $newAddress: NewAddressInput!) {
    addressMutation(action: $action, newAddress: $newAddress) {
      message
      success
      address {
        # id
        street
        number
        neighborhood
        city
        complement
        gps
        confirmed
        userId
        visited
        type
        photo
      }
    }
  }
`;
