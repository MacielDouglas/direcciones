import { gql } from "@apollo/client";

export const GET_CARDS = gql`
  query GET_CARDS($action: String!) {
    card(action: $action) {
      message
      success
      card {
        id
        number
        group
        endDate
        startDate
        street
        usersAssigned {
          userId
          date
        }
      }
    }
  }
`;
