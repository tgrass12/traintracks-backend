const mongoose = require('mongoose');

const vitaminsSchema = new mongoose.Schema({
	'A': {
		type: Number,
		default: 0
	},
	'C': {
		type: Number,
		default: 0
	},
	'D': Number,
	'E': Number,
	'K': Number,
	'B5': Number,
	'B6': Number,
	'B12': Number,
	'Thiamin': Number,
	'Riboflavin': Number,
	'Niacin': Number,
	'Biotin': Number,
	'Folate': Number
}, {_id: false});

const Vitamins = mongoose.model('vitamins', vitaminsSchema);

module.exports = Vitamins;