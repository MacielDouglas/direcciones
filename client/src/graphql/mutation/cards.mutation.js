import { gql } from "@apollo/client";

export const NewCArd = gql`
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
        id
      }
    }
  }
`;
