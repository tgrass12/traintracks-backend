const mongoose = require('mongoose');
const Minerals = require('./Minerals');
const Vitamins = require('./Vitamins');

const microsSchema = new mongoose.Schema({
	vitamins: {
		type: Vitamins.schema,
		default: Vitamins.schema
	},
	minerals: {
		type: Minerals.schema,
		default: Minerals.schema
	}
}, {_id: false});

const Micros = mongoose.model('micros', microsSchema);

module.exports = Micros;