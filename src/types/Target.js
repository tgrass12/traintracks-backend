const typeDef = `
interface Target {
  id: ID!
  type: String!
}

type NutritionTarget implements Target {
  id: ID!
  type: String!
  nutrient: String!
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
