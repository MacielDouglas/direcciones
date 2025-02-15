const userTypeDef = `#graphql

type Comment {
    cardId: ID!  
    text: String!   
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
    visited: Boolean
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
    isSCards: Boolean!
    myCards: [CardAssociation]
    myTotalCards: [CardAssociation]
    comments: [Comment] 
    idToken: String
    codUser: Int!
}

type CardAssociation {
    cardId: ID!
    date: String!
}

type CardWithStreet {
    id: ID!
    number: Int
    startDate: String
    endDate: String
    streets: [Address]
}

type UserSummary {
    id: ID!
    name: String!
    group: String
    codUser: Int
    profilePicture: String
    myCards: [CardAssociation]
}

type Query {
    user(action: String!, id: ID, email: String, password: String, group: String): UserResponse
    getUsers: UsersResponse
    firebaseConfig: EncryptedConfig
}


type Mutation {
    userMutation(action: String!, user: NewUserInput, id: ID, updateUserInput: UpdateUserInput, idToken: String): UserMutationResponse!
    loginGoogle(user: UserGoogle!): UserResponse
}

type UserResponse {
    user: User
    success: Boolean
    message: String
}

type UsersResponse {
    users: [UserSummary]
    success: Boolean!
    message: String
}

type UserMutationResponse {
    success: Boolean!
    message: String
    user: User
}

input UserGoogle {
    displayName: String!
    email: String!
    photoUrl: String!
    # name: String!
    uid: String!
}

type LoginGoogleResponse {
    success: Boolean!
    message: String!
    name: String!
    photoUrl: String
    
}

input UpdateUserInput {
    userMutationId: String
    newName: String
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

type EncryptedConfig {
  encryptedData: String
}
`;

export default userTypeDef;
