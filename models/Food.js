const mongoose = require('mongoose');
const Macros = require('./Macros');
const Micros = require('./Micros');

const foodSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	cals: {
		type: Number,
		required: true
	},
	macros: {
		type: Macros.schema,
		default: Macros.schema
	},
	micros: {
		type: Micros.schema,
		default: Macros.schema
	}
});

foodSchema.index({ 'name':  'text' });

const Food = mongoose.model('food', foodSchema);

module.exports = Food;