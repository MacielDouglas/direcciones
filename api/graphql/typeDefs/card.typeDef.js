const cardTypeDef = `#graphql

type Card {
    id: ID!
    street: [String]!
    userId: String
    number: Int
    startDate: String
    endDate: String
}

type Address {
    id: ID!
    street: String!
    number: String!
    neighborhood: String
    city: String!
    gps: String!
    complement: String
    userId: String!
    confirmed: Boolean!
    active: Boolean!
    visited: String
}

type Query {
    card(action: String!, id: ID): CardResponse
    address(action: String!, id: ID, input: FilterAddressInput): AddressResponse

}


type Mutation {
    cardMutation(action: String!, newCard: NewCardInput, id: ID, updateCardInput: UpdateCardInput): CardMutationResponse!
    addressMutation(action: String!, newAddress: NewAddressInput, id: ID, updateAddressInput: UpdateAddressInput): AddressMutationResponse!

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

}

input UpdateCardInput {
    street: [String]
    userId: String
    number: Int
    startDate: String
    endDate: String
}

type CardMutationResponse {
    success: Boolean
    message: String
    card: Card
}

input FilterAddressInput {
    street: String
    neighborhood: String
    city: String!
    confirmed: Boolean!
    active: Boolean!

}

type AddressResponse {
    address: [Address]
    success: Boolean
    message: String
}

input NewAddressInput {
    userId: String!
    street: String!
    number: String!
    neighborhood: String
    city: String!
    gps: String
    complement: String
    confirmed: Boolean!
    active: Boolean!
    visited: String
}
input UpdateAddressInput {
    userId: String
    street: String
    number: String
    neighborhood: String
    city: String
    gps: String
    complement: String
    confirmed: Boolean
    active: Boolean
    visited: String
}

type AddressMutationResponse {
    success: Boolean
    message: String
    address: Address

}
`;

export default cardTypeDef;
