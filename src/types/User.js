const typeDef = `
type User implements Node {
  id: ID!
  username: String!
  firstName: String
  lastName: String
  email: String!
  journalEntries: [JournalEntry!]!
  mealOccasions: [String!]!
  targets: [Target!]!
}

extend type Query {
  user(id: ID!): User
}

extend type Mutation {
  userSetMealOccasions(occasions: [String!]!): User!
  userSetNutritionTarget(target: NutritionTargetInput!): User!
}
`;

module.exports = {
  typeDef,
};
