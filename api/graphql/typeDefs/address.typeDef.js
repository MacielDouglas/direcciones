const addressTypeDef = `#graphql

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
    visited: Boolean
    group: String! # Campo obrigatório para alinhar com User e Card
}

type Query {
    address(action: String!, id: ID, input: FilterAddressInput!): AddressResponse
}

input FilterAddressInput {
    street: String
}

type AddressResponse {
    address: [Address]
    success: Boolean
    message: String
}

type Mutation {
    addressMutation(
        action: String!, 
        newAddress: NewAddressInput, 
        id: ID, 
        updateAddressInput: UpdateAddressInput
    ): AddressMutationResponse!
}

input NewAddressInput {
    userId: String!
    street: String!
    number: String!
    neighborhood: String
    city: String!
    gps: String
    complement: String
    type: String!
    photo: String
    confirmed: Boolean!
    active: Boolean!
    visited: Boolean
    group: String! # O grupo é obrigatório para criação de um novo endereço
}

input UpdateAddressInput {
    userId: String
    street: String
    number: String
    neighborhood: String
    city: String
    gps: String
    complement: String
    type: String
    photo: String
    confirmed: Boolean
    active: Boolean
    visited: Boolean
    group: String # O grupo pode ser atualizado
}

type AddressMutationResponse {
    success: Boolean
    message: String
    address: Address
}
`;

export default addressTypeDef;
