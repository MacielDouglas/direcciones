import { gql } from "@apollo/client";

export const CREATE_CARD = gql`
  mutation CREATE_CARD($input: NewCardInput!) {
    createCard(input: $input) {
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
          userId
          date
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
  mutation ASIGNATED_CARD($input: DesignateCardInput!) {
    assignCard(input: $input) {
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
        assignedHistory {
          date
          userId
        }
      }
      # card {
      #   # id
      #   number
      #   startDate
      #   # group
      #   # street
      #   usersAssigned {
      #     userId
      #     date
      #   }
    }
  }
`;

export const RETURN_CARD = gql`
  mutation RETURN_CARD($input: ReturnCardInput!) {
    returnCard(input: $input) {
      message
      success
      card {
        id
        number
        street
        startDate
        endDate
        group
        usersAssigned {
          date
          userId
        }
        assignedHistory {
          date
          userId
        }
      }
    }
  }
`;

export const UPDATE_CARD = gql`
  mutation UPDATE_CARD($updateCardId: ID!, $input: UpdateCardInput!) {
    updateCard(id: $updateCardId, input: $input) {
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
        assignedHistory {
          date
          userId
        }
      }
    }
  }
`;
