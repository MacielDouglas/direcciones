import { gql } from "@apollo/client";

export const NEW_CARD = gql`
  mutation CREATE_CARD($newCard: NewCardInput!) {
    createCard(newCard: $newCard) {
      message
      success
      card {
        id
        number
        startDate
        endDate
        group
        street
        usersAssigned {
          date
          userId
        }
      }
    }
  }
`;

export const UPDATE_CARD = gql`
  mutation UPDATE_CARD($updateCardInput: UpdateCardInput!) {
    updateCard(updateCardInput: $updateCardInput) {
      success
      message
      card {
        id
        number
        startDate
        endDate
        group
        street
        usersAssigned {
          date
          userId
        }
      }
    }
  }
`;

export const DELETE_CARD = gql`
  mutation DELETE_CARD($deleteCardId: ID!) {
    deleteCard(id: $deleteCardId) {
      message
      success
    }
  }
`;

export const SENDING_CARD = gql`
  mutation SENDING_CARD($assignCardInput: AssignCardInput!) {
    assignCard(assignCardInput: $assignCardInput) {
      message
      success
      card {
        id
        number
        startDate
        endDate
        group
        street
        usersAssigned {
          date
          userId
        }
      }
    }
  }
`;

export const RETURN_CARD = gql`
  mutation RETURN_CARD($returnCardInput: ReturnCardInput!) {
    returnCard(returnCardInput: $returnCardInput) {
      message
      success
      card {
        id
        number
        startDate
        endDate
        group
        street
        usersAssigned {
          date
          userId
        }
      }
    }
  }
`;
