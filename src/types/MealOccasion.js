const typeDef = `
type MealOccasion implements Node {
  id: ID!
  name: String!
  loggedFoods: [LoggedFood!]!
}

input MealOccasionInput {
  name: String!
}
`;

module.exports = {
  typeDef,
};
