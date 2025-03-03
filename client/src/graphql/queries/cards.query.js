import { gql } from "@apollo/client";

export const LIST_CARDS = gql`
  query LIST_CARDS {
    getCard {
      message
      success
      cards {
        id
        number
        group
        startDate
        endDate
        street {
          id
          street
          number
          neighborhood
          city
          complement
          gps
          type
          group
          active
          confirmed
          visited
          photo
        }
        usersAssigned {
          userId
          date
        }
        assignedHistory {
          date
          userId
        }
      }
    }
  }
`;

export const CARD_SUBSCRIPTION = gql`
  subscription CARD_SUBSCRIPTION {
    fullCard {
      message
      success
      cards {
        id
        street {
          id
          street
          number
          neighborhood
          city
          complement
          gps
          type
          group
          active
          confirmed
          visited
          photo
        }
        number
        group
        startDate
        endDate
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
