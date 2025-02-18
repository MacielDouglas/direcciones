import { gql } from "@apollo/client";

export const NEW_CARD = gql`
  mutation NewCard($action: String!, $newCard: NewCardInput!) {
    cardMutation(action: $action, newCard: $newCard) {
      message
      success
      card {
        id
        street
        number
        startDate
        endDate
        group
        usersAssigned {
          id
          userId
          date
        }
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
  mutation RETURNED_CARD(
    $action: String!
    $designateCardInput: DesignateCardInput!
  ) {
    cardMutation(action: $action, designateCardInput: $designateCardInput) {
      message
      success
      card {
        id
        endDate
        startDate
        group
        usersAssigned {
          id
          userId
          date
        }
      }
    }
  }
`;
