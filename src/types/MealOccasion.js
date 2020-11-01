const typeDef = `
type MealOccasion implements Node {
  id: ID!
  name: String!
  foods: [LoggedFood!]!
}

input MealOccasionInput {
  name: String!
}
`;

module.exports = {
  typeDef,
};
