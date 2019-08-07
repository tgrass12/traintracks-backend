const mongoose = require('mongoose');
const Macros = require('./Macros');
const Micros = require('./Micros');

const nutrientsSchema = new mongoose.Schema({
	calories: {
		type: Number,
		default: 0
	},
	macros:  {
		type: Macros.schema,
		default: Macros.schema
	},
	micros: {
		type: Micros.schema,
		default: Micros.schema
	}
}, {_id: false});

const Nutrients = mongoose.model('nutrients', nutrientsSchema);

module.exports = Nutrients;