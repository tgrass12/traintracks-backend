const mongoose = require('mongoose');
const Nutrients = require('./Nutrients');
const Food = require('./Food');

const mealSchema = new mongoose.Schema({
	name: {
		type: String,
		default: 'Lunch'
	},
	foods: [{
		'food': { 
			type: mongoose.Schema.Types.ObjectId, 
			ref: 'food'
		},
		'servings': {
			type: Number,
			default: 1
		}
	}],
	total:  Nutrients.schema,
	manual: {
		type: Nutrients.schema,
		default: Nutrients.schema
	}
});

const Meal  = mongoose.model('meal', mealSchema);

module.exports = Meal;