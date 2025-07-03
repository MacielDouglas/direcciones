import { gql } from "@apollo/client";

export const NEW_ADDRESS = gql`
  mutation CREATE_ADDRESS($newAddressInput: AddressInput!) {
    createAddress(newAddressInput: $newAddressInput) {
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
        confirmed
        visited
        photo
        active
        customName
      }
    }
  }
`;

export const UPDATE_ADDRESS = gql`
  mutation UPDATE_ADDRESS($input: UpdateAddressInput!) {
    updateAddress(input: $input) {
      success
      message
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
        confirmed
        visited
        photo
        active
        customName
      }
    }
  }
`;

export const DELETE_ADDRESS = gql`
  mutation DELETE_ADDRESS($deleteAddressId: ID!) {
    deleteAddress(id: $deleteAddressId) {
      message
      success
      address {
        id
      }
    }
  }
`;
