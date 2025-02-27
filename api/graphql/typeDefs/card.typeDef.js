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
    city: String!
    neighborhood: String!
    gps: String
    complement: String
    type: String!
    photo: String
    userId: String!
    active: Boolean!
    confirmed: Boolean!
    group: String!
    visited: Boolean!
}

type Assigned {
    id: ID!
    userId: ID!
    date: String!
}

type Query {
    getCard(id: ID!): CardResponse!
    listCards: CardListResponse!
    # myCards: CardListResponse!
}

type Mutation {
    createCard(input: NewCardInput!): CardMutationResponse!
    updateCard(id: ID!, input: UpdateCardInput!): CardMutationResponse!
    assignCard(input: DesignateCardInput!): AssignedCardResponse!
    returnCard(input: ReturnCardInput!): CardMutationResponse!
    deleteCard(id: ID!): CardMutationResponse
}

type CardResponse {
    card: Card
    success: Boolean!
    message: String
}

type CardListResponse {
    cards: [Card]
    success: Boolean!
    message: String
}

input NewCardInput {
    street: [String!]!
    number: Int
    startDate: String
    endDate: String
    group: String
}

input UpdateCardInput {
    street: [String!]!
    # usersAssigned: [AssignedInput]
    # number: Int
    # startDate: String
    # endDate: String
    # group: String
}

input AssignedInput {
    userId: ID!
    date: String!
}

input DesignateCardInput {
    cardIds: [ID!]!
    userId: ID!
}

input ReturnCardInput {
    cardId: ID!
    userId: ID!
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

type MyCard {
    id: ID!
    street: [Address!]! # Agora retorna os endereços completos
    usersAssigned: [Assigned!]!
    number: Int
    startDate: String
    endDate: String
    group: String!
    assignedHistory: [Assigned!]!
}

type MyCardListResponse {
    cards: [MyCard]
    success: Boolean!
    message: String
}

extend type Query {
    myCards: MyCardListResponse!
}

type Subscription {
    myCardsUpdated: AssignedCardResponse
}

`;

export default cardTypeDef;
