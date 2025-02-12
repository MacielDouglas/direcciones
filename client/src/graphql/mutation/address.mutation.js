import { gql } from "@apollo/client";

export const NEW_ADDRESS = gql`
  mutation NEW_ADDRESS($action: String!, $newAddress: NewAddressInput!) {
    addressMutation(action: $action, newAddress: $newAddress) {
      success
      message
      address {
        id
        street
        number
        neighborhood
        city
        gps
        type
        group
        confirmed
        active
        complement
        visited
        photo
        userId
      }
    }
  }
`;

export const UPDATE_ADDRESS = gql`
  mutation UPDATE_ADDRESS(
    $action: String!
    $updateAddressInput: UpdateAddressInput!
    $id: ID!
  ) {
    addressMutation(
      action: $action
      updateAddressInput: $updateAddressInput
      id: $id
    ) {
      success
      message
      address {
        id
        street
        number
        neighborhood
        city
        gps
        type
        group
        confirmed
        active
        complement
        visited
        photo
        userId
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
