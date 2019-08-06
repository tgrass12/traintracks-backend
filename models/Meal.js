const mongoose = require('mongoose');
const Nutrients = require('./Nutrients');

const mealSchema = new mongoose.Schema({
	name: {
		type: String,
		default: 'Lunch'
	},
	foods: [{ type: mongoose.Schema.Types.ObjectId, ref:'loggedfood'}],
	total:  {
		type: Nutrients.schema,
		default: Nutrients.schema
	}
});

const Meal = mongoose.model('meal', mealSchema);

module.exports = Meal; 