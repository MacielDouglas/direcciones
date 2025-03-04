const cardTypeDef = `#graphql

type Card {
    id: ID!
    street: [String]!
    usersAssigned: [Assigned]!
    number: Int
    startDate: String
    endDate: String
    group: String! # O grupo está alinhado ao grupo do usuário
}

type Assigned {
    userId: String!
    date: String!
    id: ID!
}

type Query {
    card(action: String!, id: ID): CardResponse
}

type Mutation {
    cardMutation(
        action: String!,
        newCard: NewCardInput,
        id: ID,
        updateCardInput: UpdateCardInput
        designateCardInput: DesignateCardInput!
    ): CardMutationResponse
}

type CardResponse {
    card: [Card]
    success: Boolean
    message: String
}

input NewCardInput {
    street: [String]!
    userId: String
    number: Int
    startDate: String
    endDate: String
    # group: String! # O grupo deve ser obrigatório e associado a um grupo existente
}

input UpdateCardInput {
    street: [String]
    usersAssigned: [AssignedInput]
    number: Int
    startDate: String
    endDate: String
    group: String # O grupo pode ser atualizado
}

input AssignedInput {
    userId: String!
    date: String!
}

input DesignateCardInput {
    cardId: [ID]!
    userId: ID!
}

type CardMutationResponse {
    success: Boolean
    message: String
    card: Card
}
`;

export default cardTypeDef;
