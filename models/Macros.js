const mongoose = require('mongoose');

const macrosSchema = new mongoose.Schema({
	carbs: {
		total: {
			type: Number,
			default: 0
		},
		fiber: {
			type: Number,
			default: 0
		},
		sugars: {
			type: Number,
			default: 0
		}
	},
	protein: {
		type: Number,
		default: 0
	},
	fats: {
		total: {
			type: Number,
			default: 0
		},
		sat: {
			type: Number,
			default: 0
		},
		poly: {
			type: Number,
			default: 0
		},
		mono: {
			type: Number,
			default: 0
		},
		trans: {
			type: Number,
			default: 0
		}
	}
}, {'_id': false});

const Macros = mongoose.model('macros', macrosSchema);

module.exports = Macros;