const typeDef = `
interface Target {
  id: ID!
  type: String!
}

type NutritionTarget implements Node & Target {
  id: ID!
  type: String!
  name: String!
  unit: String!
  amount: Int!
}

extend type Query {
  targetsByUser(userId: ID!, type: String = ""): [Target!]!
}

input NutritionTargetInput {
  nutrient: String!
  amount: Int!
}
`;

module.exports = {
  typeDef,
};
