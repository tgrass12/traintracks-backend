const mongoose = require('mongoose');
const Macros = require('./Macros');

const nutrientsSchema = new mongoose.Schema({
	calories: {
		type: Number,
		default: 0
	},
	macros:  {
		type: Macros.schema,
		default: Macros.schema
	}
}, {_id: false});

const Nutrients = mongoose.model('nutrients', nutrientsSchema);

module.exports = Nutrients;