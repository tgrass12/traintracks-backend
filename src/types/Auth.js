const typeDef = `
type AuthPayload {
  user: User
}

extend type Mutation {
  authenticate: AuthPayload,
  signup(email: String!, password: String!, username: String!): AuthPayload
  login(username: String!, password: String!): AuthPayload
  logout: String
}
`;

module.exports = {
  typeDef,
};
