const typeDef = `
type Nutrient implements Node {
  id: ID!
  name: String!
  amount: Int!
  unit: String!
}

input NutrientInput {
  name: String!
  amount: Int!
}
`;

module.exports = {
  typeDef,
};
