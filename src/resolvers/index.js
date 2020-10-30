const { GraphQLDate } = require('graphql-iso-date');
const Query = require('./Query');
const Mutation = require('./Mutation');
const User = require('./User');
const JournalEntry = require('./JournalEntry');
const Food = require('./Food');
const NutritionLog = require('./NutritionLog');
const MealOccasion = require('./MealOccasion');
const LoggedFood = require('./LoggedFood');
const Target = require('./Target');

const Scalars = {
  Date: GraphQLDate,
};

module.exports = {
  ...Scalars,
  Query,
  Mutation,
  User,
  JournalEntry,
  Food,
  NutritionLog,
  MealOccasion,
  LoggedFood,
  Target,
};
