const mongoose = require('mongoose');
const Nutrients = require('./Nutrients');
const Food = require('./Food');

const dietSchema = new mongoose.Schema({
	foods: [{
		'food': { 
			type: mongoose.Schema.Types.ObjectId, 
			ref: 'food'
		},
		'quantity': {
			type: Number,
			default: 1
		}
	}],
	goals: Nutrients.schema,
	total:  Nutrients.schema,
	manual: {
		type: Nutrients.schema,
		default: Nutrients.schema
	}
}, {'_id': false});

const Diet  = mongoose.model('diet', dietSchema);

module.exports = Diet;