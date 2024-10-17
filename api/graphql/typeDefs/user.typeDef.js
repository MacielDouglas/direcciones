const userTypeDef = `#graphql

type Comment {
    cardId: ID!       # ID do card associado
    text: String!     # Texto do comentário com limite de 250 caracteres
}

type User {
    id: ID!
    name: String!
    email: String!
    password: String!
    profilePicture: String!
    isAdmin: Boolean!
    group: String!
    isSS: Boolean!
    myCards: [String]
    myTotalCards: [String]
    comments: [Comment]  # Alterado para ser uma lista de "Comment"
}

type Query {
    getUser(id: ID!): User
    loginUser(email: String!, password: String!): LoginResponse!
    logoutUser: LogoutResponse!
}

type Mutation {
    createUser(user: NewUserInput!): User
    deleteUser(id: ID!): DeleteUserResponse
    updateUser(id: ID!, updateUserInput: UpdateUserInput!): UpdateUserResponse!
}

type DeleteUserResponse {
    success: Boolean!
    message: String!
}

input UpdateUserInput {
    name: String
    profilePicture: String
}

type UpdateUserResponse {
    success: Boolean!
    message: String
    name: String
    profilePicture: String
    isAdmin: Boolean

}

type LoginResponse {
    token: String!
    id: ID!
    name: String!
    profilePicture: String!
    isAdmin: Boolean!
    group: String!
    isSS: Boolean!
    myCards: [String]
    myTotalCards: [String]
    comments: [Comment]
}

type LogoutResponse {
    success: Boolean!
    message: String!
}

input NewUserInput {
    name: String!
    email: String!
    password: String!
    profilePicture: String!
    isAdmin: Boolean
    group: String
    isSS: Boolean
}


`;

export default userTypeDef;
