import { gql } from "@apollo/client";

export const GET_CARDS = gql`
  query Card($action: String!, $cardId: ID) {
    card(action: $action, id: $cardId) {
      message
      success
      card {
        id
        street
        number
        startDate
        endDate
        userId
      }
    }
  }
`;
