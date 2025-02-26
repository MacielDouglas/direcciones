import { gql } from "@apollo/client";

export const ONE_CARD = gql`
  query GET_CARD($getCardId: ID!) {
    getCard(id: $getCardId) {
      message
      success
      card {
        id
        number
        startDate
        endDate
        street
        usersAssigned {
          date
          userId
        }
      }
    }
  }
`;

export const LIST_CARDS = gql`
  query LIST_CARDS {
    listCards {
      message
      success
      cards {
        id
        number
        startDate
        endDate
        usersAssigned {
          userId
          date
        }
        assignedHistory {
          date
          userId
        }
        street
      }
    }
  }
`;

export const MY_CARDS = gql`
  query MY_CARDS {
    myCards {
      success
      message
      cards {
        id
        number
        startDate
        street {
          id
          street
          number
          neighborhood
          city
          type
          gps
          group
          complement
          confirmed
          visited
          active
          photo
          userId
        }
      }
    }
  }
`;
