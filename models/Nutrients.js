const mongoose = require('mongoose');

const nutrientsSchema = new mongoose.Schema({
	energy: {
		type: Number,
		default: 0
	},
	totalCarbs: {
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
	},
	protein: {
		type: Number,
		default: 0
	},
	totalFats: {
		type: Number,
		default: 0
	},
	saturatedFats: {
		type: Number,
		default: 0
	},
	polyUnsaturatedFats: {
		type: Number,
		default: 0
	},
	monoUnsaturatedFats: {
		type: Number,
		default: 0
	},
	transFats: {
		type: Number,
		default: 0
	},
	'Calcium': {
		type: Number,
		default: 0
	},
	'Iron': {
		type: Number,
		default: 0
	},
	'Magnesium': {
    type: Number,
    default: 0,
  },
	'Sodium': {
    type: Number,
    default: 0,
  },
	'Potassium': {
    type: Number,
    default: 0,
  },
	'Zinc': {
    type: Number,
    default: 0,
  },
	'Phosphorus': {
    type: Number,
    default: 0,
  },
	'Vitamin A': {
		type: Number,
		default: 0
	},
	'Vitamin C': {
		type: Number,
		default: 0
	},
	'Vitamin D': {
    type: Number,
    default: 0,
  },
	'Vitamin E': {
    type: Number,
    default: 0,
  },
	'Vitamin K': {
    type: Number,
    default: 0,
  },
	'Vitamin B5': {
    type: Number,
    default: 0,
  },
	'Vitamin B6': {
    type: Number,
    default: 0,
  },
	'Vitamin B12': {
    type: Number,
    default: 0,
  },
	'Thiamin': Number,
	'Riboflavin': {
    type: Number,
    default: 0,
  },
	'Niacin': {
    type: Number,
    default: 0,
  },
	'Biotin': {
    type: Number,
    default: 0,
  },
	'Folate': {
    type: Number,
    default: 0,
  },
}, {_id: false});

const Nutrients = mongoose.model('nutrients', nutrientsSchema);

module.exports = Nutrients;
