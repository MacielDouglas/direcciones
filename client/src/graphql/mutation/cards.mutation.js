import { gql } from "@apollo/client";

export const NEW_CARD = gql`
  mutation NewCard($action: String!, $newCard: NewCardInput!) {
    cardMutation(action: $action, newCard: $newCard) {
      message
      success
      card {
        id
        street
        userId
        startDate
        endDate
        number
        group
      }
    }
  }
`;

export const UPDATE_CARD = gql`
  mutation UpdateCard(
    $action: String!
    $cardMutationId: ID!
    $updateCardInput: UpdateCardInput!
  ) {
    cardMutation(
      action: $action
      id: $cardMutationId
      updateCardInput: $updateCardInput
    ) {
      message
      success
      card {
        number
        street
        userId
        startDate
        endDate
      }
    }
  }
`;

export const DELETE_CARD = gql`
  mutation DeleteCard($action: String!, $cardMutationId: ID!) {
    cardMutation(action: $action, id: $cardMutationId) {
      message
      success
    }
  }
`;

export const DESIGNATED_CARD = gql`
  mutation DESIGNATED_CARD(
    $action: String!
    $designateCardInput: DesignateCardInput!
  ) {
    cardMutation(action: $action, designateCardInput: $designateCardInput) {
      message
      success
      # card {
      #   id
      #   number
      #   startDate
      # }
    }
  }
`;

export const RETURN_CARD = gql`
  mutation RETURN_CARD(
    $action: String!
    $designateCardInput: DesignateCardInput!
  ) {
    cardMutation(action: $action, designateCardInput: $designateCardInput) {
      message
      success
      card {
        id
        number
        userId
        startDate
        endDate
      }
    }
  }
`;
