const typeDef = `
type NutritionLog implements Node {
  id: ID!
  date: Date!
  waterIntake: Int!
  mealOccasions: [MealOccasion!]!
  consumption: [Nutrient!]!
  targets: [NutritionTarget!]!
}

extend type Query {
  nutritionLog(id: ID!): NutritionLog
  nutritionLogByDate(date: Date!): NutritionLog
}

extend type Mutation {
  nutritionLogSetTarget(date: Date!, target: NutrientInput!): NutritionLog!
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
