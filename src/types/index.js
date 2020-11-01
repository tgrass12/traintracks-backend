const { mergeTypeDefs } = require('@graphql-tools/merge');
const { typeDef: Scalars } = require('./Scalars');
const { typeDef: Query } = require('./Query');
const { typeDef: Mutation } = require('./Mutation');
const { typeDef: Node } = require('./Node');
const { typeDef: Auth } = require('./Auth');
const { typeDef: User } = require('./User');
const { typeDef: Target } = require('./Target');
const { typeDef: Nutrient } = require('./Nutrient');
const { typeDef: Food } = require('./Food');
const { typeDef: JournalEntry } = require('./JournalEntry');
const { typeDef: NutritionLog } = require('./NutritionLog');
const { typeDef: MealOccasion } = require('./MealOccasion');
const { typeDef: LoggedFood } = require('./LoggedFood');

const typeDefs = [
  Scalars,
  Query,
  Mutation,
  Node,
  Auth,
  User,
  Target,
  Food,
  JournalEntry,
  NutritionLog,
  MealOccasion,
  LoggedFood,
  Nutrient,
];

module.exports = {
  typeDefs: mergeTypeDefs(typeDefs),
};
