const mongoose = require('mongoose');

const mineralsSchema = new mongoose.Schema({
	'Calcium': {
		type: Number,
		default: 0
	},
	'Iron': {
		type: Number,
		default: 0
	},
	'Magnesium': Number,
	'Sodium': Number,
	'Potassium': Number,
	'Zinc': Number,
	'Phosphorus': Number
}, {_id: false});

const Minerals = mongoose.model('minerals', mineralsSchema);

module.exports = Minerals;