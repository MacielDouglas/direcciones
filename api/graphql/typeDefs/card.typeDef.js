const cardTypeDef = `#graphql

type Card {
    id: ID!
    street: [String!]!
    usersAssigned: [Assigned!]!
    number: Int
    startDate: String
    endDate: String
    group: String!
    assignedHistory: [Assigned!]!
}

type Address {
    id: ID!
    street: String!
    number: String!
    neighborhood: String
    city: String!
    gps: String
    complement: String
    userId: String!
    type: String!
    photo: String
    confirmed: Boolean!
    active: Boolean!
    visited: Boolean!
    group: String! # Campo obrigatório para alinhar com User e Card
}

type Assigned {
    id: ID!
    userId: ID!
    date: String!
}

type Query {
    getCard: CardListResponse!
}

type Mutation {
    createCard(input: NewCardInput!): CardMutationResponse!
    updateCard(id: ID!, input: UpdateCardInput!): CardMutationResponse!
    assignCard(input: DesignateCardInput!): AssignedCardResponse!
    returnCard(input: ReturnCardInput!): CardMutationResponse!
    deleteCard(id: ID!): CardMutationResponse!
}

type Subscription {
    fullCard: CardListResponse!
}

type CardListResponse {
    cards: [Cards]
    success: Boolean!
    message: String
}

type Cards {
    id: ID!
    street: [Address!]!
    usersAssigned: [Assigned!]!
    number: Int
    startDate: String
    endDate: String
    group: String!
    assignedHistory: [Assigned!]!
}

type CardMutationResponse {
    success: Boolean!
    message: String
    card: Card
}

type AssignedCardResponse {
    success: Boolean!
    message: String
    card: [Card]
}

input NewCardInput {
    street: [String!]!
    number: Int
    startDate: String
    endDate: String
    group: String!
}

input UpdateCardInput {
    street: [String!]!
}

input DesignateCardInput {
    cardIds: [ID!]!
    userId: ID!
}

input ReturnCardInput {
    cardId: ID!
    userId: ID!
}

`;

export default cardTypeDef;

// const cardTypeDef = `#graphql

// type Card {
//     id: ID!
//     street: [String!]!
//     usersAssigned: [Assigned!]!
//     number: Int
//     startDate: String
//     endDate: String
//     group: String!
//     assignedHistory: [Assigned!]!
// }

// type Address {
//     id: ID!
//     street: String!
//     number: String!
//     city: String!
//     neighborhood: String!
//     gps: String
//     complement: String
//     type: String!
//     photo: String
//     userId: String!
//     active: Boolean!
//     confirmed: Boolean!
//     group: String!
//     visited: Boolean!
// }

// type Assigned {
//     id: ID!
//     userId: ID!
//     date: String!
// }

// type Query {
//     getCard(id: ID!): CardResponse!
//     listCards: CardListResponse!
//     # myCards: CardListResponse!
// }

// type Mutation {
//     createCard(input: NewCardInput!): CardMutationResponse!
//     updateCard(id: ID!, input: UpdateCardInput!): CardMutationResponse!
//     assignCard(input: DesignateCardInput!): AssignedCardResponse!
//     returnCard(input: ReturnCardInput!): CardMutationResponse!
//     deleteCard(id: ID!): CardMutationResponse
// }

// type CardResponse {
//     card: Card
//     success: Boolean!
//     message: String
// }

// type CardListResponse {
//     cards: [Card]
//     success: Boolean!
//     message: String
// }

// input NewCardInput {
//     street: [String!]!
//     number: Int
//     startDate: String
//     endDate: String
//     group: String
// }

// input UpdateCardInput {
//     street: [String!]!
//     # usersAssigned: [AssignedInput]
//     # number: Int
//     # startDate: String
//     # endDate: String
//     # group: String
// }

// input AssignedInput {
//     userId: ID!
//     date: String!
// }

// input DesignateCardInput {
//     cardIds: [ID!]!
//     userId: ID!
// }

// input ReturnCardInput {
//     cardId: ID!
//     userId: ID!
// }

// type CardMutationResponse {
//     success: Boolean!
//     message: String
//     card: Card
// }
// type AssignedCardResponse {
//     success: Boolean!
//     message: String
//     card: [Card]
// }

// type MyCard {
//     id: ID!
//     street: [Address!]! # Agora retorna os endereços completos
//     usersAssigned: [Assigned!]!
//     number: Int
//     startDate: String
//     endDate: String
//     group: String!
//     assignedHistory: [Assigned!]!
// }

// type MyCardListResponse {
//     cards: [MyCard]
//     success: Boolean!
//     message: String
// }

// extend type Query {
//     myCards: MyCardListResponse!
// }

// type Subscription {
//     myCardsUpdated: CardListResponse!
// }

// `;

// export default cardTypeDef;
