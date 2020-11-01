const typeDef = `
type NutritionLog implements Node {
  id: ID!
  date: Date!
  waterIntake: Int!
  mealOccasions: [MealOccasion!]!
}

extend type Query {
  nutritionLogByDate(date: Date!): NutritionLog
}

extend type Mutation {
  nutritionLogUpdateWaterIntake(date: Date!, intakeAmount: Int!): NutritionLog!
  nutritionLogAddFood(date: Date!, foodToLog: LogFoodInput!): NutritionLog!
  nutritionLogRemoveFood(loggedFoodId: ID!): NutritionLog!
}

input LogFoodInput {
  mealOccasion: String!
  foodId: ID!
  servings: Float!
}
`;

module.exports = {
  typeDef,
};
