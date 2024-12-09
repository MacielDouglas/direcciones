import { gql } from "@apollo/client";

export const NEW_ADDRESS = gql`
  mutation NEW_ADDRESS($action: String!, $newAddress: NewAddressInput!) {
    addressMutation(action: $action, newAddress: $newAddress) {
      message
      success
      address {
        street
        number
        neighborhood
        complement
        confirmed
        gps
        group
        visited
        id
        type
        userId
      }
    }
  }
`;

export const UPDATE_ADDRESS = gql`
  mutation UpdateAddress(
    $action: String!
    $updateAddressInput: UpdateAddressInput!
    $addressMutationId: ID!
  ) {
    addressMutation(
      action: $action
      id: $addressMutationId
      updateAddressInput: $updateAddressInput
    ) {
      message
      success
      address {
        id
        street
        number
        neighborhood
        city
        gps
        userId
        complement
        confirmed
        active
        visited
        type
      }
    }
  }
`;

// export const UPDATE_ADDRESS = gql`
//   mutation DeleteAddress($action: String!, $addressMutationId: ID!) {
//     addressMutation(action: $action, id: $addressMutationId) {
//       message
//       success
//     }
//   }
// `;
