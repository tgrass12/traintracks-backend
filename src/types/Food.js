const typeDef = `
type Food implements Node {
  id: ID!
  name: String!
  nutrients: [Nutrient!]!
}

extend type Query {
  food(id: ID!): Food
}

extend type Mutation {
  foodAdd(food: FoodInput!): Food!
}

input FoodInput {
  name: String!
  nutrients: [NutrientInput!]!
}
`;

module.exports = {
  typeDef,
};
