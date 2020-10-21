const mongoose = require('mongoose');
const Food = require('./Food');
const util = require('../shared/util');
const ObjectId = require('mongoose').Types.ObjectId;

let applyServings = function (food) {
  return util.deepMapNumber(food, (nutrient) => nutrient * this.servings);
};

let loggedFoodSchema = mongoose.Schema({
  servings: {
    type: Number,
    default: 1,
  },
  food: {
    type: Food.schema,
    set: applyServings,
  },
});

const LoggedFood = mongoose.model('loggedfood', loggedFoodSchema);

module.exports = LoggedFood;
