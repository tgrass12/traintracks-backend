const mongoose = require('mongoose');
const Meal = require('./Meal');
const Nutrients = require('./Nutrients');

const nutritionJournalSchema = new mongoose.Schema({
  meals: [Meal.schema],
  water: {
    type: Number,
    default: 0,
  },
  logged: Nutrients.schema,
  targets: Nutrients.schema,
});

const NutritionJournal = mongoose.model(
  'nutritionjournal',
  nutritionJournalSchema,
);

module.exports = NutritionJournal;
