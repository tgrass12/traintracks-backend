const mongoose = require('mongoose');
const Macros = require('./Macros');

const foodSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	calories: {
		type: Number,
		required: true
	},
	macros: Macros.schema
});

const Food = mongoose.model('food', foodSchema);

module.exports = Food;