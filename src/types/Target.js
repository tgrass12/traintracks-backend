const typeDef = `
interface Target {
  id: ID!
  type: String!
}

type NutritionTarget implements Target {
  id: ID!
  type: String!
  nutrientName: String!
  unit: String!
  amount: Int!
}

extend type Query {
  targetsByUser(userId: ID!, type: String = ""): [Target!]!
}

input NutritionTargetInput {
  nutrientName: String!
  amount: Int!
}
`;

module.exports = {
  typeDef,
};
