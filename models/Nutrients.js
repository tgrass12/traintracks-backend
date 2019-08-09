const mongoose = require('mongoose');
const Macros = require('./Macros');
const Micros = require('./Micros');

const nutrientsSchema = new mongoose.Schema({
	cals: {
		type: Number,
		default: 0
	},
	macros: Macros.schema,
	micros: Micros.schema
}, {_id: false});

const Nutrients = mongoose.model('nutrients', nutrientsSchema);

module.exports = Nutrients;