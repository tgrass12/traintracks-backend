const typeDef = `
type LoggedFood implements Node {
  id: ID!
  servings: Float!
  food: Food!
}
`;

module.exports = {
  typeDef,
};
