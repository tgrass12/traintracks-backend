const mongoose = require('mongoose');
const Nutrients = require('./Nutrients');

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    text: true,
  },
  nutrients: {
    type: Nutrients.schema,
    default: Nutrients.schema,
    required: true,
  },
});

const Food = mongoose.model('food', foodSchema);

module.exports = Food;
