const { mergeResolvers } = require('@graphql-tools/merge');
const { resolvers: Scalars } = require('./Scalars');
const { resolvers: Node } = require('./Node');
const { resolvers: Auth } = require('./Auth');
const { resolvers: User } = require('./User');
const { resolvers: Target } = require('./Target');
const { resolvers: Food } = require('./Food');
const { resolvers: JournalEntry } = require('./JournalEntry');
const { resolvers: NutritionLog } = require('./NutritionLog');
const { resolvers: MealOccasion } = require('./MealOccasion');
const { resolvers: LoggedFood } = require('./LoggedFood');

const resolvers = [
  Scalars,
  Node,
  Auth,
  User,
  Target,
  JournalEntry,
  Food,
  NutritionLog,
  MealOccasion,
  LoggedFood,
];

module.exports = {
  resolvers: mergeResolvers(resolvers),
};
